'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Sparkles, Sliders, Eye, Film, Camera, CheckCircle2 } from 'lucide-react';
import { studio } from '@/config/studio';
import { colorGradeImage } from '@/config/content';

export default function ColorGradeSliderSection() {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp]);

  if (!colorGradeImage) return null;

  return (
    <section className="py-16 sm:py-24 bg-slate-950 relative overflow-hidden border-y border-slate-900">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[700px] h-[350px] bg-amber-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold uppercase tracking-widest mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>INTERACTIVE CINEMA SCIENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            The Magic of <span className="gold-gradient-text">Master Color Grading</span>
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Drag the slider across to see the transformative difference between a flat raw camera sensor capture and <strong>{studio.owner.designation} {studio.owner.displayName}&apos;s</strong> Hollywood-grade DaVinci Resolve color master.
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div className="max-w-5xl mx-auto">
          <div 
            ref={containerRef}
            onMouseDown={(e) => {
              setIsDragging(true);
              handleMove(e.clientX);
            }}
            onTouchStart={(e) => {
              setIsDragging(true);
              handleMove(e.touches[0].clientX);
            }}
            className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden glass-card border-2 border-amber-500/40 shadow-2xl cursor-ew-resize select-none touch-pan-y"
          >
            {/* 1. Master Graded Background (Right / Reveal) */}
            <div className="absolute inset-0">
              <Image
                src={colorGradeImage}
                alt={`${studio.brand.name} Master Color Graded Rec.709`}
                fill
                className="object-cover"
                priority
              />
              {/* Graded Label Badge */}
              <div className="absolute top-3 sm:top-6 right-3 sm:right-6 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-950/80 border border-amber-500/40 backdrop-blur-md text-amber-400 text-[10px] sm:text-xs font-mono font-bold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="sm:hidden">MASTER GRADE</span>
                <span className="hidden sm:inline">{studio.brand.nameMain.toUpperCase()} MASTER GRADE (Rec.709)</span>
              </div>
            </div>

            {/* 2. Flat Camera Raw Layer (Left / Clipped) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div 
                className="relative w-full h-full"
                style={{
                  width: boxWidth ? `${boxWidth}px` : '100%',
                }}
              >
                <Image
                  src={colorGradeImage}
                  alt="Flat Camera Raw S-Log3"
                  fill
                  className="object-cover grayscale contrast-50 brightness-110 filter sepia-[0.15]"
                  priority
                />
              </div>

              {/* Raw S-Log3 Label Badge */}
              <div className="absolute top-3 sm:top-6 left-3 sm:left-6 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-950/80 border border-slate-700 backdrop-blur-md text-slate-300 text-[10px] sm:text-xs whitespace-nowrap font-mono font-bold flex items-center gap-2">
                <Camera className="w-3.5 h-3.5 text-slate-400" />
                <span className="sm:hidden">RAW S-LOG3</span>
                <span className="hidden sm:inline">RAW CAMERA FLAT S-LOG3</span>
              </div>
            </div>

            {/* 3. The Draggable Gold Divider Line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.8)] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Draggable Circle Handle */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/50">
                <div className="flex items-center gap-0.5 text-xs font-bold">
                  <span>◀</span>
                  <span>▶</span>
                </div>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-6 right-3 sm:right-6 px-3 sm:px-4 py-2 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex flex-wrap items-center justify-between text-[10px] sm:text-xs font-mono text-slate-300 gap-2">
              <div className="flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">SONY FX3 &bull; 50MM F/1.2 GM &bull; S-LOG3 TO {studio.brand.nameMain.toUpperCase()} MASTER</span>
                <span className="sm:hidden">Drag left / right to compare</span>
              </div>
              <div className="text-amber-400 hidden sm:block">
                Drag slider left / right to compare
              </div>
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-xs">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>True Royal Skin Tones</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Preserving authentic Indian bridal undertones without harsh yellowish casts or oversaturated skin.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-xs">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>24K Jewelry Lustre</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Fine-tuned specular highlights that make gold, polki, and diamond jewelry sparkle with natural luminescence.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-slate-800 text-xs">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Deep Shadow Dynamic Range</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Night mandap and baraat scenes retain clean black levels without muddy video noise or harsh blown-out spotlights.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

