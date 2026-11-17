'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Phone, MessageCircle, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { studio, whatsappLink } from '@/config/studio';

export default function DirectorStorySection() {
  return (
    <section className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden border-b border-slate-900">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[80vw] max-w-[500px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left 5 Cols: Director Portrait with Luxury Gold Framing */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl overflow-hidden glass-card border-2 border-amber-500/40 shadow-2xl bg-gradient-to-b from-slate-900 to-slate-950 group">
              <Image
                src={studio.owner.photo}
                alt={`${studio.owner.displayName} - ${studio.owner.role}`}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {/* Floating Director Badge */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-4 rounded-2xl glass-card border border-amber-500/30 bg-slate-950/85 backdrop-blur-md">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{studio.owner.displayName}</h3>
                    <div className="text-xs text-amber-400 font-mono">Master Director &amp; Cinematographer</div>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                    {studio.owner.yearsExperience} Yrs Exp
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-2">
                  Personally directing royal celebrations across {studio.contact.serviceAreas}.
                </p>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Director Editorial Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              <span>THE DIRECTOR&apos;S PHILOSOPHY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              &ldquo;We Don&apos;t Direct Actors. <br />
              <span className="gold-gradient-text">We Preserve Living Emotion.&rdquo;</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              When you look back at your wedding photographs 25 years from now, you shouldn&apos;t just remember what you wore—you should feel the racing heartbeat of your Varmala, the sacred stillness of your Pheras, and the unspoken pride in your father&apos;s eyes.
            </p>

            <p className="text-slate-400 text-sm leading-relaxed">
              At <strong>{studio.brand.name}</strong>, we combine discrete Bollywood-grade camera direction with our proprietary AI photo delivery pipelines. That means zero awkward interruptions during sacred ceremonies, gorgeous cinematic color grading, and guests receiving their personal photos within seconds of sitting at the reception dinner.
            </p>

            {/* 3 Promises */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
              <div className="p-3.5 rounded-xl glass-card border border-slate-800">
                <div className="text-amber-400 font-bold text-xs mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Unobtrusive Crew</span>
                </div>
                <div className="text-[11px] text-slate-400">Respectful, discreet presence that never ruins sacred rituals.</div>
              </div>

              <div className="p-3.5 rounded-xl glass-card border border-slate-800">
                <div className="text-amber-400 font-bold text-xs mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>72h First Look</span>
                </div>
                <div className="text-[11px] text-slate-400">50 master-graded stills delivered in 3 days for family and social media.</div>
              </div>

              <div className="p-3.5 rounded-xl glass-card border border-slate-800">
                <div className="text-amber-400 font-bold text-xs mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AI Guest QR Stand</span>
                </div>
                <div className="text-[11px] text-slate-400">Zero app install. Guests find their photos by selfie in 0.5s.</div>
              </div>
            </div>

            {/* Direct Consultation Action */}
            <div className="pt-2 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
              <a
                href={whatsappLink(`Hello ${studio.owner.salutation}, I would love to schedule a wedding consultation with you`)}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-xl shadow-amber-500/20 inline-flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Schedule Consultation with {studio.owner.salutation}</span>
              </a>
              <Link
                href="/about"
                className="px-6 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 inline-flex items-center justify-center gap-2 transition"
              >
                <span>Read Studio Legacy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

