'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Sliders, ArrowRight } from 'lucide-react';
import { packages as SAMPLE_PACKAGES, estimatorRates } from '@/config/content';

export default function PackagesSection() {
  // Custom Estimator state
  const [days, setDays] = useState(2);
  const [photographers, setPhotographers] = useState(2);
  const [videographers, setVideographers] = useState(2);
  const [includeDrone, setIncludeDrone] = useState(true);
  const [albums, setAlbums] = useState(2);

  // Live estimate calculation
  const rates = estimatorRates ?? { perDay: 0, perCrewPerDay: 0, dronePerDay: 0, perAlbum: 0 };
  const baseDayCost = days * rates.perDay;
  const crewCost = (photographers + videographers) * days * rates.perCrewPerDay;
  const droneCost = includeDrone ? days * rates.dronePerDay : 0;
  const albumCost = albums * rates.perAlbum;
  const totalEstimate = baseDayCost + crewCost + droneCost + albumCost;

  if (SAMPLE_PACKAGES.length === 0 && !estimatorRates) return null;

  return (
    <section id="packages" className="py-20 bg-slate-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3 font-mono">
            <Sparkles className="w-4 h-4" />
            <span>Investment & Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Transparent, Value-Packed <span className="gold-gradient-text">Studio Collections</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base">
            No hidden costs. All packages include raw high-res files, color grading, online gallery, and mobile app sync.
          </p>
        </div>

        {/* 3 Tier Cards */}
        {SAMPLE_PACKAGES.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 items-stretch mb-14 sm:mb-20">
          {SAMPLE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition duration-300 ${
                pkg.isPopular
                  ? 'glass-card border-2 border-amber-500/80 bg-slate-900/90 shadow-2xl shadow-amber-500/10 lg:-translate-y-3'
                  : 'glass-card border border-slate-800'
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md whitespace-nowrap">
                  {pkg.badge}
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{pkg.description}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{pkg.price}</span>
                  <span className="text-xs text-slate-400">/ event</span>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-800">
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-6">
                <Link
                  href="/#inquiry"
                  className={`block w-full py-3.5 rounded-xl text-center text-xs font-bold uppercase tracking-wider transition ${
                    pkg.isPopular
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Choose {pkg.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* INTERACTIVE CUSTOM PACKAGE ESTIMATOR */}
        {estimatorRates && (
        <div className="rounded-3xl glass-card border border-amber-500/20 p-5 sm:p-10 max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase mb-1">
                <Sliders className="w-4 h-4" />
                <span>Interactive Calculator</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Customize Your Custom Package</h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 uppercase tracking-widest block font-mono">Estimated Investment</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">₹{totalEstimate.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Days Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Coverage Days:</span>
                <span className="text-amber-400 font-bold">{days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Photographers Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Candid Photographers:</span>
                <span className="text-amber-400 font-bold">{photographers} Artists</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={photographers}
                onChange={(e) => setPhotographers(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Cinematographers Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>4K Cinematographers:</span>
                <span className="text-amber-400 font-bold">{videographers} Operators</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={videographers}
                onChange={(e) => setVideographers(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Albums Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                <span>Handcrafted Layflat Albums:</span>
                <span className="text-amber-400 font-bold">{albums} Albums</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={albums}
                onChange={(e) => setAlbums(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Drone Toggle & CTA */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDrone}
                onChange={(e) => setIncludeDrone(e.target.checked)}
                className="w-5 h-5 shrink-0 rounded border-slate-700 text-amber-500 focus:ring-amber-500 accent-amber-500"
              />
              <span className="text-sm font-medium text-slate-200">Include 4K Licensed Drone Pilot & Aerial Coverage</span>
            </label>

            <Link
              href="/#inquiry"
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 flex items-center justify-center gap-2"
            >
              <span>Lock This Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        )}

      </div>
    </section>
  );
}

