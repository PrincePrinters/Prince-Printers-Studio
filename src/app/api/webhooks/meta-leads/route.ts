import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { LeadItem } from '@/lib/types';
import { addLead, followUpTomorrow } from '@/lib/leads';

/*
 * Facebook / Instagram Lead Ads → Admin leads pipeline.
 * Hosting environment variables:
 *   META_VERIFY_TOKEN       (required) any secret word; same word goes in Meta webhook setup
 *   META_APP_SECRET         (recommended) checks that requests really come from Meta
 *   META_PAGE_ACCESS_TOKEN  (recommended) lets us fetch the lead's name / phone / email
 */

const GRAPH = 'https://graph.facebook.com/v21.0';

// 1. Meta webhook verification (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verifyToken = process.env.META_VERIFY_TOKEN;
  if (
    verifyToken &&
    searchParams.get('hub.mode') === 'subscribe' &&
    searchParams.get('hub.verify_token') === verifyToken
  ) {
    return new Response(searchParams.get('hub.challenge') || '', { status: 200 });
  }
  return new Response('Forbidden: Verification token mismatch', { status: 403 });
}

function signatureOk(raw: string, header: string | null) {
  const secret = process.env.META_APP_SECRET;
  if (!secret) return true; // not configured: accept (verify token still protects setup)
  if (!header?.startsWith('sha256=')) return false;
  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(raw).digest('hex');
  return header.length === expected.length && crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected));
}

interface FieldData {
  name: string;
  values: string[];
}

async function fetchLeadFields(leadgenId: string): Promise<Record<string, string>> {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token) return {};
  try {
    const res = await fetch(`${GRAPH}/${encodeURIComponent(leadgenId)}?access_token=${encodeURIComponent(token)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return {};
    const data = (await res.json()) as { field_data?: FieldData[] };
    const out: Record<string, string> = {};
    for (const f of data.field_data || []) out[f.name.toLowerCase()] = (f.values?.[0] || '').slice(0, 200);
    return out;
  } catch {
    return {};
  }
}

// 2. Meta inbound lead (POST)
export async function POST(request: Request) {
  const raw = await request.text();
  if (!signatureOk(raw, request.headers.get('x-hub-signature-256'))) {
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
  }

  let payload: { entry?: { changes?: { field?: string; value?: { leadgen_id?: string; page_id?: string; form_id?: string } }[] }[] };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  let saved = 0;
  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const v = change.value;
      if (change.field !== 'leadgen' || !v?.leadgen_id) continue;

      const f = await fetchLeadFields(v.leadgen_id);
      const name = f.full_name || [f.first_name, f.last_name].filter(Boolean).join(' ') || 'Meta Lead';
      const extra = Object.entries(f)
        .filter(([k]) => !['full_name', 'first_name', 'last_name', 'phone_number', 'email'].includes(k))
        .map(([k, val]) => `${k}: ${val}`);

      const lead: LeadItem = {
        id: `meta-${v.leadgen_id}`,
        name,
        phone: f.phone_number || '',
        email: f.email || '',
        eventType: f.event_type || 'Meta Lead Ad',
        eventDate: f.event_date || '',
        budget: f.budget || 'Custom Quote',
        source: 'Meta Ads',
        status: 'New',
        priority: 'Hot',
        followUpDate: followUpTomorrow(),
        nextAction: f.phone_number ? 'Initial welcome call' : 'Meta Leads Center mein details dekhiye',
        notes: [
          [
            `Meta Lead ID: ${v.leadgen_id}`,
            v.form_id && `Form: ${v.form_id}`,
            !process.env.META_PAGE_ACCESS_TOKEN && 'Naam/phone ke liye META_PAGE_ACCESS_TOKEN set kariye',
            ...extra,
          ]
            .filter(Boolean)
            .join(' — '),
        ],
        callLogs: [],
        createdAt: new Date().toISOString(),
      };
      if (await addLead(lead)) saved++;
    }
  }

  return NextResponse.json({ success: true, saved });
}
