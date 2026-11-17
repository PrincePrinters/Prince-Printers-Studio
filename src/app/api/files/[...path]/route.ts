import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { LOCAL_ROOT } from '@/lib/storage';

const TYPES: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif',
  avif: 'image/avif', heic: 'image/heic', mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm',
  m4v: 'video/mp4', json: 'application/json',
};

/** Serves media saved on this server's disk (used when Cloudflare R2 is not configured). */
export async function GET(request: Request, ctx: RouteContext<'/api/files/[...path]'>) {
  const { path: parts } = await ctx.params;
  const file = path.resolve(LOCAL_ROOT, ...parts.map((p) => decodeURIComponent(p)));
  if (!file.startsWith(LOCAL_ROOT + path.sep)) return new Response('Not found', { status: 404 });

  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(file);
    if (!stat.isFile()) throw new Error();
  } catch {
    return new Response('Not found', { status: 404 });
  }

  const type = TYPES[path.extname(file).slice(1).toLowerCase()] || 'application/octet-stream';
  const headers: Record<string, string> = {
    'Content-Type': type,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  };

  // Range requests (needed for video playback on phones)
  const range = request.headers.get('range')?.match(/^bytes=(\d*)-(\d*)$/);
  if (range && (range[1] || range[2])) {
    let start = range[1] ? Number(range[1]) : stat.size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : stat.size - 1;
    start = Math.max(0, start);
    end = Math.min(end, stat.size - 1);
    if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${stat.size}` } });
    const stream = Readable.toWeb(fs.createReadStream(file, { start, end })) as ReadableStream;
    return new Response(stream, {
      status: 206,
      headers: { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': String(end - start + 1) },
    });
  }

  const stream = Readable.toWeb(fs.createReadStream(file)) as ReadableStream;
  return new Response(stream, { headers: { ...headers, 'Content-Length': String(stat.size) } });
}
