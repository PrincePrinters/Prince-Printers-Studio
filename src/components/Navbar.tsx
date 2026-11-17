'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { KeyRound, Sparkles, Menu, X, Camera, ShieldCheck } from 'lucide-react';
import EventCodeModal from './EventCodeModal';
import { studio } from '@/config/studio';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl overflow-hidden shadow-lg shadow-amber-500/10 border border-amber-500/30 group-hover:border-amber-400 group-hover:scale-105 transition-all">
              <Image
                src={studio.brand.logo}
                alt={`${studio.brand.name} Logo`}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg font-black whitespace-nowrap tracking-wider text-white uppercase group-hover:text-amber-400 transition font-sans">
                {studio.brand.nameMain} <span className="text-amber-400">{studio.brand.nameHighlight}</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-mono whitespace-nowrap">
                {studio.brand.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <Link href="/#portfolio" className="hover:text-amber-400 transition">Portfolio</Link>
            <Link href="/#services" className="hover:text-amber-400 transition">Services</Link>
            <Link href="/#packages" className="hover:text-amber-400 transition">Packages</Link>
            <Link href="/about" className="hover:text-amber-400 transition">About Us</Link>
            <Link href="/blog" className="hover:text-amber-400 transition">Blog</Link>
            <Link href="/contact" className="hover:text-amber-400 transition">Contact</Link>
            <Link href="/ai-search" className="flex items-center gap-1.5 text-amber-300 hover:text-amber-400 transition px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Face Search</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Event Code Modal Trigger */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 hover:border-amber-400 flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Event Code</span>
            </button>

            {/* Book Now Button */}
            <Link
              href="/#inquiry"
              className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition shadow-md shadow-amber-500/20"
            >
              Book Shoot
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="sm:hidden p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20"
              aria-label="Event Code"
            >
              <KeyRound className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 sm:px-6 pt-3 pb-6 border-t border-slate-800 bg-slate-950/95 space-y-1 max-h-[calc(100dvh-4rem)] overflow-y-auto">
            <Link
              href="/#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-amber-400"
            >
              Portfolio
            </Link>
            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-amber-400"
            >
              Services
            </Link>
            <Link
              href="/#packages"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-amber-400"
            >
              Packages & Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-amber-400"
            >
              About {studio.brand.name}
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-amber-400"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-amber-400"
            >
              Contact & Studio Location
            </Link>
            <Link
              href="/ai-search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-amber-400 font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Face Search (Selfie)</span>
            </Link>
            <div className="pt-2">
              <Link
                href="/#inquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 rounded-xl font-bold bg-amber-500 text-slate-950 uppercase text-xs"
              >
                Book Your Shoot
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Event Code Modal */}
      <EventCodeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

