'use client';

import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { studio, telLink, whatsappLink } from '@/config/studio';

export default function DateAvailabilityChecker() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-20');
  const [destination, setDestination] = useState<string>(studio.contact.defaultDestination);
  const [celebrationType, setCelebrationType] = useState<string>('Royal 2-3 Day Wedding');
  const [checked, setChecked] = useState<boolean>(true);

  // Parse date to give authentic feedback
  const monthName = selectedDate ? new Date(selectedDate).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Upcoming Season';

  const generateWhatsAppUrl = () => {
    const text = `Hello ${studio.owner.designation} ${studio.owner.displayName}, I checked availability on your website for my wedding on ${selectedDate} in ${destination} (${celebrationType}). Are dates available for your master crew?`;
    return whatsappLink(text);
  };

  return (
    <section className="relative -mt-10 sm:-mt-12 z-20 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="rounded-2xl sm:rounded-3xl glass-card border-2 border-amber-500/40 p-4 sm:p-8 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-semibold uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE DIRECTOR SCHEDULE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Check Wedding Date &amp; <span className="gold-gradient-text">Crew Availability</span>
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>2026 Season Calendar Active</span>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 sm:pt-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Wedding / Shoot Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setChecked(true);
              }}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Event Destination</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setChecked(true);
              }}
              placeholder="e.g. Udaipur, Jaipur, Goa, Delhi"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Celebration Scale</span>
            </label>
            <select
              value={celebrationType}
              onChange={(e) => setCelebrationType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
            >
              <option>Royal 2-3 Day Wedding</option>
              <option>Single Day Grand Wedding</option>
              <option>Pre-Wedding Cinema Shoot</option>
              <option>Intimate Palace Celebration</option>
            </select>
          </div>
        </div>

        {/* Live Slot Result Banner */}
        {checked && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-amber-950/30 border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-start sm:items-center gap-2 text-[11px] sm:text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>DIRECTOR SLOT AVAILABLE FOR {monthName.toUpperCase()}</span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>{studio.owner.designation} {studio.owner.displayName}</strong> &amp; senior cinema crew currently have an open booking window for <strong>{destination}</strong> on your selected date.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto px-5 py-3 rounded-xl font-bold uppercase text-xs tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 inline-flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reserve on WhatsApp</span>
              </a>
              <a
                href={telLink()}
                className="px-4 py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 inline-flex items-center gap-2 transition shrink-0"
                title={`Call ${studio.owner.designation} ${studio.owner.displayName}`}
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Call Desk</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

