'use client';

import React from 'react';
import { Camera, Film, Compass, Sparkles, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

const SERVICES = [
  {
    icon: Camera,
    title: 'Candid Wedding Photography',
    description: 'Master photographers capturing raw, unposed emotions, glances, rituals, and heartwarming tears of joy.',
    features: ['High-end Sony & Canon Prime Lenses', 'Subtle Color Harmony & Skin Tones', 'Full Ceremony Emotional Storytelling'],
  },
  {
    icon: Film,
    title: '4K Cinematic Wedding Films',
    description: 'Bollywood-standard cinematic editing, color grading, dialogues, and custom musical soundscapes.',
    features: ['Same-Day Edit (SDE) Teasers', 'Adaptive Bitrate 4K HLS Streaming', 'Director & Gimbal Movement Rig'],
  },
  {
    icon: Compass,
    title: '4K Aerial Drone Cinematography',
    description: 'Sweeping aerial perspectives of palace architecture, barat processions, and grand outdoor mandaps.',
    features: ['Dual Drone Operators (FPV + Master)', 'Approved Flight Safety Protocols', 'Crisp 4K/60fps Dynamic Aerials'],
  },
  {
    icon: Sparkles,
    title: 'AI Guest Face-Search Portal',
    description: 'Guests snap a quick selfie and instantly discover all their candid photos without browsing 3,000 pictures.',
    features: ['0.5s Fast Vector Embeddings', 'Private & Secure Link Sharing', 'Instant WhatsApp Integration'],
  },
  {
    icon: BookOpen,
    title: 'Handcrafted Layflat Albums',
    description: 'Italian leather and royal velvet covered albums with flush mount, anti-fingerprint archival sheets.',
    features: ['Interactive Online Client Proofing', 'Selection Locking & Direct Print', 'Parent & Keepsake Mini Albums'],
  },
  {
    icon: Clock,
    title: 'Pre-Wedding Destination Shoots',
    description: 'Cinematic romance in Ladakh, Udaipur palaces, Rishikesh hills, or international destinations.',
    features: ['Concept Scripting & Moodboard', 'Styling & Wardrobe Guidance', 'Drone & Scenic Sunset Sequences'],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3 font-mono">
            <span>What We Offer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Comprehensive <span className="gold-gradient-text">Visual Craftsmanship</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            From the first turmeric smear at your Haldi to the final bidai tear, our crew and tech ensure no memory fades away.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl glass-card glass-card-hover border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 sm:mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{srv.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">{srv.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {srv.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

