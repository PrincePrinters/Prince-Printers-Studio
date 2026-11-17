'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScanFace, QrCode, Camera, Download, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { studio } from '@/config/studio';

export default function AiSearchPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const open = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!clean) {
      setError('Event code likhiye (jaise RAHUL2026)');
      return;
    }
    router.push(`/gallery/${clean}`);
  };

  const steps = [
    { icon: QrCode, title: 'Event kholiye', text: 'Venue ka QR scan kariye, ya neeche event code daaliye.' },
    { icon: Camera, title: 'Selfie lijiye', text: 'Gallery mein "Find My Photos" dabakar ek selfie lijiye.' },
    { icon: Download, title: 'Download kariye', text: 'Sirf aapki photos dikhengi — ek ya sab download kariye.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <ScanFace className="w-4 h-4" />
            <span>AI Face Search</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ek Selfie Se <span className="gold-gradient-text">Apni Saari Photos</span> Paaiye
          </h1>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Shaadi ki hazaron photos mein apni photo dhoondhne ki zaroorat nahi. Apna event code daaliye.
          </p>

          <form onSubmit={open} className="mt-8 max-w-lg mx-auto p-2 rounded-2xl border border-amber-500/30 bg-slate-900/90 flex flex-col sm:flex-row gap-2">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="Event code, e.g. RAHUL2026"
              className="flex-1 h-12 px-4 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none font-mono uppercase text-white placeholder-slate-500"
              aria-label="Event code"
            />
            <button
              type="submit"
              className="h-12 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
          <p className="mt-3 text-xs text-slate-500">
            Event code nahi pata? Studio se poochiye: {studio.contact.phone}
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <s.icon className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono text-slate-500">STEP {i + 1}</span>
              </div>
              <h2 className="font-bold text-white">{s.title}</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-8 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-start gap-3 text-xs text-slate-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Privacy: aapki selfie aapke phone se bahar nahi jaati. Chehre ka match aapke browser mein hi hota hai.
          </span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
