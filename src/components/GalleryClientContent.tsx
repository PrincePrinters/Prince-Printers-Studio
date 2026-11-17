'use client';

/* eslint-disable @next/next/no-img-element -- gallery media comes from R2 / uploads, any domain */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Download, Film, Share2, CheckCircle2, AlertCircle,
  ChevronLeft, ChevronRight, X, ScanFace, Camera, Loader2, Images, RefreshCw,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { studio } from '@/config/studio';
import { getFaceDescriptors, bestDistance, MATCH_THRESHOLD } from '@/lib/face-client';

interface GalleryClientContentProps {
  code: string;
}

interface GalleryItem {
  id: string;
  url: string;
  thumb: string;
  title: string;
  folder: string;
  mediaType: 'image' | 'video';
  filename: string;
}

interface ApiMedia {
  key: string;
  url: string;
  folder: string;
  filename: string;
  title: string;
  mediaType: 'image' | 'video';
}

interface ApiFace {
  url: string;
  descriptors: number[][];
}

interface ApiEvent {
  title: string;
  eventDate: string;
  location: string;
  coverImage: string;
}

type LoadState = 'loading' | 'ready' | 'empty' | 'error';

export default function GalleryClientContent({ code }: GalleryClientContentProps) {
  const upperCode = (code || '').toUpperCase();
  const [eventInfo, setEventInfo] = useState<ApiEvent | null>(null);

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const faceIndex = useRef<Map<string, number[][]>>(new Map());

  const [selectedFolder, setSelectedFolder] = useState('All');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);

  // Selfie search
  const [scanStatus, setScanStatus] = useState<'idle' | 'loading-models' | 'reading-selfie' | 'scanning' | 'done'>('idle');
  const [scanProgress, setScanProgress] = useState({ done: 0, total: 0 });
  const [matchIds, setMatchIds] = useState<string[] | null>(null);
  const selfieInput = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 3500);
  };

  /* ---------- Load event media ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/events/${encodeURIComponent(upperCode)}/media`, { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;
        if (data.success) setEventInfo(data.event || null);
        if (data.success && data.media.length > 0) {
          setItems(
            (data.media as ApiMedia[]).map((m) => ({
              id: m.key,
              url: m.url,
              thumb: m.url,
              title: m.title,
              folder: m.folder,
              mediaType: m.mediaType,
              filename: m.filename,
            }))
          );
          faceIndex.current = new Map((data.faces as ApiFace[]).map((f) => [f.url, f.descriptors]));
          setLoadState('ready');
        } else {
          setLoadState('empty');
        }
      } catch {
        if (!cancelled) setLoadState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [upperCode]);

  const folders = useMemo(() => Array.from(new Set(items.map((i) => i.folder))), [items]);

  const visibleItems = useMemo(() => {
    let list = items;
    if (matchIds) {
      const order = new Map(matchIds.map((id, i) => [id, i]));
      list = items.filter((i) => order.has(i.id)).sort((a, b) => order.get(a.id)! - order.get(b.id)!);
    }
    if (selectedFolder !== 'All') list = list.filter((i) => i.folder === selectedFolder);
    return list;
  }, [items, matchIds, selectedFolder]);

  const activeIndex = activeId ? visibleItems.findIndex((i) => i.id === activeId) : -1;
  const activeItem = activeIndex >= 0 ? visibleItems[activeIndex] : null;

  const goNext = useCallback(() => {
    if (activeIndex < 0 || visibleItems.length === 0) return;
    setActiveId(visibleItems[(activeIndex + 1) % visibleItems.length].id);
  }, [activeIndex, visibleItems]);

  const goPrev = useCallback(() => {
    if (activeIndex < 0 || visibleItems.length === 0) return;
    setActiveId(visibleItems[(activeIndex - 1 + visibleItems.length) % visibleItems.length].id);
  }, [activeIndex, visibleItems]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeId) return;
      if (e.key === 'Escape') setActiveId(null);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeId, goNext, goPrev]);

  /* ---------- Downloads ---------- */
  const downloadItem = async (item: GalleryItem) => {
    // Inside the Android app: save straight to the phone's Downloads folder
    const app = (window as Window & { StudioApp?: { download: (url: string, name: string) => boolean } }).StudioApp;
    if (app) {
      if (app.download(new URL(item.url, window.location.href).href, item.filename)) return;
    }
    try {
      const res = await fetch(item.url, { mode: 'cors' });
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = item.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    } catch {
      // Cross-origin without CORS: open the file so the guest can save it manually
      window.open(item.url, '_blank', 'noopener');
    }
  };

  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);
  const downloadMany = async (list: GalleryItem[]) => {
    if (list.length === 0) return;
    if (list.length > 1 && !window.confirm(`${list.length} files download honge. Continue?`)) return;
    setBulkProgress({ done: 0, total: list.length });
    for (let i = 0; i < list.length; i++) {
      await downloadItem(list[i]);
      setBulkProgress({ done: i + 1, total: list.length });
      await new Promise((r) => setTimeout(r, 450));
    }
    setBulkProgress(null);
    showToast(`${list.length} files downloaded`);
  };

  /* ---------- Selfie face search ---------- */
  const runSelfieSearch = async (file: File) => {
    try {
      setMatchIds(null);
      setSelectedFolder('All');
      setScanStatus('loading-models');
      setScanStatus('reading-selfie');
      const selfieFaces = await getFaceDescriptors(file);
      if (selfieFaces.length === 0) {
        setScanStatus('idle');
        showToast('Selfie mein chehra nahi mila. Saamne se, achhi roshni mein dobara try kariye.', true);
        return;
      }
      const selfie = selfieFaces[0];

      const photos = items.filter((i) => i.mediaType === 'image');
      setScanStatus('scanning');
      setScanProgress({ done: 0, total: photos.length });

      const scored: { id: string; dist: number }[] = [];
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        let faces = faceIndex.current.get(p.url);
        if (!faces) {
          // Not indexed at upload time: scan this photo in the browser now
          try {
            faces = await getFaceDescriptors(p.thumb);
          } catch {
            faces = [];
          }
          faceIndex.current.set(p.url, faces);
        }
        const dist = bestDistance(selfie, faces);
        if (dist < MATCH_THRESHOLD) scored.push({ id: p.id, dist });
        setScanProgress({ done: i + 1, total: photos.length });
      }

      scored.sort((a, b) => a.dist - b.dist);
      setMatchIds(scored.map((s) => s.id));
      setScanStatus('done');
      showToast(
        scored.length ? `Aapki ${scored.length} photos mili!` : 'Koi matching photo nahi mili. Doosri selfie try kariye.',
        scored.length === 0
      );
    } catch (err) {
      console.error(err);
      setScanStatus('idle');
      showToast('Face scan start nahi ho paya. Page refresh karke dobara try kariye.', true);
    }
  };

  const scanning = scanStatus === 'loading-models' || scanStatus === 'reading-selfie' || scanStatus === 'scanning';
  const eventTitle = eventInfo?.title && eventInfo.title !== upperCode ? eventInfo.title : `${upperCode} Gallery`;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      {toast && (
        <div
          className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[60] px-4 py-3 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 ${
            toast.error ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
          }`}
        >
          {toast.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="relative py-10 sm:py-14 bg-slate-900 border-b border-slate-800">
        {eventInfo?.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${eventInfo.coverImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition">
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <span className="text-slate-600">|</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              EVENT CODE: {upperCode}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">{eventTitle}</h1>
          <p className="text-sm text-slate-400 mt-2">
            {studio.brand.name}
            {eventInfo?.location ? <> &bull; {eventInfo.location}</> : null}
            {eventInfo?.eventDate ? <> &bull; {eventInfo.eventDate}</> : null} &bull; {items.length} photos &amp; videos
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loadState === 'loading' && (
          <div className="py-24 flex flex-col items-center gap-3 text-slate-400 text-sm">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <span>Photos load ho rahi hain…</span>
          </div>
        )}

        {(loadState === 'empty' || loadState === 'error') && (
          <div className="py-20 max-w-md mx-auto text-center space-y-3">
            <Images className="w-12 h-12 text-slate-600 mx-auto" />
            <h2 className="text-xl font-bold">
              {loadState === 'error' ? 'Gallery load nahi ho payi' : 'Abhi is event ki photos upload nahi hui hain'}
            </h2>
            <p className="text-sm text-slate-400">
              Event code <span className="font-mono text-amber-400">{upperCode}</span> check kar lijiye, ya thodi der baad
              dobara aaiye. Madad ke liye studio se sampark kariye: {studio.contact.phone}
            </p>
          </div>
        )}

        {loadState === 'ready' && (
          <>
            {/* Guest actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-slate-900">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <ScanFace className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-white">Find My Photos</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Ek selfie lijiye — aapki saari photos apne aap mil jaayengi. Selfie aapke phone se bahar nahi jaati.
                    </p>
                  </div>
                </div>

                <input
                  ref={selfieInput}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = '';
                    if (f) runSelfieSearch(f);
                  }}
                />

                {scanning ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        {scanStatus === 'scanning' ? 'Photos match ho rahi hain…' : 'Face scan taiyar ho raha hai…'}
                      </span>
                      {scanStatus === 'scanning' && (
                        <span className="font-mono">{scanProgress.done}/{scanProgress.total}</span>
                      )}
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all"
                        style={{
                          width: `${scanStatus === 'scanning' && scanProgress.total ? (scanProgress.done / scanProgress.total) * 100 : 8}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => selfieInput.current?.click()}
                      className="flex-1 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{matchIds ? 'Nayi Selfie Lein' : 'Selfie Lein / Upload Karein'}</span>
                    </button>
                    {matchIds && (
                      <button
                        onClick={() => {
                          setMatchIds(null);
                          setScanStatus('idle');
                        }}
                        className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Saari Photos Dikhaayein</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/70 flex flex-col justify-between gap-4">
                <div>
                  <h2 className="font-bold text-white">
                    {matchIds ? `Aapki photos: ${visibleItems.length}` : `Saari photos: ${visibleItems.length}`}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kisi bhi photo par tap karke dekhiye aur download kariye, ya ek saath sab download kariye.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    disabled={!!bulkProgress || visibleItems.length === 0}
                    onClick={() => downloadMany(visibleItems)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {bulkProgress ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Downloading {bulkProgress.done}/{bulkProgress.total}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-amber-400" />
                        <span>{matchIds ? 'Meri Saari Photos Download' : 'Sab Download Karein'}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={async () => {
                      const url = window.location.href;
                      if (navigator.share) {
                        try {
                          await navigator.share({ title: eventTitle, url });
                        } catch {
                          /* cancelled */
                        }
                      } else {
                        await navigator.clipboard.writeText(url);
                        showToast('Gallery link copy ho gaya');
                      }
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Folders */}
            {folders.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 text-xs font-semibold">
                {['All', ...folders].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFolder(f)}
                    className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                      selectedFolder === f
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {f === 'All' ? 'All' : f}
                  </button>
                ))}
              </div>
            )}

            {visibleItems.length === 0 ? (
              <div className="py-16 text-center text-sm text-slate-400">
                {matchIds ? 'Is selfie se koi photo match nahi hui.' : 'Is folder mein koi photo nahi hai.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800 cursor-pointer hover:border-amber-400/50 transition aspect-square sm:aspect-[4/3] bg-slate-900"
                  >
                    {item.mediaType === 'video' ? (
                      <video src={item.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={item.thumb}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    )}
                    {item.mediaType === 'video' && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] bg-black/70 text-amber-400 font-mono flex items-center gap-1">
                        <Film className="w-3 h-3" /> Video
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadItem(item);
                      }}
                      className="absolute bottom-2 right-2 w-9 h-9 rounded-full bg-black/70 hover:bg-amber-500 hover:text-slate-950 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
                      aria-label={`Download ${item.title}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox */}
      {activeItem && (
        <div
          onClick={() => setActiveId(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full px-3 sm:px-6 py-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-amber-400">
                {activeIndex + 1} / {visibleItems.length}
              </span>
              <span className="text-sm font-semibold text-white truncate">{activeItem.title}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => downloadItem(activeItem)}
                className="px-3 sm:px-4 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => setActiveId(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 min-h-0 flex items-center justify-center px-2 sm:px-16 pb-4"
          >
            {activeItem.mediaType === 'video' ? (
              <video
                key={activeItem.id}
                src={activeItem.url}
                controls
                autoPlay
                playsInline
                className="max-h-full max-w-full rounded-xl"
              />
            ) : (
              <img src={activeItem.url} alt={activeItem.title} className="max-h-full max-w-full object-contain rounded-lg" />
            )}

            {visibleItems.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-2 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 border border-white/10 text-white flex items-center justify-center cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-2 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 border border-white/10 text-white flex items-center justify-center cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
