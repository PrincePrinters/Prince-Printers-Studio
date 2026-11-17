'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Film, Heart, Sparkles, X, ChevronLeft, ChevronRight, 
  ZoomIn, ZoomOut, Maximize2, Download, Camera, CheckCircle2 
} from 'lucide-react';
import { studio, whatsappLink } from '@/config/studio';

import { portfolio as PORTFOLIO_ITEMS } from '@/config/content';

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const categories = ['All', 'Wedding', 'Pre-Wedding', 'Cinematic Film', 'Portraits'];

  const filteredItems = activeCategory === 'All'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setIsZoomed(false);
    setSelectedIndex((prev) => (prev! + 1) % filteredItems.length);
  }, [selectedIndex, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setIsZoomed(false);
    setSelectedIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  }, [selectedIndex, filteredItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  const activePhoto = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  if (PORTFOLIO_ITEMS.length === 0) return null;

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-slate-950/60 relative border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2 font-mono">
              <Sparkles className="w-4 h-4" />
              <span>EDITORIAL WEDDING PORTFOLIO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Visual Masterpieces &amp; <span className="gold-gradient-text">Love Stories</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedIndex(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomed(false);
              }}
              className="group relative rounded-3xl overflow-hidden glass-card border border-slate-800 cursor-pointer transition duration-500 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 bg-slate-900"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Clean vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Category Pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  {item.tag}
                </div>

                {item.category === 'Cinematic Film' && (
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg">
                    <Film className="w-4 h-4 fill-current" />
                  </div>
                )}
              </div>

              {/* Card Bottom Meta */}
              <div className="p-5">
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mt-2.5 text-xs text-slate-400 font-mono">
                  <span className="text-[11px] text-slate-500">{item.camera || item.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* CLEAN & PROFESSIONAL IMAGE PREVIEW (LIGHTBOX) */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between animate-in fade-in duration-200 select-none"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Top Bar: Metadata & Action Icons */}
          <div 
            className="w-full px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 bg-gradient-to-b from-black/80 to-transparent z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title & Counter */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-amber-400">
                {selectedIndex! + 1} / {filteredItems.length}
              </span>
              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{activePhoto.title}</h4>
                <div className="text-[11px] text-slate-400 font-mono hidden sm:flex items-center gap-2">
                  <span>{activePhoto.tag}</span>
                  <span>&bull;</span>
                  <span className="text-amber-400/80">{activePhoto.camera}</span>
                </div>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setSelectedIndex(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Canvas with Navigation Arrows */}
          <div 
            className="relative flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Nav Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-8 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xl"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Active Photograph */}
            <div 
              className={`relative max-w-6xl max-h-[78vh] w-full h-full flex items-center justify-center transition-transform duration-300 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <Image
                src={activePhoto.image}
                alt={activePhoto.title}
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="100vw"
              />
            </div>

            {/* Right Nav Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-8 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-xl"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Clean Inquire & Keyboard hint */}
          <div 
            className="w-full px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-t from-black/90 to-transparent gap-3 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[11px] text-slate-500 font-mono hidden sm:flex items-center gap-2">
              <span>Use</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">◀</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">▶</kbd>
              <span>to navigate &bull; Click to zoom</span>
            </div>

            <a
              href={whatsappLink(`Hello ${studio.owner.designation} ${studio.owner.displayName}, I saw this wedding photo (${activePhoto.title}) and want this style for my wedding`)}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inquire This Style<span className="hidden sm:inline"> For Your Wedding</span></span>
            </a>
          </div>
        </div>
      )}

    </section>
  );
}
