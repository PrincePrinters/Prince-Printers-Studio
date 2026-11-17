import { NextResponse } from 'next/server';
import { listObjects, publicUrl, cleanEventCode, readFaceIndex, faceIndexKey } from '@/lib/storage';
import { getEvent, toPublic } from '@/lib/events';

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|heic)$/i;
const VIDEO_EXT = /\.(mp4|mov|webm|m4v)$/i;

/** GET /api/events/CODE/media → all photos & videos uploaded for this event (+ face index) */
export async function GET(_req: Request, ctx: RouteContext<'/api/events/[code]/media'>) {
  const { code } = await ctx.params;
  const eventCode = cleanEventCode(code);
  if (!eventCode) return NextResponse.json({ success: false, error: 'Invalid code' }, { status: 400 });

  const objects = await listObjects(`events/${eventCode}/`);
  const media = objects
    .filter((o) => o.key !== faceIndexKey(eventCode) && (IMAGE_EXT.test(o.key) || VIDEO_EXT.test(o.key)))
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((o) => {
      const parts = o.key.split('/'); // events/CODE/Folder/123_name.jpg
      const filename = parts[parts.length - 1];
      return {
        key: o.key,
        url: publicUrl(o.key),
        folder: parts.length > 3 ? parts[2] : 'Highlights',
        filename,
        title: filename.replace(/^\d+_/, '').replace(/\.[^.]+$/, '').replace(/_/g, ' '),
        mediaType: VIDEO_EXT.test(o.key) ? 'video' : 'image',
        sizeBytes: o.size,
      };
    });

  const [faces, event] = await Promise.all([readFaceIndex(eventCode), getEvent(eventCode)]);

  return NextResponse.json({
    success: true,
    eventCode,
    event: event ? toPublic(event) : null,
    count: media.length,
    media,
    faces,
  });
}
