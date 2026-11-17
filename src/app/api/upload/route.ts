import { NextResponse } from 'next/server';
import {
  putObject,
  publicUrl,
  storageProvider,
  cleanEventCode,
  cleanSegment,
  appendFaceIndex,
} from '@/lib/storage';
import { isAdminRequest } from '@/lib/admin-auth';
import { ensureEvent } from '@/lib/events';

const EXT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif',
  avif: 'image/avif', heic: 'image/heic', mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', m4v: 'video/mp4',
};

/**
 * POST multipart/form-data (admin only)
 *   file       – photo or video
 *   eventCode  – e.g. RAHUL2026
 *   folder     – e.g. Haldi / Wedding / Reception
 *   faces      – optional JSON: number[][] face descriptors computed in the admin's browser
 */
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: 'Admin login required' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const type =
      file.type && file.type !== 'application/octet-stream' ? file.type : EXT_TYPES[ext] || 'application/octet-stream';
    // Extension must be a known photo/video type too (stops e.g. "evil.html" sent as image/png)
    if (!EXT_TYPES[ext] || (!type.startsWith('image/') && !type.startsWith('video/'))) {
      return NextResponse.json({ success: false, error: 'Only photos and videos are allowed' }, { status: 400 });
    }

    const eventCode = cleanEventCode(String(formData.get('eventCode') || ''));
    if (!eventCode) {
      return NextResponse.json({ success: false, error: 'Event code is required' }, { status: 400 });
    }
    const folder = cleanSegment(String(formData.get('folder') || ''), 'Highlights');
    const cleanFilename = cleanSegment(file.name.replace(/\s+/g, '_'), 'file');
    const key = `events/${eventCode}/${folder}/${Date.now()}_${cleanFilename}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await putObject(key, buffer, type);
    await ensureEvent(eventCode);
    const url = publicUrl(key);

    // Optional face index for selfie search
    let facesIndexed = 0;
    const facesRaw = formData.get('faces');
    if (typeof facesRaw === 'string' && facesRaw) {
      try {
        const parsed = JSON.parse(facesRaw);
        const descriptors: number[][] = Array.isArray(parsed)
          ? parsed
              .filter((d) => Array.isArray(d) && d.length === 128 && d.every((n) => typeof n === 'number'))
              .slice(0, 50)
          : [];
        if (descriptors.length) {
          await appendFaceIndex(eventCode, { key, url, descriptors });
          facesIndexed = descriptors.length;
        }
      } catch {
        // invalid face data is ignored; the upload itself still succeeded
      }
    }

    return NextResponse.json({
      success: true,
      provider: storageProvider(),
      storageKey: key,
      url,
      filename: cleanFilename,
      sizeBytes: buffer.length,
      eventCode,
      folder,
      facesIndexed,
    });
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Upload processing failed' },
      { status: 500 }
    );
  }
}
