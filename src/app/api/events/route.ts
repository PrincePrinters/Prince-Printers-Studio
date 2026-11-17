import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { listEvents, saveEvent, deleteEvent } from '@/lib/events';

const unauthorized = () => NextResponse.json({ success: false, error: 'Admin login required' }, { status: 401 });

/** GET — admin: all events (newest first) */
export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();
  return NextResponse.json({ success: true, events: await listEvents() });
}

/** POST — admin: create or update an event { eventCode, title, clientName, clientPhone, eventDate, location, coverImage } */
export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
  const event = await saveEvent(body);
  if (!event) return NextResponse.json({ success: false, error: 'Sahi event code likhiye (A-Z, 0-9)' }, { status: 400 });
  return NextResponse.json({ success: true, event });
}

/** DELETE ?code=XYZ — admin: remove the event entry (uploaded files stay in storage) */
export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) return unauthorized();
  const code = new URL(request.url).searchParams.get('code') || '';
  if (!code) return NextResponse.json({ success: false, error: 'code required' }, { status: 400 });
  await deleteEvent(code);
  return NextResponse.json({ success: true });
}
