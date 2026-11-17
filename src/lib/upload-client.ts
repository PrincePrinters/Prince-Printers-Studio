'use client';

import { getFaceDescriptors } from '@/lib/face-client';

export interface UploadResult {
  ok: boolean;
  url?: string;
  facesIndexed?: number;
  error?: string;
}

/**
 * Upload one photo/video for an event. For photos, faces are detected in the
 * admin's browser first and sent along, so guests' selfie search is instant.
 */
export async function uploadMediaFile(file: File, eventCode: string, folder: string): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  form.append('eventCode', eventCode);
  form.append('folder', folder);

  if (file.type.startsWith('image/')) {
    try {
      const faces = await getFaceDescriptors(file);
      if (faces.length) form.append('faces', JSON.stringify(faces));
    } catch {
      // face indexing is optional; guests' browsers can still scan this photo later
    }
  }

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) return { ok: false, error: data.error || `Upload failed (${res.status})` };
    return { ok: true, url: data.url, facesIndexed: data.facesIndexed };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}
