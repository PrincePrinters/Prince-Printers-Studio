import { LeadItem } from '@/lib/types';
import { readPrivateJson, writePrivateJson } from '@/lib/storage';

export const LEADS = 'leads';

export async function listLeads(): Promise<LeadItem[]> {
  const list = await readPrivateJson<LeadItem[]>(LEADS, []);
  return Array.isArray(list) ? list : [];
}

/** Adds a lead (newest first). Skips it if a lead with the same id already exists. */
export async function addLead(lead: LeadItem) {
  const leads = await listLeads();
  if (leads.some((l) => l.id === lead.id)) return false;
  leads.unshift(lead);
  await writePrivateJson(LEADS, leads.slice(0, 5000));
  return true;
}

export async function saveLeads(leads: LeadItem[]) {
  await writePrivateJson(LEADS, leads);
}

export function followUpTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}
