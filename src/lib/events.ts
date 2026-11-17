import { readPrivateJson, writePrivateJson, cleanEventCode } from '@/lib/storage';

/** An event / client gallery created by the studio in the Admin panel. */
export interface StudioEvent {
  eventCode: string;
  title: string;
  clientName: string;
  clientPhone: string;
  eventDate: string;
  location: string;
  /** optional cover photo URL (e.g. one of the uploaded photos) */
  coverImage: string;
  createdAt: string;
}

/** Fields that anyone with the event code may see on the gallery page. */
export type PublicEvent = Pick<StudioEvent, 'eventCode' | 'title' | 'eventDate' | 'location' | 'coverImage'>;

const EVENTS = 'events';
const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export async function listEvents(): Promise<StudioEvent[]> {
  const list = await readPrivateJson<StudioEvent[]>(EVENTS, []);
  return Array.isArray(list) ? list : [];
}

export async function getEvent(code: string): Promise<StudioEvent | null> {
  const c = cleanEventCode(code);
  return (await listEvents()).find((e) => e.eventCode === c) || null;
}

export function toPublic(e: StudioEvent): PublicEvent {
  return { eventCode: e.eventCode, title: e.title, eventDate: e.eventDate, location: e.location, coverImage: e.coverImage };
}

/** Create or update (matched by event code). Returns the saved event, or null if the code is invalid. */
export async function saveEvent(input: Record<string, unknown>): Promise<StudioEvent | null> {
  const eventCode = cleanEventCode(String(input.eventCode || ''));
  if (!eventCode) return null;
  const list = await listEvents();
  const existing = list.find((e) => e.eventCode === eventCode);
  const cover = clip(input.coverImage, 500);
  const next: StudioEvent = {
    eventCode,
    title: clip(input.title, 120) || existing?.title || eventCode,
    clientName: clip(input.clientName, 80),
    clientPhone: clip(input.clientPhone, 30),
    eventDate: clip(input.eventDate, 20),
    location: clip(input.location, 120),
    coverImage: /^(https:\/\/|\/)/.test(cover) ? cover : '',
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
  const others = list.filter((e) => e.eventCode !== eventCode);
  await writePrivateJson(EVENTS, [next, ...others]);
  return next;
}

/** Registers an event automatically the first time media is uploaded for a new code. */
export async function ensureEvent(code: string) {
  if (!(await getEvent(code))) await saveEvent({ eventCode: code });
}

export async function deleteEvent(code: string) {
  const c = cleanEventCode(code);
  const list = await listEvents();
  await writePrivateJson(EVENTS, list.filter((e) => e.eventCode !== c));
}
