'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Phone, Mail, ShieldCheck, Heart, Video, Globe } from 'lucide-react';
import { studio, telLink } from '@/config/studio';
import { portfolio, packages, estimatorRates } from '@/config/content';
import SiteCredit from './SiteCredit';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg shadow-amber-500/10 border border-amber-500/30 group-hover:border-amber-400 group-hover:scale-105 transition-all">
                <Image
                  src={studio.brand.logo}
                  alt={`${studio.brand.name} Logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-base font-black text-white uppercase tracking-wider block font-sans">
                  {studio.brand.nameMain} <span className="text-amber-400">{studio.brand.nameHighlight}</span>
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                  {studio.brand.tagline} &bull; {studio.brand.shortName}
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Capturing breathtaking wedding visuals across India. Equipped with 4K cinema cameras, aerial drones, zero-egress cloud storage, and AI-powered guest face search.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={studio.social.instagram || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/30 flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={studio.social.youtube || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/30 flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <Video className="w-4 h-4" />
              </a>
              <a
                href={telLink()}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/30 flex items-center justify-center transition"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${studio.contact.email}`}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/30 flex items-center justify-center transition"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Platform</h4>
            <ul className="space-y-2.5">
              {portfolio.length > 0 && <li><Link href="/#portfolio" className="hover:text-amber-400 transition">Portfolio</Link></li>}
              <li><Link href="/#services" className="hover:text-amber-400 transition">Services</Link></li>
              {(packages.length > 0 || estimatorRates) && <li><Link href="/#packages" className="hover:text-amber-400 transition">Packages & Pricing</Link></li>}
              <li><Link href="/about" className="hover:text-amber-400 transition">About {studio.brand.nameMain}</Link></li>
              <li><Link href="/blog" className="hover:text-amber-400 transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition">Contact & Booking</Link></li>
              <li><Link href="/ai-search" className="text-amber-400 hover:underline">AI Face Search (Selfie)</Link></li>
            </ul>
          </div>

          {/* Guests */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Guests</h4>
            <ul className="space-y-2.5">
              <li><Link href="/ai-search" className="hover:text-amber-400 transition">Event Code se Photos Dekhein</Link></li>
              <li><Link href="/ai-search" className="hover:text-amber-400 transition">Selfie se Apni Photos Dhoondhein</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition">Event Code Nahi Mila? Sampark Karein</Link></li>
            </ul>
          </div>

          {/* Studio Tech & Standards */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono">Standards</h4>
            <ul className="space-y-2.5">
              <li><span className="text-slate-400">Online Photo &amp; Video Gallery</span></li>
              <li><span className="text-slate-400">QR Code Guest Access</span></li>
              <li><span className="text-slate-400">Selfie Face Search</span></li>
              <li><span className="text-slate-400">HD Download</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500 text-[11px]">
          <div>
            &copy; {studio.brand.copyrightYear} {studio.brand.legalName}. All Rights Reserved.
          </div>
          {/* LOCKED developer credit — required by LICENSE, do not remove */}
          <SiteCredit />
        </div>

      </div>
    </footer>
  );
}
