'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Sparkles, Play, ArrowRight, Camera, 
  Film, Star, ShieldCheck, Heart, Zap, CheckCircle2 
} from 'lucide-react';
import { studio } from '@/config/studio';

import { heroSlides as HERO_IMAGES, films } from '@/config/content';

export default function HeroSection() {
  const [eventCode, setEventCode] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (HERO_IMAGES.length < 2) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventCode.trim()) {
      router.push(`/gallery/${eventCode.trim().toUpperCase()}`);
    }
  };

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden pt-10 pb-20 sm:py-20">
      
      {/* Background Rotating Wedding Visuals */}
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentSlide === idx ? 'opacity-30 scale-105' : 'opacity-0 scale-100'
          } transition-transform duration-7000 ease-out`}
          style={{
            backgroundImage: `url('${img.url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Luxury Cinematic Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.85)_100%)]" />

      {/* Subtle Warm Gold Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[650px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Simple Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full glass-card border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wide sm:tracking-wider mb-5 sm:mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{studio.brand.name} &bull; Directed by {studio.owner.displayName}</span>
        </div>

        {/* Exactly 2-Line Bold Heading */}
        <h1 className="text-[1.9rem] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12] mb-5 sm:mb-6">
          <span className="block sm:whitespace-nowrap">Wedding Photography &amp;</span>
          <span className="gold-gradient-text block sm:whitespace-nowrap">Cinematic 4K Films</span>
        </h1>

        {/* Clear, Understandable 2-Line Subtitle */}
        <p className="max-w-3xl mx-auto text-sm sm:text-lg text-slate-300 mb-6 sm:mb-8 leading-relaxed font-normal">
          We shoot royal destination weddings, candid love stories, and pre-wedding films across India — with <strong>instant AI photo delivery</strong> for all your wedding guests.
        </p>

        {/* 3 Clear Capability Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <span className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Candid Photography</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>4K Cinema Teasers</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Guest Selfie Search</span>
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
          <Link
            href="/contact"
            className="px-7 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 inline-flex items-center justify-center gap-2 transform hover:scale-105 transition"
          >
            <span>Book Your Wedding Shoot</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          {films.length > 0 && (
          <a
            href="#films"
            className="px-7 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 inline-flex items-center justify-center gap-2 transition"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Watch Wedding Films</span>
          </a>
          )}
        </div>

        {/* GUEST EVENT CODE ACCESS BOX */}
        <div className="max-w-lg mx-auto mb-8">
          <div className="p-2 sm:p-2.5 rounded-2xl glass-card border border-amber-500/30 shadow-2xl bg-slate-900/95 backdrop-blur-xl text-left">
            <div className="px-3 pt-1 pb-2 flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5 text-white text-[11px] sm:text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Wedding Guest? Enter Event Code to Find Photos</span>
              </span>
            </div>

            <form onSubmit={handleSearchEvent} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={eventCode}
                  onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                  placeholder="Event code, e.g. RAHUL2026"
                  className="w-full h-11 px-4 pl-10 rounded-xl bg-slate-950/90 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 font-mono font-medium text-xs sm:text-sm outline-none uppercase transition"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <button
                type="submit"
                className="h-11 px-5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20 shrink-0"
              >
                <span>Open Photos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="px-3 pt-2 text-[11px] text-slate-400">
              <span>Event code studio ne aapko diya hai — gallery mein selfie se apni photos dhoondhiye</span>
            </div>
          </div>
        </div>

        {/* 4 Trust Signals Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-4 max-w-3xl mx-auto pt-6 border-t border-slate-900 text-left">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">{studio.stats.weddingsCovered} Weddings</div>
              <div className="text-[10px] text-slate-500">Filmed across India</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">{studio.owner.yearsExperience} Years</div>
              <div className="text-[10px] text-slate-500">Master Direction</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">72-Hour Preview</div>
              <div className="text-[10px] text-slate-500">Fast photo delivery</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">{studio.stats.googleRating} ★ Rating</div>
              <div className="text-[10px] text-slate-500">Google verified</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
