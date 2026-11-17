'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Phone, X, Sparkles, ChevronUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { studio, telLink, whatsappLink } from '@/config/studio';

export default function DirectorConciergePill() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans flex flex-col items-end">
      
      {/* Expanded Luxury Flyout Card */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-[22rem] rounded-3xl glass-card border-2 border-amber-500/50 p-5 bg-slate-950/95 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400">DIRECTOR CONCIERGE</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Director Bio Mini-Profile */}
          <div className="flex items-center gap-3.5 my-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-500/40 bg-slate-900">
              <Image
                src={studio.owner.photo}
                alt={studio.owner.displayName}
                fill
                className="object-cover object-top"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{studio.owner.displayName}</div>
              <div className="text-[11px] text-amber-400 font-mono">{studio.owner.role}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{studio.brand.name} &bull; {studio.owner.yearsExperience} Yrs Exp</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Planning a wedding in 2026/2027? Reach me directly for date confirmation, custom packages, or cinema direction advice.
          </p>

          {/* Quick Action Buttons */}
          <div className="space-y-2">
            <a
              href={whatsappLink(`Hello ${studio.owner.salutation}, I am inquiring about booking ${studio.brand.name} for a wedding.`)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl font-bold uppercase text-xs tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp Directly</span>
            </a>

            <a
              href={telLink()}
              className="w-full py-2.5 px-4 rounded-xl font-bold uppercase text-xs tracking-wider bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call {studio.owner.designation}: {studio.contact.phone}</span>
            </a>
          </div>

          <div className="mt-3 text-center text-[10px] text-slate-500 font-mono">
            Fast reply within 15 minutes during day hours
          </div>
        </div>
      )}

      {/* Floating Pill Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2.5 sm:px-4 sm:py-3 rounded-full glass-card border-2 border-amber-500/60 bg-slate-950/90 hover:bg-slate-900 text-white shadow-2xl flex items-center gap-2 sm:gap-3 transition-all transform hover:scale-105 cursor-pointer backdrop-blur-xl group"
      >
        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-amber-500/50 shrink-0">
          <Image
            src={studio.owner.photo}
            alt={studio.owner.displayName}
            fill
            className="object-cover object-top"
          />
        </div>

        <div className="flex items-center gap-2 text-left">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">
            <span className="sm:hidden">Chat with {studio.owner.firstName}</span>
            <span className="hidden sm:inline">{studio.owner.designation} {studio.owner.displayName}</span>
          </span>
          <span className="hidden sm:inline text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
            Bookings Open
          </span>
        </div>

        <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

    </div>
  );
}

