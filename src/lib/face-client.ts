'use client';

/**
 * Browser-side face recognition (face-api / TensorFlow.js).
 * Models are self-hosted in public/models, so nothing is sent to third parties:
 * the guest's selfie never leaves their phone.
 */
type FaceApi = typeof import('@vladmandic/face-api');

let apiPromise: Promise<FaceApi> | null = null;

export function loadFaceApi(): Promise<FaceApi> {
  if (!apiPromise) {
    apiPromise = (async () => {
      const faceapi = (await import(
        // browser build (bundles TensorFlow.js)
        '@vladmandic/face-api/dist/face-api.esm.js'
      )) as unknown as FaceApi;
      await (faceapi.tf as unknown as { ready: () => Promise<void> }).ready();
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
      return faceapi;
    })().catch((err) => {
      apiPromise = null;
      throw err;
    });
  }
  return apiPromise;
}

/** Load an image (File, object URL or remote URL) into an <img> element. */
export function loadImage(src: string | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = typeof src === 'string' ? src : URL.createObjectURL(src);
  });
}

/** Downscale big camera photos so detection is fast on phones. */
function toCanvas(img: HTMLImageElement, maxSide = 1024) {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/** All face descriptors (128 numbers each) found in an image. */
export async function getFaceDescriptors(src: string | File): Promise<number[][]> {
  const faceapi = await loadFaceApi();
  const img = await loadImage(src);
  try {
    const canvas = toCanvas(img);
    const results = await faceapi
      .detectAllFaces(canvas, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.45 }))
      .withFaceLandmarks()
      .withFaceDescriptors();
    return results.map((r) => Array.from(r.descriptor));
  } finally {
    if (typeof src !== 'string') URL.revokeObjectURL(img.src);
  }
}

export function faceDistance(a: number[], b: number[]) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

/** Lower = stricter. 0.5 is a good balance for wedding photos. */
export const MATCH_THRESHOLD = 0.5;

/** Best (smallest) distance between the selfie and any face in a photo. */
export function bestDistance(selfie: number[], photoFaces: number[][]) {
  let best = Infinity;
  for (const f of photoFaces) best = Math.min(best, faceDistance(selfie, f));
  return best;
}
