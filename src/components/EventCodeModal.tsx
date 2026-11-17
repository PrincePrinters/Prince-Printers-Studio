'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, KeyRound, Sparkles, X, ArrowRight } from 'lucide-react';

interface EventCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventCodeModal({ isOpen, onClose }: EventCodeModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter your event code');
      return;
    }
    onClose();
    router.push(`/gallery/${cleanCode}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl glass-card border border-amber-500/20 shadow-2xl bg-slate-950/90 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/30">
            <KeyRound className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Access Your Event Gallery</h3>
          <p className="text-sm text-slate-400 mt-1">
            Enter the private Event Code given on your invitation or booking confirmation.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="e.g. RAHUL2026"
                className="w-full px-5 py-4 pl-12 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-lg uppercase tracking-wider font-semibold text-white placeholder-slate-500 outline-none transition"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Open Private Gallery</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
}

