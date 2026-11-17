/**
 * Media storage: Cloudflare R2 when configured (required on Vercel / live),
 * otherwise the local `public/uploads` folder (fine for local development).
 *
 * Layout:  events/<EVENT_CODE>/<Folder>/<timestamp>_<file>
 *          events/<EVENT_CODE>/faces.json   (face index for selfie search)
 */
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

export const LOCAL_ROOT = path.join(process.cwd(), 'public', 'uploads');

function r2Configured() {
  const id = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const key = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secret = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  return Boolean(id && key && secret && ![id, key, secret].some((v) => v.includes('your_')));
}

let client: S3Client | null = null;
function r2() {
  if (!r2Configured()) return null;
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
      },
    });
  }
  return client;
}

const bucket = () => process.env.CLOUDFLARE_R2_BUCKET_NAME || 'quickart-media';

export const storageProvider = () => (r2() ? 'cloudflare_r2' : 'local_storage');

/** Event codes are used in storage paths, so keep them strictly alphanumeric. */
export function cleanEventCode(code: string) {
  return (code || '').toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 40);
}

export function cleanSegment(value: string, fallback: string) {
  const v = (value || '').replace(/[^a-zA-Z0-9 _.-]/g, '').replace(/^[.\s]+/, '').trim().slice(0, 60);
  return v || fallback;
}

export function publicUrl(key: string) {
  if (r2()) {
    const domain = (process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || '').replace(/\/$/, '');
    if (domain) return `${domain}/${key}`;
    return `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${bucket()}/${key}`;
  }
  return `/api/files/${key.split('/').map(encodeURIComponent).join('/')}`;
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  const c = r2();
  if (c) {
    await c.send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType }));
    return;
  }
  const file = path.join(LOCAL_ROOT, key);
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, body);
}

export async function getObjectText(key: string): Promise<string | null> {
  const c = r2();
  if (c) {
    try {
      const res = await c.send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
      return (await res.Body?.transformToString()) ?? null;
    } catch {
      return null;
    }
  }
  try {
    return await fs.promises.readFile(path.join(LOCAL_ROOT, key), 'utf8');
  } catch {
    return null;
  }
}

export interface StoredObject {
  key: string;
  size: number;
  lastModified: string;
}

export async function listObjects(prefix: string): Promise<StoredObject[]> {
  const c = r2();
  if (c) {
    const out: StoredObject[] = [];
    let token: string | undefined;
    do {
      const res = await c.send(
        new ListObjectsV2Command({ Bucket: bucket(), Prefix: prefix, ContinuationToken: token })
      );
      for (const o of res.Contents || []) {
        if (o.Key) out.push({ key: o.Key, size: o.Size || 0, lastModified: (o.LastModified || new Date()).toISOString() });
      }
      token = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (token);
    return out;
  }

  const root = path.join(LOCAL_ROOT, prefix);
  const out: StoredObject[] = [];
  async function walk(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else {
        const st = await fs.promises.stat(full);
        out.push({
          key: path.relative(LOCAL_ROOT, full).split(path.sep).join('/'),
          size: st.size,
          lastModified: st.mtime.toISOString(),
        });
      }
    }
  }
  await walk(root);
  return out;
}

/* ---------------- Face index ---------------- */

export interface FaceIndexEntry {
  key: string;
  url: string;
  /** one 128-number descriptor per face found in the photo */
  descriptors: number[][];
}

export const faceIndexKey = (code: string) => `events/${code}/faces.json`;

export async function readFaceIndex(code: string): Promise<FaceIndexEntry[]> {
  const text = await getObjectText(faceIndexKey(code));
  if (!text) return [];
  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function appendFaceIndex(code: string, entry: FaceIndexEntry) {
  const index = await readFaceIndex(code);
  const next = index.filter((e) => e.key !== entry.key);
  next.push(entry);
  await putObject(faceIndexKey(code), Buffer.from(JSON.stringify(next)), 'application/json');
}

/* ---------------- Private data (never publicly served) ----------------
 * R2:    private/<secret-derived-folder>/<name>.json  (unguessable even if the bucket is public)
 * Local: .data/<name>.json  (outside public/, git-ignored)
 */

function privateKey(name: string) {
  const secret = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || 'local';
  const folder = crypto.createHash('sha256').update(`${secret}:studio-private-v1`).digest('hex').slice(0, 32);
  return `private/${folder}/${name}.json`;
}

const LOCAL_PRIVATE = path.join(process.cwd(), '.data');

export async function readPrivateJson<T>(name: string, fallback: T): Promise<T> {
  let text: string | null = null;
  const c = r2();
  if (c) {
    text = await getObjectText(privateKey(name));
  } else {
    try {
      text = await fs.promises.readFile(path.join(LOCAL_PRIVATE, `${name}.json`), 'utf8');
    } catch {
      text = null;
    }
  }
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function writePrivateJson(name: string, data: unknown) {
  const body = Buffer.from(JSON.stringify(data, null, 2));
  const c = r2();
  if (c) {
    await c.send(
      new PutObjectCommand({ Bucket: bucket(), Key: privateKey(name), Body: body, ContentType: 'application/json' })
    );
    return;
  }
  await fs.promises.mkdir(LOCAL_PRIVATE, { recursive: true });
  await fs.promises.writeFile(path.join(LOCAL_PRIVATE, `${name}.json`), body);
}
