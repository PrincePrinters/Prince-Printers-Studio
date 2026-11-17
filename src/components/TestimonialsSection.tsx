'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Sparkles, Heart, Quote, CheckCircle2 } from 'lucide-react';
import { studio } from '@/config/studio';

import { testimonials as TESTIMONIALS } from '@/config/content';

export default function TestimonialsSection() {
  if (TESTIMONIALS.length === 0) return null;
  return (
    <section className="py-16 sm:py-24 bg-slate-900/40 relative border-b border-slate-900 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[350px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold uppercase tracking-widest mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>KIND WORDS FROM OUR COUPLES</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Stories of Love, Trust &amp; <span className="gold-gradient-text">Tears of Joy</span>
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Over {studio.stats.weddingsCovered} royal celebrations immortalized across India. Here is what families and couples have to say about their experience with {studio.brand.name}.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 hover:border-amber-500/40 transition duration-500 flex flex-col justify-between bg-slate-950/70 shadow-2xl relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-amber-500/20 group-hover:text-amber-500/40 transition" />

              <div>
                {/* 5 Golden Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(Math.max(0, Math.min(5, Math.round(t.rating))))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[11px] text-amber-400 font-mono ml-2 font-bold">{t.rating}.0 / 5.0</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-8">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Couple Info */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                {t.image && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-amber-500/40">
                    <Image src={t.image} alt={t.couple} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-white">{t.couple}</div>
                  <div className="text-[11px] text-amber-400 font-mono">{t.venue}</div>
                  <div className="text-[10px] text-slate-500">{t.event}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Trust Bar */}
        <div className="mt-14 max-w-2xl mx-auto p-4 rounded-2xl glass-card border border-slate-800 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left text-xs text-slate-300 gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{studio.stats.googleRating} ★ Rating on Google &bull; {studio.stats.googleReviewCount} Verified Reviews</span>
          </div>
        </div>

      </div>
    </section>
  );
}

