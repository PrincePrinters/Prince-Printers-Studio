import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, Camera, Film, Award, Heart, ShieldCheck, 
  Users, CheckCircle2, ArrowRight, Eye, Star,
  Compass, Clock, Phone, ExternalLink, Flame, Gem,
  Maximize2, Zap, Play, ArrowUpRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectorConciergePill from '@/components/DirectorConciergePill';
import { studio, telLink } from '@/config/studio';
import { heroSlides, portfolio } from '@/config/content';

export const metadata = {
  title: `About ${studio.brand.name} | Luxury Wedding Cinematography & Photography`,
  description:
    `Led by master cinematographer ${studio.owner.displayName}, ${studio.brand.name} crafts royal wedding films, candid photography, and luxury destination visual heirlooms across India.`,
};

/** Owner ke products ke naam paragraph mein aaye to unhe link bana do */
function linkProducts(text: string) {
  const products = studio.products.filter((p) => p.name);
  if (products.length === 0) return text;
  const escaped = products.map((p) => p.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'g'));
  return parts.map((part, i) => {
    const product = products.find((p) => p.name === part);
    return product ? (
      <a
        key={i}
        href={product.url}
        target="_blank"
        rel="noreferrer"
        className="font-bold text-amber-400 underline underline-offset-4 hover:text-amber-300"
      >
        {part}
      </a>
    ) : (
      part
    );
  });
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32 overflow-hidden bg-slate-950 border-b border-slate-900">
          {heroSlides[0] && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 filter scale-105"
              style={{ backgroundImage: `url('${heroSlides[0].url}')` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
          
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest font-mono mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Luxury Wedding Photography &amp; Cinematography</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
              Where Royal Grandeur Meets <br />
              <span className="gold-gradient-text">Bollywood-Grade Cinema</span>
            </h1>

            <p className="max-w-3xl mx-auto text-slate-300 text-base sm:text-xl leading-relaxed font-light">
              Founded by master cinematographer <strong>{studio.owner.displayName}</strong>, <strong>{studio.brand.name}</strong> is an elite wedding production house dedicated to immortalizing royal celebrations, unscripted emotions, and multi-day destination weddings into timeless cinematic heirlooms.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-xl shadow-amber-500/20 inline-flex items-center gap-2 transition"
              >
                <span>Book Your Wedding Dates</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#portfolio"
                className="px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 inline-flex items-center gap-2 transition"
              >
                <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Watch Wedding Cinema</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Studio Numbers / Proof Bar */}
        <section className="py-12 bg-slate-900/70 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl glass-card border border-white/5">
                <div className="text-3xl sm:text-5xl font-black text-amber-400 font-mono">500+</div>
                <div className="text-xs sm:text-sm text-slate-200 font-semibold mt-1">Royal Weddings Filmed</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Rajasthan, Bihar, Goa &amp; Across India</div>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/5">
                <div className="text-3xl sm:text-5xl font-black text-white font-mono">{studio.owner.yearsExperience}</div>
                <div className="text-xs sm:text-sm text-slate-200 font-semibold mt-1">Years of Creative Mastery</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Founded &amp; Directed by {studio.owner.displayName}</div>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/5">
                <div className="text-3xl sm:text-5xl font-black text-amber-400 font-mono">72 Hrs</div>
                <div className="text-xs sm:text-sm text-slate-200 font-semibold mt-1">First Look Teaser Delivery</div>
                <div className="text-[11px] text-slate-500 mt-0.5">50 curated preview stills for social</div>
              </div>

              <div className="p-4 rounded-2xl glass-card border border-white/5">
                <div className="text-3xl sm:text-5xl font-black text-emerald-400 font-mono">4.9 ★</div>
                <div className="text-xs sm:text-sm text-slate-200 font-semibold mt-1">Client Satisfaction Rating</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Over 250+ ecstatic couples &amp; families</div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder & Lead Mentor Spotlight (from src/config/studio.ts) */}
        <section className="py-16 sm:py-24 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 items-center">

            {/* Founder Portrait with floating badges */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[22rem] sm:max-w-md mt-6 sm:mt-8 mb-8 sm:mb-6">
                <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-amber-500/25 bg-black shadow-2xl">
                  <Image
                    src={studio.owner.aboutPhoto}
                    alt={`${studio.owner.fullName} - ${studio.owner.title}, ${studio.brand.name}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 450px"
                    className="object-cover object-center"
                  />
                </div>

                {/* Top-right name badge */}
                <div className="absolute -top-6 sm:-top-8 right-0 sm:-right-4 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#1a1712]/95 border border-amber-500/40 shadow-xl backdrop-blur-md">
                  <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-400">{studio.owner.title}</div>
                  <div className="text-sm sm:text-base font-bold text-white whitespace-nowrap">{studio.owner.fullName}</div>
                </div>

                {/* Bottom-left experience badge */}
                <div className="absolute -bottom-8 sm:-bottom-6 left-0 sm:-left-5 px-4 sm:px-5 py-3 rounded-2xl bg-[#1a1712]/95 border border-amber-500/40 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="text-[11px] sm:text-xs font-semibold text-slate-200 whitespace-nowrap">{studio.owner.yearsExperience} Years Filmmaking Experience</div>
                </div>
              </div>
            </div>

            {/* Founder Story */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/5 text-amber-400 text-[11px] sm:text-xs font-semibold tracking-[0.15em] uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{studio.academy.enabled ? 'The Founder & Lead Mentor' : 'The Founder'}</span>
              </div>

              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
                  {studio.owner.fullName}
                </h2>
                <p className="mt-3 text-base sm:text-xl font-semibold text-amber-400 leading-snug">
                  {studio.owner.subtitleLine}
                </p>
              </div>

              {studio.aboutParagraphs.map((para, idx) => (
                <p key={idx} className="text-slate-300 text-sm sm:text-lg leading-relaxed">
                  {linkProducts(para)}
                </p>
              ))}

              <div className="pt-2 space-y-3">
                {(studio.social.youtube || studio.social.instagram) && (
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                    {studio.social.youtube && (
                      <a
                        href={studio.social.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch Free Tutorials on YouTube</span>
                      </a>
                    )}
                    {studio.social.instagram && (
                      <a
                        href={studio.social.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:brightness-110 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition"
                      >
                        <span>Follow on Instagram</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
                {studio.academy.enabled && (
                  <Link
                    href="/contact"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#1a1712] hover:bg-[#25201a] border border-slate-700 hover:border-amber-500/40 text-white text-base font-semibold inline-flex items-center justify-center gap-3 transition"
                  >
                    <span>Explore {studio.academy.courseShortName}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Our Signature Wedding Services */}
        <section className="py-20 bg-slate-900/50 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-amber-500/30 text-amber-400 text-xs font-semibold font-mono mb-3">
                <span>OUR BESPOKE SERVICES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Complete End-to-End <span className="gold-gradient-text">Wedding Productions</span>
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                From intimate sangeet nights to grand multi-day palace weddings, we deliver complete visual mastery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Service 1 */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-amber-500/40 transition space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Cinematic Wedding Films</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Feature-length 4K master films cut to emotional music scores, customized sound design, and Hollywood color grading in DaVinci Resolve.
                </p>
                <div className="text-[11px] text-amber-400 font-mono">
                  &bull; 3-5 min Teaser &bull; 25-40 min Extended Film
                </div>
              </div>

              {/* Service 2 */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-amber-500/40 transition space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Candid &amp; Fine-Art Photography</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unobtrusive capture of spontaneous emotions, tears, laughter, and high-fashion editorial bridal portraits with magazine styling.
                </p>
                <div className="text-[11px] text-rose-400 font-mono">
                  &bull; 1,000+ Color-Graded Stills &bull; High-Res Cloud Drive
                </div>
              </div>

              {/* Service 3 */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-amber-500/40 transition space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Cinematic Pre-Wedding Films</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Conceptual music-video style pre-wedding stories shot at exotic heritage locations, desert dunes, beaches, or private resorts.
                </p>
                <div className="text-[11px] text-sky-400 font-mono">
                  &bull; Drone Cinematography &bull; Storyboard &amp; Costumes
                </div>
              </div>

              {/* Service 4 */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-amber-500/40 transition space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Maximize2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Licensed Drone &amp; Aerials</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Breathtaking bird’s-eye sweeps of palace architecture, royal barat processions, and scenic sunset varmala moments.
                </p>
                <div className="text-[11px] text-purple-400 font-mono">
                  &bull; 4K HDR 60fps &bull; Licensed &amp; Insured Operators
                </div>
              </div>

              {/* Service 5 */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-amber-500/40 transition space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Guest Face-Recognition</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  QR code table stands where wedding guests take a quick selfie to immediately view and download all their personal candid photos.
                </p>
                <div className="text-[11px] text-emerald-400 font-mono">
                  &bull; Instant 0.5s Search &bull; Zero App Download Needed
                </div>
              </div>

              {/* Service 6 */}
              <div className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-amber-500/40 transition space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Gem className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Handcrafted Heritage Albums</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Italian leather, velvet-bound seamless layflat flush-mount photo books printed on archival metallic and matte papers guaranteed for 100+ years.
                </p>
                <div className="text-[11px] text-amber-400 font-mono">
                  &bull; Custom Wooden Presentation Box &bull; Lifetime Warranty
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Our Cinematic Equipment & Standards */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-widest font-mono">
                CINEMA TECHNOLOGY &amp; GEAR
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                No Compromise on <span className="gold-gradient-text">Visual Fidelity</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We believe exceptional moments deserve exceptional technology. Our studio deploys television &amp; cinema-standard cameras, prime glass, wireless audio, and dedicated stabilization.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl glass-card border border-slate-800 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full-Frame Cinema Bodies &amp; Prime Glass</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Sony FX3 &amp; FX6 cinema bodies paired with GM prime lenses for creamy bokeh, filmic depth of field, and unmatched low-light performance.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl glass-card border border-slate-800 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Broadcast Wireless Audio Capture</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      32-bit float wireless lavalier microphones capturing sacred wedding vows, mantras, and emotional speeches with zero clipping or distortion.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl glass-card border border-slate-800 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Precision Hollywood Color Grading</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      In-house color suite grading in DaVinci Resolve on calibrated monitors for rich royal skin tones, authentic lehenga hues, and warm cinema light.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Showcase Box */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border-2 border-amber-500/30 shadow-2xl">
                <Image
                  src={portfolio[0]?.image || studio.owner.aboutPhoto}
                  alt={`${studio.brand.name} Wedding Cinema Production`}
                  fill
                  className="object-cover hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl glass-card border border-white/10 bg-slate-950/85 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Master Direction by {studio.owner.displayName}</span>
                    <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Multi-Camera Setup
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Every shoot is individually directed to reflect the unique personality and heritage of each couple.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* How We Work - The Journey */}
        <section className="py-20 bg-slate-900/60 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-widest font-mono mb-2">
                SEAMLESS EXPERIENCE
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                How We Bring Your <span className="gold-gradient-text">Story to Life</span>
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                From your initial creative consultation with {studio.owner.designation} {studio.owner.displayName} to holding your custom handcrafted album.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl glass-card border border-slate-800 relative">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-amber-500/20">
                  01
                </div>
                <h4 className="font-bold text-white text-base mb-2">Creative Consultation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We sit down with you to understand your timeline, ceremonies, family dynamics, costume palettes, and aesthetic preferences.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-card border border-slate-800 relative">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-amber-500/20">
                  02
                </div>
                <h4 className="font-bold text-white text-base mb-2">Master Shoot Execution</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {studio.owner.designation} {studio.owner.displayName} and our senior cinematographers handle multi-camera angles, candid portraits, aerials, and audio seamlessly.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-card border border-slate-800 relative">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-amber-500/20">
                  03
                </div>
                <h4 className="font-bold text-white text-base mb-2">72-Hour First Look</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Within 72 hours of your wedding, receive 50 curated high-resolution edited stills to share your celebration with family and social media.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-card border border-slate-800 relative">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-amber-500/20">
                  04
                </div>
                <h4 className="font-bold text-white text-base mb-2">Heirloom Delivery</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full 4K cinematic film, private cloud AI gallery for wedding guests, and handcrafted flush-mount leather albums delivered to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Book / Contact CTA */}
        <section className="py-20 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border-t border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-amber-500/30 text-amber-400 text-xs font-semibold font-mono mb-4">
              <span>RESERVE YOUR DATES EARLY</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
              Let&apos;s Create Something <span className="gold-gradient-text">Unforgettable</span>
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              We accept a strictly limited number of high-touch weddings each season to guarantee uncompromising attention to detail and personal direction by {studio.owner.displayName}.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-xl shadow-amber-500/20 inline-flex items-center gap-2"
              >
                <span>Inquire Date Availability</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={telLink()}
                className="px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call {studio.contact.phone}</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      <DirectorConciergePill />

      <Footer />
    </div>
  );
}
