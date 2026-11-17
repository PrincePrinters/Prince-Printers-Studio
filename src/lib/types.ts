export interface CallLogItem {
  id: string;
  date: string;
  notes: string;
  outcome: 'Spoke with Bride/Groom' | 'Sent WhatsApp Quote' | 'Callback Requested' | 'Follow-up Due';
  staff: string;
}

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  budget: string;
  source: 'Website Inquiry Form' | 'Contact Page' | 'Meta Ads';
  status: 'New' | 'Contacted' | 'Quoted' | 'Booked' | 'Lost';
  priority: 'Hot' | 'Warm' | 'Cold';
  followUpDate: string;
  nextAction: string;
  notes: string[];
  callLogs: CallLogItem[];
  createdAt: string;
}
