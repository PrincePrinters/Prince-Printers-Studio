'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Play, Pause, Sparkles, X, Clock, MapPin, Film, 
  Volume2, VolumeX, Maximize, Minimize, ChevronLeft, ChevronRight,
  RotateCcw
} from 'lucide-react';
import { studio, whatsappLink } from '@/config/studio';

import { films as FEATURED_FILMS } from '@/config/content';

export default function FeaturedFilmsSection() {
  const [activeFilmIndex, setActiveFilmIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('00:00');
  const [totalDuration, setTotalDuration] = useState<string>('00:00');
  const [showControls, setShowControls] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeFilm = activeFilmIndex !== null ? FEATURED_FILMS[activeFilmIndex] : null;

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
    setCurrentTime(formatTime(current));
    setTotalDuration(formatTime(duration));
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercentage = clickX / rect.width;
    videoRef.current.currentTime = newPercentage * videoRef.current.duration;
  };

  const handleNextFilm = useCallback(() => {
    if (activeFilmIndex === null) return;
    setActiveFilmIndex((prev) => (prev! + 1) % FEATURED_FILMS.length);
    setIsPlaying(true);
  }, [activeFilmIndex]);

  const handlePrevFilm = useCallback(() => {
    if (activeFilmIndex === null) return;
    setActiveFilmIndex((prev) => (prev! - 1 + FEATURED_FILMS.length) % FEATURED_FILMS.length);
    setIsPlaying(true);
  }, [activeFilmIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeFilmIndex === null) return;
      if (e.key === 'Escape') setActiveFilmIndex(null);
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'm' || e.key === 'M') toggleMute();
      if (e.key === 'ArrowRight') handleNextFilm();
      if (e.key === 'ArrowLeft') handlePrevFilm();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFilmIndex, handleNextFilm, handlePrevFilm]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  if (FEATURED_FILMS.length === 0) return null;

  return (
    <section id="films" className="py-16 sm:py-24 bg-slate-950/90 relative border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold uppercase tracking-widest mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>DIRECTED BY {studio.owner.displayName.toUpperCase()}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Selected 4K <span className="gold-gradient-text">Wedding Cinema</span>
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Every film we create is cut to a bespoke musical score, color graded with precision, and directed to preserve the sacred soul of your celebration.
          </p>
        </div>

        {/* 4 Featured Film Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {FEATURED_FILMS.map((film, idx) => (
            <div
              key={film.id}
              className="group rounded-3xl overflow-hidden glass-card border border-slate-800 hover:border-amber-500/50 transition-all duration-500 flex flex-col bg-slate-900/60 shadow-2xl"
            >
              {/* Poster Image with Play Overlay */}
              <div 
                className="relative aspect-[16/9] overflow-hidden bg-slate-950 cursor-pointer"
                onClick={() => {
                  setActiveFilmIndex(idx);
                  setIsPlaying(true);
                }}
              >
                <Image
                  src={film.poster}
                  alt={film.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80" />

                {/* Floating Tags */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap gap-2">
                  {film.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={`px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-amber-300 ${tIdx > 0 ? 'hidden sm:inline-block' : ''}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{film.duration}</span>
                </div>

                {/* Central Gold Play Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilmIndex(idx);
                    setIsPlaying(true);
                  }}
                  className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 transform group-hover:scale-110 transition cursor-pointer"
                  aria-label={`Play ${film.title}`}
                >
                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                </button>
              </div>

              {/* Film Details */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono text-amber-400 mb-2 sm:mb-1">
                    <span className="font-bold uppercase tracking-wider">{film.couple}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {film.venue}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition">
                    {film.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed italic">
                    &ldquo;{film.storyQuote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Director: {studio.owner.displayName}
                  </span>
                  <button
                    onClick={() => {
                      setActiveFilmIndex(idx);
                      setIsPlaying(true);
                    }}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Watch Full Teaser</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* CLEAN & PROFESSIONAL CINEMA VIDEO PLAYER MODAL */}
      {activeFilm && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onMouseMove={handleMouseMove}
          onClick={() => setActiveFilmIndex(null)}
        >
          <div 
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden glass-card border border-slate-800 bg-slate-950 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Clean Credits & Close Button */}
            <div className={`p-3 sm:p-5 flex items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/90 z-20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <span className="hidden sm:inline-block shrink-0 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold uppercase">
                  4K MASTER CINEMA
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {activeFilm.couple} &bull; {activeFilm.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-mono line-clamp-1">
                    {activeFilm.venue} &bull; Directed by {studio.owner.displayName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveFilmIndex(null)}
                  className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Canvas with 21:9 Cinema Aspect Ratio */}
            <div 
              className="relative aspect-[16/9] sm:aspect-[21/9] bg-black flex items-center justify-center cursor-pointer group"
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                src={activeFilm.videoUrl}
                autoPlay
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                className="w-full h-full object-cover"
                poster={activeFilm.poster}
              />

              {/* Large Central Play/Pause Overlay Icon (shows when paused) */}
              {!isPlaying && (
                <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-2xl pointer-events-none">
                  <Play className="w-8 h-8 fill-amber-400 ml-1" />
                </div>
              )}

              {/* Previous / Next Arrows on Video Sides */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevFilm();
                }}
                className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md transition-opacity duration-300 border border-white/10 cursor-pointer ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
                title="Previous Film (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextFilm();
                }}
                className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md transition-opacity duration-300 border border-white/10 cursor-pointer ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
                title="Next Film (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Cinema Player Bottom Bar */}
            <div 
              className={`p-3 sm:p-4 bg-slate-950/95 border-t border-slate-800/80 transition-opacity duration-300 z-20 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sleek Golden Scrubber Bar */}
              <div 
                className="w-full h-2 rounded-full bg-slate-800 cursor-pointer relative mb-3 group/bar"
                onClick={handleSeek}
              >
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
                </div>
              </div>

              {/* Playback Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 flex items-center justify-center transition border border-slate-700 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-amber-400 ml-0.5" />}
                  </button>

                  {/* Volume/Mute Button */}
                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Time Code */}
                  <div className="font-mono text-slate-400 text-[11px]">
                    <span className="text-white font-semibold">{currentTime}</span>
                    <span className="mx-1 text-slate-600">/</span>
                    <span>{totalDuration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
                    Space: Play/Pause &bull; M: Mute &bull; Esc: Close
                  </div>

                  <a
                    href={whatsappLink(`Hello ${studio.owner.designation} ${studio.owner.displayName}, I watched ${activeFilm.title} and want to book my wedding`)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-md shadow-amber-500/20"
                  >
                    <span className="sm:hidden">Inquire Now</span>
                    <span className="hidden sm:inline">Inquire For Your Wedding</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
