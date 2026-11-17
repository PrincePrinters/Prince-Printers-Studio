'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Camera, Download, ArrowRight, Zap } from 'lucide-react';

const STEPS = [
  { icon: QrCode, title: '1. Event code / QR', text: 'Studio se mila event code daaliye ya venue par laga QR scan kariye.' },
  { icon: Camera, title: '2. Ek selfie', text: 'Gallery mein "Find My Photos" dabaiye aur selfie lijiye. Selfie aapke phone se bahar nahi jaati.' },
  { icon: Download, title: '3. Apni photos', text: 'Jin photos mein aap hain, woh alag dikh jaayengi — ek click mein download.' },
];

export default function AiSearchPreviewSection() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const open = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (clean) router.push(`/gallery/${clean}`);
  };

  return (
    <section className="py-20 relative bg-slate-900/60 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>AI Selfie Face Search</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Hazaaron photos mein se <br />
            <span className="gold-gradient-text">Apni photos ek selfie se.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            Shaadi ke guests ko saari photos scroll nahi karni padti — selfie lete hi unki photos mil jaati hain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="p-5 rounded-2xl glass-card border border-slate-800 bg-slate-950/70">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">{title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={open}
          className="max-w-lg mx-auto p-2 rounded-2xl border border-amber-500/30 bg-slate-950/90 flex flex-col sm:flex-row gap-2"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Event code, e.g. RAHUL2026"
            className="flex-1 h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 outline-none font-mono text-sm text-white uppercase"
          />
          <button
            type="submit"
            className="h-11 px-5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Gallery Kholein</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
}
