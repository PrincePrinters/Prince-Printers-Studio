import { NextResponse } from 'next/server';
import { LeadItem } from '@/lib/types';
import { isAdminRequest } from '@/lib/admin-auth';
import { addLead, listLeads, saveLeads, followUpTomorrow } from '@/lib/leads';
const clip = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

/** GET — admin only: all saved website inquiries (newest first) */
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: 'Admin login required' }, { status: 401 });
  }
  const leads = await listLeads();
  return NextResponse.json({ success: true, count: leads.length, leads });
}

/** POST — public: website inquiry / contact form */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }

  const name = clip(body.name, 80);
  const phone = clip(body.phone, 30);
  if (!name || phone.replace(/[^0-9]/g, '').length < 7) {
    return NextResponse.json({ success: false, error: 'Naam aur sahi phone number zaroori hai' }, { status: 400 });
  }

  const newLead: LeadItem = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    phone,
    email: clip(body.email, 120),
    eventType: clip(body.eventType, 120) || 'Wedding',
    eventDate: clip(body.eventDate, 20) || new Date().toISOString().split('T')[0],
    budget: clip(body.budget, 60) || 'Custom Quote',
    source: body.source === 'Contact Page' ? 'Contact Page' : 'Website Inquiry Form',
    status: 'New',
    priority: 'Hot',
    followUpDate: followUpTomorrow(),
    nextAction: 'Initial welcome call & dates availability check',
    notes: [
      [clip(body.location, 120) && `Location: ${clip(body.location, 120)}`, clip(body.notes, 2000)]
        .filter(Boolean)
        .join(' — ') || 'Submitted via website form',
    ],
    callLogs: [],
    createdAt: new Date().toISOString(),
  };

  try {
    await addLead(newLead);
  } catch (error) {
    console.error('Lead save failed:', error);
    return NextResponse.json({ success: false, error: 'Inquiry save nahi ho payi' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Lead captured', leadId: newLead.id }, { status: 201 });
}

/** PATCH — admin only: update one lead (status, call logs, follow-up) */
export async function PATCH(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: 'Admin login required' }, { status: 401 });
  }
  let lead: LeadItem;
  try {
    lead = (await request.json()).lead;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
  const leads = await listLeads();
  const idx = leads.findIndex((l) => l.id === lead?.id);
  if (idx === -1) return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
  leads[idx] = { ...leads[idx], ...lead, id: leads[idx].id, createdAt: leads[idx].createdAt };
  await saveLeads(leads);
  return NextResponse.json({ success: true });
}
