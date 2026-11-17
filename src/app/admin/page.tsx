'use client';

/* eslint-disable @next/next/no-img-element -- event cover photos come from uploads / R2 */

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users, Calendar, Phone, CheckCircle2, Clock, X, Lock, Upload, Trash2,
  MessageCircle, Columns, List, AlertCircle, KeyRound, ChevronRight, Images, Plus, Save,
} from 'lucide-react';
import { LeadItem, CallLogItem } from '@/lib/types';
import type { StudioEvent } from '@/lib/events';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { studio } from '@/config/studio';
import AdminMediaUploader from '@/components/AdminMediaUploader';

const EMPTY_EVENT = { eventCode: '', title: '', clientName: '', clientPhone: '', eventDate: '', location: '', coverImage: '' };

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [quickUploadCode, setQuickUploadCode] = useState('');

  // Restore an existing admin session (secure httpOnly cookie set by /api/admin/login)
  useEffect(() => {
    fetch('/api/admin/login', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setIsAuthenticated(Boolean(d.authenticated)))
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const [activeTab, setActiveTab] = useState<'pipeline' | 'events'>('pipeline');
  const [leadViewMode, setLeadViewMode] = useState<'kanban' | 'list'>('kanban');

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [leadsLoaded, setLeadsLoaded] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  const [toastMessage, setToastMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const showToast = (text: string, error = false) => {
    setToastMessage({ text, error });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Load website inquiries once logged in
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/leads', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.leads)) setLeads(d.leads);
      })
      .catch(() => showToast('Leads load nahi ho payi', true))
      .finally(() => setLeadsLoaded(true));
  }, [isAuthenticated]);

  const persistLead = (lead: LeadItem) => {
    fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead }),
    })
      .then((r) => {
        if (!r.ok) throw new Error();
      })
      .catch(() => showToast('Change save nahi hua — internet check karke dobara kariye', true));
  };

  /* ---------- Events ---------- */
  const [events, setEvents] = useState<StudioEvent[]>([]);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [savingEvent, setSavingEvent] = useState(false);

  const loadEvents = useCallback(() => {
    fetch('/api/events', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.events)) setEvents(d.events);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadEvents();
  }, [isAuthenticated, loadEvents]);

  const submitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEvent(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Save nahi hua');
      showToast(editingCode ? 'Event update ho gaya' : `Event ${data.event.eventCode} ban gaya — ab photos upload kariye`);
      setQuickUploadCode(data.event.eventCode);
      setEventForm(EMPTY_EVENT);
      setEditingCode(null);
      loadEvents();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Save nahi hua', true);
    } finally {
      setSavingEvent(false);
    }
  };

  const removeEvent = async (code: string) => {
    if (!window.confirm(`${code} event list se hatana hai? (Upload hui photos storage mein rahengi aur gallery link chalta rahega.)`)) return;
    const res = await fetch(`/api/events?code=${encodeURIComponent(code)}`, { method: 'DELETE' }).catch(() => null);
    if (res?.ok) {
      showToast(`${code} hata diya`);
      loadEvents();
    } else showToast('Delete nahi hua', true);
  };

  // Call Log form state
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState<CallLogItem['outcome']>('Spoke with Bride/Groom');
  const [callStaff, setCallStaff] = useState(`${studio.owner.displayName} (${studio.owner.designation})`);
  const [editNextFollowUp, setEditNextFollowUp] = useState('');
  const [editNextAction, setEditNextAction] = useState('');

  // Drag and drop states for Pipeline
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const openLeadDetails = (lead: LeadItem) => {
    setSelectedLead(lead);
    setEditNextFollowUp(lead.followUpDate);
    setEditNextAction(lead.nextAction);
    setLeadModalOpen(true);
  };

  // Pipeline stage shift
  const moveLeadStage = (leadId: string, newStatus: LeadItem['status']) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        const updated = { ...l, status: newStatus };
        persistLead(updated);
        return updated;
      })
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Lead "${newStatus}" stage mein chali gayi`);
  };

  // Add Call Log entry
  const handleAddCallLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !callNotes.trim()) return;

    const newLog: CallLogItem = {
      id: `call-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      notes: callNotes.trim(),
      outcome: callOutcome,
      staff: callStaff,
    };

    const updated: LeadItem = {
      ...selectedLead,
      callLogs: [newLog, ...selectedLead.callLogs],
      followUpDate: editNextFollowUp || selectedLead.followUpDate,
      nextAction: editNextAction || selectedLead.nextAction,
    };
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    persistLead(updated);
    setSelectedLead(updated);

    setCallNotes('');
    setEditNextAction('');
    showToast('Call log aur follow-up save ho gaya');
  };

  // SECURE STAFF GATE: Accessed only via direct URL /admin
  if (!isAuthenticated) {
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: adminPin }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setIsAuthenticated(true);
          setPinError('');
          setAdminPin('');
        } else {
          setPinError(data.error || 'Galat PIN.');
        }
      } catch {
        setPinError('Server se connect nahi ho paya. Dobara try kariye.');
      }
    };

    if (!authChecked) {
      return <div className="min-h-screen bg-slate-950" />;
    }

    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-8 rounded-3xl glass-card border border-amber-500/30 bg-slate-900/90 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
              Restricted Studio Portal
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Director, Photographer & Crew Authentication
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => {
                    setAdminPin(e.target.value);
                    setPinError('');
                  }}
                  placeholder="Enter Master Passcode (PIN)"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-center tracking-widest text-lg font-mono text-white placeholder-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
                  autoFocus
                />
                {pinError && <p className="text-xs text-rose-400 mt-2">{pinError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-amber-500/20 transition"
              >
                Authenticate & Enter Dashboard
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Studio Staff Portal</span>
              <span>Secure Login</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Pipeline columns definition
  const PIPELINE_STAGES: Array<{ id: LeadItem['status']; label: string; color: string }> = [
    { id: 'New', label: '1. New Inquiries', color: 'border-sky-500/40 text-sky-400 bg-sky-950/20' },
    { id: 'Contacted', label: '2. In Discussion', color: 'border-amber-500/40 text-amber-400 bg-amber-950/20' },
    { id: 'Quoted', label: '3. Quotation Sent', color: 'border-purple-500/40 text-purple-400 bg-purple-950/20' },
    { id: 'Booked', label: '4. Shoot Booked (Advance Paid)', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20' },
    { id: 'Lost', label: '5. Lost / Dates Unavailable', color: 'border-slate-700 text-slate-400 bg-slate-900/40' },
  ];

  const today = new Date().toISOString().split('T')[0];
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const dueFollowUps = leads.filter((l) => l.status !== 'Booked' && l.status !== 'Lost' && l.followUpDate && l.followUpDate <= today).length;
  const bookedLeads = leads.filter((l) => l.status === 'Booked').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      <Navbar />

      {/* Global Toast */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[60] px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 ${
            toastMessage.error ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
          }`}
        >
          {toastMessage.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Studio Admin</h1>
            <p className="text-xs text-slate-400">Website inquiries, events aur client galleries yahan se manage kariye.</p>
          </div>
          <button
            onClick={() => {
              fetch('/api/admin/login', { method: 'DELETE' }).catch(() => {});
              setIsAuthenticated(false);
              setAdminPin('');
            }}
            className="w-fit px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Real counts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Inquiries', value: leads.length, icon: Users, color: 'text-amber-400' },
            { label: 'New (abhi call nahi hui)', value: newLeads, icon: Phone, color: 'text-sky-400' },
            { label: 'Follow-up aaj / pending', value: dueFollowUps, icon: Clock, color: 'text-rose-400' },
            { label: 'Booked', value: bookedLeads, icon: CheckCircle2, color: 'text-emerald-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-5 rounded-2xl glass-card border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 text-xs font-semibold overflow-x-auto">
          {([
            { id: 'pipeline', label: `🎯 Leads & Follow-up (${leads.length})` },
            { id: 'events', label: `📸 Events & Galleries (${events.length})` },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: WEBSITE INQUIRIES PIPELINE & FOLLOW-UP CRM        */}
        {/* ======================================================== */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            
            {/* Pipeline Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-slate-800 bg-slate-900/60">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Inquiries Follow-Up Pipeline</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400 font-bold">
                    Website Forms + Meta Ads
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track client conversations, next follow-up dates, call logs, and advance bookings.
                </p>
              </div>

              {/* View Toggle (Kanban vs List) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLeadViewMode('kanban')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    leadViewMode === 'kanban'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Pipeline Columns</span>
                </button>

                <button
                  onClick={() => setLeadViewMode('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    leadViewMode === 'list'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>
              </div>
            </div>

            {leads.length === 0 && (
              <div className="p-6 rounded-2xl border border-dashed border-slate-700 text-center text-sm text-slate-400">
                {leadsLoaded
                  ? 'Abhi koi inquiry nahi aayi. Website ke inquiry / contact form se aane wali har inquiry yahan dikhegi.'
                  : 'Leads load ho rahi hain…'}
              </div>
            )}

            {/* KANBAN PIPELINE VIEW (With HTML5 Drag and Drop) */}
            {leadViewMode === 'kanban' && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
                {PIPELINE_STAGES.map((col) => {
                  const stageLeads = leads.filter((l) => l.status === col.id);
                  const isOver = dragOverCol === col.id;
                  return (
                    <div
                      key={col.id}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        setDragOverCol(col.id);
                      }}
                      onDragLeave={(e) => {
                        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                        setDragOverCol(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
                        if (leadId) {
                          moveLeadStage(leadId, col.id);
                        }
                        setDragOverCol(null);
                        setDraggedLeadId(null);
                      }}
                      className={`rounded-2xl glass-card border p-3 min-h-[520px] flex flex-col transition-all duration-200 ${
                        isOver
                          ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/40 shadow-2xl scale-[1.01]'
                          : 'border-slate-800 bg-slate-900/70'
                      }`}
                    >
                      {/* Column Header */}
                      <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between text-xs font-bold ${col.color}`}>
                        <span>{col.label}</span>
                        <span className="w-5 h-5 rounded-full bg-slate-950/80 flex items-center justify-center text-[10px]">
                          {stageLeads.length}
                        </span>
                      </div>

                      {/* Drop cue banner when dragging over */}
                      {isOver && (
                        <div className="p-2.5 mb-3 rounded-xl border-2 border-dashed border-amber-400 bg-amber-500/20 text-amber-300 text-center text-[11px] font-bold animate-pulse">
                          Drop to move to {col.label}
                        </div>
                      )}

                      {/* Lead Cards */}
                      <div className="space-y-3 flex-1 overflow-y-auto">
                        {stageLeads.length === 0 ? (
                          <div className="text-center py-12 text-slate-600 text-xs italic">
                            No leads in this stage
                          </div>
                        ) : (
                          stageLeads.map((lead) => {
                            const isBeingDragged = draggedLeadId === lead.id;
                            return (
                              <div
                                key={lead.id}
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', lead.id);
                                  e.dataTransfer.effectAllowed = 'move';
                                  setDraggedLeadId(lead.id);
                                }}
                                onDragEnd={() => {
                                  setDraggedLeadId(null);
                                  setDragOverCol(null);
                                }}
                                onClick={() => openLeadDetails(lead)}
                                className={`p-3.5 rounded-xl border transition cursor-grab active:cursor-grabbing select-none ${
                                  isBeingDragged
                                    ? 'opacity-40 scale-95 border-amber-400 bg-slate-900'
                                    : 'border-slate-800 bg-slate-950/85 hover:border-amber-500/50 hover:bg-slate-900'
                                }`}
                              >
                                {/* Client Name & Priority */}
                                <div className="flex items-center justify-between mb-1.5">
                                  <h4 className="font-bold text-white text-xs truncate max-w-[70%]">{lead.name}</h4>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                      lead.priority === 'Hot'
                                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                        : lead.priority === 'Warm'
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'bg-slate-800 text-slate-400'
                                    }`}
                                  >
                                    {lead.priority}
                                  </span>
                                </div>

                                {/* Event & Budget */}
                                <div className="text-[11px] text-slate-300 font-medium truncate mb-1">
                                  {lead.eventType}
                                </div>
                                <div className="text-[11px] text-amber-400 font-mono font-bold mb-2">
                                  {lead.budget}
                                </div>

                                {/* Follow up due badge */}
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-md mb-2">
                                  <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span>Follow-up: <strong>{lead.followUpDate}</strong></span>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                                  <a
                                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.name)},%20this%20is%20${encodeURIComponent(studio.owner.displayName)}%20from%20${encodeURIComponent(studio.brand.name)}%20regarding%20your%20wedding%20photography%20inquiry.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1 text-emerald-400 hover:underline"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </a>

                                  <span className="text-[10px] text-amber-400/80 hover:text-amber-400 font-bold">
                                    Click for Details &rarr;
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LIST VIEW (Alternative to Kanban) */}
            {leadViewMode === 'list' && (
              <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                    <tr>
                      <th className="p-3.5">Client Name</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Event Details</th>
                      <th className="p-3.5">Budget</th>
                      <th className="p-3.5">Next Follow-Up</th>
                      <th className="p-3.5">Pipeline Stage</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {leads.map((l) => (
                      <tr
                        key={l.id}
                        onClick={() => openLeadDetails(l)}
                        className="hover:bg-slate-900/60 cursor-pointer transition"
                      >
                        <td className="p-3.5 font-bold text-white">
                          {l.name}
                          <span className="block text-[10px] text-slate-500 font-normal">{l.source}</span>
                        </td>
                        <td className="p-3.5 font-mono">{l.phone}</td>
                        <td className="p-3.5">
                          {l.eventType}
                          <span className="block text-[10px] text-slate-400">{l.eventDate}</span>
                        </td>
                        <td className="p-3.5 font-bold text-amber-400">{l.budget}</td>
                        <td className="p-3.5 font-mono text-slate-300">{l.followUpDate}</td>
                        <td className="p-3.5">
                          <select
                            value={l.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              moveLeadStage(l.id, e.target.value as LeadItem['status']);
                            }}
                            className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 text-xs"
                          >
                            <option value="New">1. New</option>
                            <option value="Contacted">2. Contacted</option>
                            <option value="Quoted">3. Quoted</option>
                            <option value="Booked">4. Booked</option>
                            <option value="Lost">5. Lost</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openLeadDetails(l);
                            }}
                            className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 mr-2"
                          >
                            View Popup
                          </button>
                          <a
                            href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* LEAD DETAILS POPUP MODAL (Opens cleanly on top instead of at page bottom) */}
            {leadModalOpen && selectedLead && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
                <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-3xl glass-card border border-amber-500/30 bg-slate-900/95 shadow-2xl text-white">
                  
                  {/* Close button */}
                  <button
                    onClick={() => setLeadModalOpen(false)}
                    className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Modal Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 pr-10">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-white">{selectedLead.name}</h3>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {selectedLead.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Source: {selectedLead.source}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        📞 {selectedLead.phone} &bull; ✉️ {selectedLead.email || 'No email provided'} &bull; 💍 {selectedLead.eventType} on {selectedLead.eventDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedLead.name)},%20this%20is%20${encodeURIComponent(studio.owner.displayName)}%20from%20${encodeURIComponent(studio.brand.name)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Direct WhatsApp Message</span>
                      </a>
                    </div>
                  </div>

                  {/* Stage Shifter inside Modal */}
                  <div className="py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400 font-semibold">Change Pipeline Stage:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(['New', 'Contacted', 'Quoted', 'Booked', 'Lost'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => moveLeadStage(selectedLead.id, st)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            selectedLead.status === st
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
                    
                    {/* Left Column: Call History & Notes */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="font-bold text-white">Call Logs & Conversation History ({selectedLead.callLogs.length})</span>
                        <span>Next Follow-up Due: <strong className="text-amber-400">{selectedLead.followUpDate}</strong></span>
                      </div>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {selectedLead.callLogs.length === 0 ? (
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500 italic text-center">
                            No calls logged yet. Log the first conversation on the right!
                          </div>
                        ) : (
                          selectedLead.callLogs.map((log) => (
                            <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-amber-400 font-bold">{log.date}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                                  {log.outcome}
                                </span>
                              </div>
                              <p className="text-slate-200 mt-1">{log.notes}</p>
                              <div className="text-[10px] text-slate-500 pt-1">Logged by: {log.staff}</div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Original submission message */}
                      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
                        <strong className="text-slate-300 block mb-1">Website Inquiry Message:</strong>
                        {selectedLead.notes.join(' | ')}
                      </div>
                    </div>

                    {/* Right Column: Log New Call & Set Next Action */}
                    <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-amber-400" />
                        <span>Log Follow-Up Call & Next Step</span>
                      </h4>

                      <form onSubmit={handleAddCallLog} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1">Call Outcome</label>
                          <select
                            value={callOutcome}
                            onChange={(e) => setCallOutcome(e.target.value as CallLogItem['outcome'])}
                            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                          >
                            <option>Spoke with Bride/Groom</option>
                            <option>Sent WhatsApp Quote</option>
                            <option>Callback Requested</option>
                            <option>Follow-up Due</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1">Call Notes / Discussion Summary</label>
                          <textarea
                            rows={2}
                            required
                            value={callNotes}
                            onChange={(e) => setCallNotes(e.target.value)}
                            placeholder="Client se kya baat hui..."
                            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-400 mb-1">Next Follow-Up Date</label>
                            <input
                              type="date"
                              value={editNextFollowUp || selectedLead.followUpDate}
                              onChange={(e) => setEditNextFollowUp(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">Staff Member</label>
                            <input
                              value={callStaff}
                              onChange={(e) => setCallStaff(e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase text-xs transition cursor-pointer"
                        >
                          Save Call Log & Next Follow-Up
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: EVENTS & GALLERIES */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Create / edit event */}
            <form onSubmit={submitEvent} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-1">
                {editingCode ? <Save className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-amber-400" />}
                <h2 className="text-lg font-bold text-white">{editingCode ? `Event Edit: ${editingCode}` : 'Naya Event Banaiye'}</h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Event code hi guest ka password hai — kuch aisa rakhiye jo guess na ho sake (e.g. RAHUL-PRIYA-1125).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <label className="block">
                  <span className="font-semibold text-slate-300">Event Code *</span>
                  <input
                    required
                    readOnly={!!editingCode}
                    value={eventForm.eventCode}
                    onChange={(e) => setEventForm({ ...eventForm, eventCode: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })}
                    placeholder="RAHUL2026"
                    className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none text-white text-sm font-mono uppercase"
                  />
                </label>
                <label className="block">
                  <span className="font-semibold text-slate-300">Event ka naam (guests ko dikhega)</span>
                  <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Rahul & Priya Wedding" className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none text-white text-sm" />
                </label>
                <label className="block">
                  <span className="font-semibold text-slate-300">Date</span>
                  <input type="date" value={eventForm.eventDate} onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none text-white text-sm" />
                </label>
                <label className="block">
                  <span className="font-semibold text-slate-300">Jagah</span>
                  <input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Siwan, Bihar" className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none text-white text-sm" />
                </label>
                <label className="block">
                  <span className="font-semibold text-slate-300">Client ka naam (sirf admin)</span>
                  <input value={eventForm.clientName} onChange={(e) => setEventForm({ ...eventForm, clientName: e.target.value })} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none text-white text-sm" />
                </label>
                <label className="block">
                  <span className="font-semibold text-slate-300">Client ka phone (sirf admin)</span>
                  <input value={eventForm.clientPhone} onChange={(e) => setEventForm({ ...eventForm, clientPhone: e.target.value })} className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none text-white text-sm" />
                </label>
                <label className="block sm:col-span-2 lg:col-span-3">
                  <span className="font-semibold text-slate-300">Cover photo link (optional — gallery ki koi photo kholkar uska link paste kariye)</span>
                  <input value={eventForm.coverImage} onChange={(e) => setEventForm({ ...eventForm, coverImage: e.target.value })} placeholder="https://… ya /api/files/…" className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none text-white text-sm" />
                </label>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={savingEvent}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  {savingEvent ? 'Saving…' : editingCode ? 'Save Changes' : 'Event Banaiye'}
                </button>
                {editingCode && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCode(null);
                      setEventForm(EMPTY_EVENT);
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div id="media-uploader">
              <AdminMediaUploader key={quickUploadCode} initialCode={quickUploadCode} onUploaded={() => loadEvents()} />
            </div>

            {events.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-slate-700 text-center text-sm text-slate-400">
                Abhi koi event nahi hai. Upar form se event banaiye, ya seedhe photos upload kariye — naya code apne-aap event ban jaata hai.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => (
                  <div key={evt.eventCode} className="rounded-2xl glass-card border border-slate-800 overflow-hidden flex flex-col">
                    <div className="h-28 bg-slate-900 flex items-center justify-center">
                      {evt.coverImage ? (
                        <img src={evt.coverImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Images className="w-8 h-8 text-slate-700" />
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-amber-500/20 text-amber-400 font-bold">
                          {evt.eventCode}
                        </span>
                        <h3 className="font-bold text-white text-base mt-2">{evt.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {[evt.eventDate, evt.location].filter(Boolean).join(' • ') || 'Date / jagah nahi likhi'}
                        </p>
                        {(evt.clientName || evt.clientPhone) && (
                          <p className="text-xs text-slate-500 mt-1">
                            {evt.clientName} {evt.clientPhone}
                          </p>
                        )}
                      </div>
                      <div className="pt-4 mt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
                        <Link href={`/gallery/${evt.eventCode}`} target="_blank" className="text-xs text-amber-400 hover:underline flex items-center gap-1 mr-auto">
                          <span>Gallery</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            setQuickUploadCode(evt.eventCode);
                            document.getElementById('media-uploader')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload / QR
                        </button>
                        <button
                          onClick={() => {
                            setEditingCode(evt.eventCode);
                            setEventForm({
                              eventCode: evt.eventCode, title: evt.title, clientName: evt.clientName, clientPhone: evt.clientPhone,
                              eventDate: evt.eventDate, location: evt.location, coverImage: evt.coverImage,
                            });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeEvent(evt.eventCode)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 cursor-pointer"
                          aria-label={`Delete ${evt.eventCode}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
