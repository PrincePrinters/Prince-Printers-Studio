'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle2, 
  Sparkles, HelpCircle, ChevronDown, ChevronUp, MessageCircle,
  Building2, GraduationCap, Star, ArrowRight, ShieldCheck,
  Compass, ExternalLink, Calendar, Video, Monitor, Award
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectorConciergePill from '@/components/DirectorConciergePill';
import { studio, telLink, whatsappLink, academyPhone, academyWhatsapp } from '@/config/studio';

const FAQS = [
  {
    q: 'Is the training suitable for beginners?',
    a: 'Yes, absolutely. The flagship course starts with basic camera anatomy, composition, and video editing fundamentals from scratch, then systematically builds towards advanced multi-camera workflows, cinematic color grading, and your final portfolio wedding film with dedicated 1-on-1 mentorship.',
  },
  {
    q: 'Where does the Master Class take place?',
    a: `The ${studio.academy.courseName} is conducted offline at ${studio.academy.name}, ${studio.contact.address}. We are equipped with high-performance GPU editing workstations, studio lighting, and calibrated monitors.`,
  },
  {
    q: 'What is included in the 14-week programme?',
    a: 'The programme includes 12 weeks of intensive core technical training (Premiere Pro, DaVinci Resolve, EDIUS, Photoshop & AI video workflows) plus 2 free weeks of studio business, marketing, pricing negotiation, and client acquisition. Outstation students receive verified hostel accommodation support.',
  },
  {
    q: 'Will I work on real practical wedding projects?',
    a: 'Yes! Zero fake stock footage. You will practice on multi-camera 4K wedding footage shot at real ceremonies, handle bridal entries, master raw audio ducking, perform color matching, and deliver print-ready wedding album layouts.',
  },
  {
    q: 'How do I confirm course fees and batch dates?',
    a: `You can directly call our admissions desk at ${academyPhone} or submit the callback form. Our counseling team will verify current fees, installment options, next batch availability, and hostel arrangements.`,
  },
  {
    q: 'Do you also film luxury weddings for private clients?',
    a: `Yes! Under the direct leadership of ${studio.owner.designation} ${studio.owner.displayName}, our senior studio crew shoots destination and royal weddings across ${studio.contact.serviceAreas}, and nationwide. Inquire early to lock your dates.`,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    courseTrack: `${studio.academy.courseName} (Offline ${studio.contact.city})`,
    city: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          eventType: formData.courseTrack,
          location: formData.city || `${studio.contact.city} / Online`,
          budget: 'Standard Track',
          notes: formData.notes,
          source: 'Contact Page',
        }),
      });
      if (!res.ok) throw new Error('save failed');
      setSubmitted(true);
    } catch {
      window.alert(`Form send nahi ho paya. Kripya seedha call ya WhatsApp kariye: ${academyPhone}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 bg-slate-950 border-b border-slate-900 overflow-hidden text-center">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10 filter scale-105"
            style={{ backgroundImage: `url('/contact-hero.webp')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950" />

          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest font-mono mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Contact {studio.academy.enabled ? studio.academy.name : studio.brand.name} &bull; {studio.contact.city}, {studio.contact.state}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Your Next Chapter Starts with a <br />
              <span className="gold-gradient-text">Conversation</span>
            </h1>

            <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Speak with our admissions &amp; studio team about courses, batch dates, fees, and hostel stay, book a <strong>free demo class</strong>, or lock your luxury wedding shoot dates with {studio.owner.designation} {studio.owner.displayName}.
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-mono">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 / 5 &bull; 257+ Student Reviews</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Outstation Hostel Assistance</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>1,800+ Successful Enrollments</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information & Admissions Form Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left 5 Cols: Direct Contact Desks */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="text-xs text-amber-400 font-semibold uppercase tracking-widest font-mono mb-1">
                  ADMISSIONS &amp; STUDIO DESK
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Talk to Our <span className="gold-gradient-text">Admissions Team</span>
                </h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Questions about a course, fees, next batch, or wedding shoot availability? Reach us on any channel below or submit the form for a callback.
                </p>
              </div>

              <div className="space-y-4">
                {/* Admissions Phone Call */}
                <a
                  href={telLink(academyPhone)}
                  className="p-5 rounded-2xl glass-card glass-card-hover border border-amber-500/30 flex items-center gap-4 block transition bg-gradient-to-r from-amber-500/10 via-slate-900 to-transparent"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] text-amber-400 font-mono font-semibold uppercase">Official Admissions Hotline</div>
                    <div className="text-lg font-bold text-white tracking-wide">{academyPhone}</div>
                    <div className="text-[11px] text-slate-400">{studio.contact.workingHours}</div>
                  </div>
                </a>

                {/* Director Desk Phone */}
                <a
                  href={telLink()}
                  className="p-4 rounded-xl glass-card glass-card-hover border border-slate-800 flex items-center gap-4 block transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">{studio.owner.designation} Desk &bull; {studio.owner.displayName}</div>
                    <div className="text-sm font-bold text-white">{studio.contact.phone}</div>
                    <div className="text-[10px] text-slate-500">Filmmaking consultations &amp; master mentorship</div>
                  </div>
                </a>

                {/* WhatsApp Chat Concierge */}
                <a
                  href={whatsappLink(`Hello ${studio.academy.name}, I want to know more about the courses and admissions.`, academyWhatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl glass-card glass-card-hover border border-emerald-500/30 flex items-center gap-4 block bg-emerald-950/20 transition"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[11px] text-emerald-400 font-semibold font-mono uppercase">Instant WhatsApp Chat</div>
                    <div className="text-base font-bold text-white">Chat with Admissions Desk</div>
                    <div className="text-[11px] text-slate-400">Send your questions anytime &bull; Fast response</div>
                  </div>
                </a>

                {/* Email Desk */}
                <a
                  href={`mailto:${studio.contact.email}`}
                  className="p-4 rounded-xl glass-card glass-card-hover border border-slate-800 flex items-center gap-4 block transition"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-sky-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-mono">Official Email Support</div>
                    <div className="text-sm font-bold text-white break-all">{studio.contact.email}</div>
                    <div className="text-[10px] text-slate-500">Brochure &amp; fee structure sent within 1 hour</div>
                  </div>
                </a>

                {/* Campus Address Card */}
                <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3 bg-slate-900/60">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] text-amber-400 font-mono font-semibold uppercase">Offline Academy &amp; Studio</div>
                      <div className="text-sm font-bold text-white mt-0.5">{studio.academy.enabled ? studio.academy.name : studio.brand.name}</div>
                      <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {studio.contact.address}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex flex-col gap-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{studio.contact.workingHours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{studio.contact.landmarks.slice(0, 2).join(' • ')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  <strong>Travelling for the course?</strong> Please confirm your batch dates and verified hostel accommodation with our admissions team before you travel.
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Interactive Admissions & Callback Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl glass-card border border-amber-500/30 bg-slate-900/95 shadow-2xl relative">
                
                {submitted ? (
                  <div className="text-center py-16 space-y-5">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Thank You, {formData.name}!</h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      Your inquiry has been successfully delivered to the {studio.academy.name} admissions desk &amp; {studio.owner.designation} {studio.owner.displayName}. Our team will contact you at <span className="text-amber-400 font-bold">{formData.phone}</span> within 1 hour to discuss your chosen track and arrange your demo class slot.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={whatsappLink(`Hello Admissions, I just submitted my form for ${formData.courseTrack}`, academyWhatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white inline-flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Instant WhatsApp Follow-up</span>
                      </a>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-mono mb-2">
                        <span>LET&apos;S TALK ABOUT YOUR GOALS</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white">
                        Book a Free Demo Class or Callback
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Share your details below. Our team will contact you to discuss the course curriculum, fee installments, hostel stay, and arrange your demo slot.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Kumar"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp Number *</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3.5 text-xs text-slate-400 font-mono">🇮🇳 +91</span>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="98XXX XXXXX"
                            className="w-full pl-16 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="rahul@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Your City / District</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder={`e.g. ${studio.contact.city}`}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Interested Program / Service *</label>
                      <select
                        value={formData.courseTrack}
                        onChange={(e) => setFormData({ ...formData, courseTrack: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                      >
                        <option>{studio.academy.courseName} (Offline {studio.contact.city})</option>
                        <option>Cinematic Video Editing (Premiere Pro & DaVinci)</option>
                        <option>EDIUS Wedding Express Editing Course</option>
                        <option>Wedding Album Design & Photoshop Color Grading</option>
                        <option>AI Wedding Filmmaking & Face Automation</option>
                        <option>Luxury Wedding Cinematography (Client Shoot Booking)</option>
                        <option>Free Demo Class / Studio Tour Visit</option>
                        <option>Help Me Choose the Right Course</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Anything You&apos;d Like to Ask?</label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Tell us about your background, camera experience, hostel requirements, or wedding shoot dates..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
                      >
                        {loading ? (
                          <span>Submitting enquiry...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Request Callback &amp; Demo Slot</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center pt-1 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Your details are 100% confidential. Admissions team calls within 1 hour.</span>
                    </div>
                  </form>
                )}

              </div>
            </div>

          </div>
        </section>

        {/* Plan Your Visit to Studio Section */}
        <section className="py-20 bg-slate-900/60 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border border-amber-500/30 text-amber-400 text-xs font-semibold font-mono">
                  <span>VISIT THE ACADEMY</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Plan Your Visit to Our <span className="gold-gradient-text">{studio.contact.city} Studio</span>
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  See the editing lab, meet the faculty and get your questions answered in person at our video editing and photography academy in {studio.contact.city}, {studio.contact.state}.
                </p>

                <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>On Your Free Demo Visit:</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Tour the editing lab and see a live 4K multi-camera wedding editing timeline.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Try EDIUS, Premiere Pro and DaVinci Resolve GPU workstations and see printed album samples.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Discuss the right course, current fee structure, installment options, and batch dates.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
                  <div className="text-white font-bold">Directions &amp; Getting Here:</div>
                  {studio.contact.landmarks.map((item) => (
                    <div key={item}>&bull; {item}</div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={studio.contact.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-xl font-bold uppercase text-xs tracking-wider bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 inline-flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <a
                    href={telLink(academyPhone)}
                    className="px-5 py-3 rounded-xl font-bold uppercase text-xs tracking-wider bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Ahead: {academyPhone}</span>
                  </a>
                </div>
              </div>

              {/* Classroom Photo */}
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border-2 border-amber-500/30 shadow-2xl">
                  <Image
                    src="/edius-classroom.webp"
                    alt={`${studio.academy.name} Classroom & Post Production Lab`}
                    fill
                    className="object-cover hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card border border-white/10 bg-slate-950/85 backdrop-blur-md">
                    <div className="text-sm font-bold text-white flex items-center justify-between">
                      <span>{studio.brand.nameMain} Editing Lab &bull; {studio.contact.city}</span>
                      <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Live Classroom
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {studio.contact.address}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-xs text-amber-400 font-semibold uppercase tracking-widest font-mono mb-2">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Everything You <span className="gold-gradient-text">Need to Know</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              A clear starting point for your next creative step.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl glass-card border border-slate-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-amber-400 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <div className="text-xs text-slate-400">
              Have another question? Reach {studio.owner.designation} {studio.owner.displayName} &amp; admissions desk directly at{' '}
              <a href={telLink(academyPhone)} className="text-amber-400 underline font-semibold">
                {academyPhone}
              </a>{' '}
              or{' '}
              <a href={`mailto:${studio.contact.email}`} className="text-amber-400 underline font-semibold">
                {studio.contact.email}
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
