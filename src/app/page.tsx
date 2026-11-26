'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PublicNav } from '@/components/PublicNav';
import { Footer } from '@/components/Footer';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { InstagramIcon } from '@/components/InstagramIcon';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { sanitizeString, sanitizePhone, checkRateLimit } from '@/lib/sanitize';
import {
  DEFAULT_CONTENT,
  SiteContent,
  FacilityItem,
  TransformationItem,
  TrainerPhotoItem,
} from '@/data/default-content';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  Dumbbell,
  Calendar,
  AlertCircle,
  ExternalLink,
  X,
  Check
} from 'lucide-react';

export default function PublicGymWebsite() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [selectedPhoto, setSelectedPhoto] = useState<FacilityItem | null>(null);
  const [selectedTransformation, setSelectedTransformation] = useState<TransformationItem | null>(null);
  const [selectedTrainerPhoto, setSelectedTrainerPhoto] = useState<TrainerPhotoItem | null>(null);

  // Sync with dynamic CMS content saved by admin
  useEffect(() => {
    fetch('/api/content')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.general) {
          setContent(data);
        }
      })
      .catch((err) => console.warn('Could not load dynamic content:', err));
  }, []);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryGoal, setInquiryGoal] = useState('general_fitness');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryTime, setInquiryTime] = useState('06:30 PM - 08:00 PM');
  const [inquiryConsent, setInquiryConsent] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const todayDateStr = new Date().toISOString().split('T')[0];

  const handleSelectPlan = (planId: string) => {
    setInquiryGoal(planId);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('idle');

    const rateCheck = checkRateLimit('walkthrough_inquiry', 3, 60000);
    if (!rateCheck.allowed) {
      setInquiryStatus('error');
      setInquiryMessage(`Too many requests. Please wait ${rateCheck.retryAfterSeconds} seconds before submitting again.`);
      return;
    }

    if (!inquiryConsent) {
      setInquiryStatus('error');
      setInquiryMessage('Please agree to allow Karnataka Gym to contact you regarding your walkthrough inquiry.');
      return;
    }

    const { sanitized: cleanPhone, isValid } = sanitizePhone(inquiryPhone);
    const cleanName = sanitizeString(inquiryName);

    if (!cleanName || cleanName.length < 2) {
      setInquiryStatus('error');
      setInquiryMessage('Please provide your full name.');
      return;
    }

    if (!isValid || cleanPhone.length < 10) {
      setInquiryStatus('error');
      setInquiryMessage('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (!inquiryDate) {
      setInquiryStatus('error');
      setInquiryMessage('Please select your preferred visit date.');
      return;
    }

    // Submit inquiry to backend so it lands in Admin Console Inbox
    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: cleanName,
        phone: cleanPhone,
        goal: inquiryGoal,
        date: inquiryDate,
        time: inquiryTime,
      }),
    }).catch((err) => console.warn('Inquiry background sync:', err));

    setInquiryStatus('success');
    setInquiryMessage(`Dhanyavad ${cleanName}! Your gym walkthrough has been confirmed for ${inquiryDate} (${inquiryTime}). Coach Riyaz / front desk staff will contact you at +91 ${cleanPhone}.`);
    setInquiryName('');
    setInquiryPhone('');
    setInquiryDate('');
    setInquiryConsent(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E] text-slate-100 font-sans selection:bg-[#E5A93C] selection:text-slate-950">
      {/* Sticky Navigation Bar */}
      <PublicNav />

      {/* App Install Banner */}
      <PWAInstallBanner />

      <main className="flex-1 space-y-24 pb-20">
        {/* 1. HERO SECTION */}
        <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-radial from-[#E5A93C]/10 via-[#07090E]/60 to-transparent pointer-events-none blur-3xl select-none"
            aria-hidden="true"
          />

          {/* Watermark Logo */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <div className="relative w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] lg:w-[580px] lg:h-[580px] opacity-10 drop-shadow-[0_0_80px_rgba(229,169,60,0.25)]">
              <Image
                src="/karnataka-gym-logo.png"
                alt=""
                fill
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 480px, 580px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
            {/* Primary Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight uppercase">
              {content.hero.headlinePart1}<br />
              <span className="text-[#E5A93C]">{content.hero.headlineHighlight}</span> {content.hero.headlinePart2}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {content.hero.subtitle}
            </p>

            {/* Direct Action Gateways */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <a
                href="#contact"
                className="w-full sm:w-auto bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black px-7 py-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 active:scale-95 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 stroke-[2.5]" />
                <span>Schedule Free Walkthrough</span>
              </a>

              <a
                href="#pricing"
                className="w-full sm:w-auto bg-[#141A28] hover:bg-[#1B2336] border border-[#2A364E] text-slate-200 font-extrabold px-6 py-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Dumbbell className="w-4 h-4 text-[#E5A93C]" />
                <span>View Membership Pricing</span>
              </a>
            </div>

            {/* Quick Contact Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
              <a
                href={`tel:${content.general.phone}`}
                className="flex items-center gap-1.5 bg-[#121724] border border-[#242F46] hover:border-[#E5A93C] px-3.5 py-2 rounded-xl text-slate-300 font-bold transition-colors"
                title="Call Karnataka Gym"
              >
                <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Call {content.general.phone}</span>
              </a>

              <a
                href={`https://wa.me/91${content.general.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#121724] border border-[#242F46] hover:border-emerald-500 px-3.5 py-2 rounded-xl text-emerald-400 font-bold transition-colors"
                title="Chat with Gym on WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Chat</span>
              </a>

              <a
                href={`https://www.instagram.com/${content.general.instagram.replace('@', '')}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#121724] border border-[#242F46] hover:border-pink-500 px-3.5 py-2 rounded-xl text-pink-400 font-bold transition-colors"
                title="Visit Coach Riyaz Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>{content.general.instagram}</span>
              </a>
            </div>

            {/* Metric / Trust Pillars Horizontal Ticker */}
            <div className="pt-8 border-t border-[#1C2538] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {content.hero.stats.map((st, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#0F1420] border border-[#1E273A]">
                  <span
                    className={`text-2xl sm:text-3xl font-black block ${
                      st.highlight ? 'text-[#E5A93C]' : 'text-white'
                    }`}
                  >
                    {st.value}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase mt-1 block">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. ABOUT KARNATAKA GYM (ARCHITECTURAL PILLARS) */}
        <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="rounded-3xl bg-[#0F1420] border border-[#1E273A] p-6 sm:p-10 space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">
                {content.about.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {content.about.heading}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {content.about.description}
              </p>
            </div>

            {/* 4 Architectural Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {content.about.pillars.map((pillar) => (
                <div key={pillar.id} className="p-5 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] flex items-center justify-center font-black">
                      {pillar.number}
                    </span>
                    <h3 className="text-sm font-black text-white">{pillar.title}</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. FACILITIES & EQUIPMENT SHOWCASE */}
        <section id="facilities" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">
              Facility Tour
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Built for Heavy, Uncompromised Training
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Inspect our real equipment floor in Hubballi. Commercial-grade steel, biomechanically sound resistance machines, and clean training stations.
            </p>
          </div>

          {/* 4-Photo Showcase Grid */}
          <div id="facility-tour" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-20">
            {content.facilities.map((photo, index) => (
              <div
                key={photo.id || photo.src}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative bg-[#0F1420] border-2 border-[#1E273A] hover:border-[#E5A93C] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0D14]">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1420] via-transparent to-black/30 pointer-events-none" />

                  {/* Tag top-left */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#07090E]/90 text-[#E5A93C] border border-[#E5A93C]/40 backdrop-blur-sm shadow-md">
                      {photo.tag}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#E5A93C] transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {photo.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#1C2538] text-[11px] text-slate-400">
                    <span className="font-semibold">{photo.specs}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {selectedPhoto && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedPhoto(null)}
            >
              <div
                className="relative max-w-4xl w-full bg-[#0F1420] border-2 border-[#1E273A] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-[#1E273A] bg-[#0A0D14]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30">
                    {selectedPhoto.tag}
                  </span>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-1.5 rounded-xl bg-[#141A28] hover:bg-[#1E273A] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative aspect-[16/10] w-full bg-black max-h-[70vh]">
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-contain"
                  />
                </div>

                <div className="p-4 bg-[#0A0D14] border-t border-[#1E273A]">
                  <h4 className="text-sm font-bold text-white">{selectedPhoto.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{selectedPhoto.desc}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4. REAL MEMBER TRANSFORMATIONS */}
        <section id="transformations" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Real Hubballi Transformations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Zero fake fitness models or generic stock images. These are everyday members who put in the daily sweat at Karnataka Gym under disciplined guidance.
            </p>
          </div>

          {/* 8-Item Transformation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.transformations.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedTransformation(item)}
                className="group relative bg-[#0F1420] border border-[#1E273A] hover:border-[#E5A93C] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Photo Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-black">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1420] via-transparent to-black/25 pointer-events-none" />

                  {/* Before / After Floating Badges */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-black/85 text-rose-300 border border-rose-500/30">
                      Before
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#E5A93C] text-slate-950 font-black shadow-md">
                      After • Fit
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-[#E5A93C] block uppercase tracking-wider">
                      {item.badge}
                    </span>
                    <h3 className="text-sm font-black text-white group-hover:text-[#E5A93C] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed mt-1">
                      {item.story}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transformation Modal Lightbox */}
          {selectedTransformation && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedTransformation(null)}
            >
              <div
                className="relative max-w-2xl w-full bg-[#0F1420] border-2 border-[#1E273A] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-[#1E273A] bg-[#0A0D14]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30">
                    {selectedTransformation.badge}
                  </span>
                  <button
                    onClick={() => setSelectedTransformation(null)}
                    className="p-1.5 rounded-xl bg-[#141A28] hover:bg-[#1E273A] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close transformation preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative aspect-square w-full bg-black max-h-[55vh]">
                  <Image
                    src={selectedTransformation.src}
                    alt={selectedTransformation.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-contain"
                  />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-black/85 text-rose-300 border border-rose-500/40">
                      Before
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase bg-[#E5A93C] text-slate-950 font-black shadow-lg">
                      After • Fit
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-[#0A0D14] border-t border-[#1E273A] space-y-2">
                  <h4 className="text-base font-black text-white">{selectedTransformation.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedTransformation.story}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 5. HEAD COACH & ATHLETIC PHILOSOPHY */}
        <section id="trainer" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 space-y-8">
          <div className="rounded-3xl bg-[#0F1420] border border-[#1E273A] p-6 sm:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1E273A]">
              <div className="space-y-2 max-w-2xl">
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Train Under {content.trainer.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {content.trainer.bio}
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  {content.trainer.specialties.map((spec, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#141A28] border border-[#242F46] text-[#E5A93C]">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`https://www.instagram.com/${content.trainer.instagramHandle.replace('@', '')}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#141A28] border border-[#242F46] hover:border-pink-500 text-pink-400 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
                  title="Follow Coach Riyaz on Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>{content.trainer.instagramHandle}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* 4 Coach Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {content.trainer.photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedTrainerPhoto(photo)}
                  className="group relative bg-[#141A28] border border-[#242F46] hover:border-[#E5A93C] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-black">
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141A28] via-transparent to-black/30 pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#07090E]/90 text-[#E5A93C] border border-[#E5A93C]/40 backdrop-blur-sm shadow-md">
                        {photo.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-sm font-black text-white group-hover:text-[#E5A93C] transition-colors leading-snug">
                        {photo.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {photo.desc}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#1E273A] text-[10px] text-slate-400 font-medium">
                      <span>Head Coach Riyaz</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trainer Modal Lightbox */}
          {selectedTrainerPhoto && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedTrainerPhoto(null)}
            >
              <div
                className="relative max-w-2xl w-full bg-[#0F1420] border-2 border-[#1E273A] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-[#1E273A] bg-[#0A0D14]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30">
                    {selectedTrainerPhoto.tag}
                  </span>
                  <button
                    onClick={() => setSelectedTrainerPhoto(null)}
                    className="p-1.5 rounded-xl bg-[#141A28] hover:bg-[#1E273A] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close trainer preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative aspect-[4/5] w-full bg-black max-h-[60vh]">
                  <Image
                    src={selectedTrainerPhoto.src}
                    alt={selectedTrainerPhoto.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-contain"
                  />
                </div>

                <div className="p-4 bg-[#0A0D14] border-t border-[#1E273A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <p className="text-slate-300">{selectedTrainerPhoto.desc}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href="https://www.instagram.com/riyaz_gokul/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-pink-400 font-bold hover:underline"
                    >
                      <InstagramIcon className="w-3.5 h-3.5" />
                      <span>@riyaz_gokul</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 6. TRANSPARENT MEMBERSHIP PRICING */}
        <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Honest Plans. No Hidden Surcharges.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Published fees in Indian Rupees. Zero admission charges, zero locker maintenance deposits, and direct facility access.
            </p>
          </div>

          {/* 4-Tier Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.pricing.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-[#141A28] border-2 border-[#E5A93C] shadow-2xl shadow-[#E5A93C]/10 scale-100 lg:-translate-y-2'
                    : 'bg-[#0F1420] border border-[#1E273A] hover:border-[#2A364E]'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E5A93C] text-slate-950 shadow-md">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white">{plan.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 min-h-[32px] leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1C2538]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{plan.price}</span>
                      <span className="text-xs text-slate-400 font-bold">/ {plan.duration}</span>
                    </div>
                    <span className="text-[11px] text-[#E5A93C] font-semibold block mt-0.5">
                      {plan.perMonth}
                    </span>
                  </div>

                  {/* Checklist */}
                  <div className="pt-3 border-t border-[#1C2538] space-y-2 text-xs">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-[#E5A93C] flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                      plan.highlight
                        ? 'bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 shadow-md shadow-[#E5A93C]/20'
                        : 'bg-[#1A2234] hover:bg-[#232E44] border border-[#2D3950] text-slate-200'
                    }`}
                  >
                    <span>Choose Plan &amp; Walk In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. LOCATION, TIMINGS & INQUIRY FORM */}
        <section id="location" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Location & Hours Details */}
            <div className="rounded-3xl bg-[#0F1420] border border-[#1E273A] p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">
                  Find Karnataka Gym
                </span>
                <h2 className="text-2xl font-black text-white mt-1">Location &amp; Operational Hours</h2>
              </div>

              {/* Address Box & Google Maps Link */}
              <div className="p-4 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E5A93C] flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-extrabold text-white block text-sm">{content.general.gymName}</span>
                    <p className="text-slate-200 font-semibold leading-relaxed">
                      {content.general.address}
                    </p>
                    <span className="text-[#E5A93C] font-medium block text-[11px] pt-0.5">
                      Direct Facility Location • Hubballi
                    </span>
                  </div>
                </div>

                <a
                  href={content.general.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0F1420] hover:bg-[#182030] border border-[#2D3950] hover:border-[#E5A93C] text-[#E5A93C] font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm group cursor-pointer"
                  title="Open Karnataka Gym in Google Maps"
                >
                  <MapPin className="w-4 h-4 text-[#E5A93C] group-hover:scale-110 transition-transform" />
                  <span>Open in Google Maps &amp; Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>

              {/* Timings Table */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#E5A93C]" />
                  Training Hours
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141A28] border border-[#242F46]">
                    <span className="font-bold text-white">Monday - Saturday (Morning)</span>
                    <span className="text-[#E5A93C] font-mono font-bold">{content.general.morningHours}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141A28] border border-[#242F46]">
                    <span className="font-bold text-white">Monday - Saturday (Evening)</span>
                    <span className="text-[#E5A93C] font-mono font-bold">{content.general.eveningHours}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141A28] border border-[#242F46]">
                    <span className="font-bold text-white">Sunday</span>
                    <span className="text-amber-400 font-mono font-bold">{content.general.sundayHours}</span>
                  </div>
                </div>
              </div>

              {/* Contact Channels */}
              <div id="contact" className="space-y-2 pt-2 scroll-mt-24">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Official Communication
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <a
                    href={`tel:${content.general.phone}`}
                    className="p-3 rounded-xl bg-[#141A28] border border-[#242F46] hover:border-[#E5A93C] flex items-center justify-center sm:justify-start gap-2.5 text-slate-200 font-bold transition-colors group cursor-pointer"
                    title="Call Karnataka Gym Helpline"
                  >
                    <Phone className="w-4 h-4 text-[#E5A93C] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span>Call {content.general.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/91${content.general.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#141A28] border border-[#242F46] hover:border-emerald-500 flex items-center justify-center sm:justify-start gap-2.5 text-emerald-400 font-bold transition-colors group cursor-pointer"
                    title="Chat on WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span>WhatsApp Chat</span>
                  </a>

                  <a
                    href={`mailto:${content.general.email}`}
                    className="p-3 rounded-xl bg-[#141A28] border border-[#242F46] hover:border-[#E5A93C] flex items-center justify-center sm:justify-start gap-2.5 text-slate-200 font-bold transition-colors group cursor-pointer"
                    title="Email Karnataka Gym"
                  >
                    <Mail className="w-4 h-4 text-[#E5A93C] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate">Email Us</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Walk-in Inquiry Form */}
            <div className="rounded-3xl bg-[#0F1420] border border-[#1E273A] p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white mt-1">Schedule a Gym Walkthrough</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Visit our facility in Hubballi, inspect the equipment, and discuss your fitness goals.
                </p>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full bg-[#141A28] border border-[#242F46] focus:border-[#E5A93C] rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="9902667407"
                      maxLength={10}
                      className="w-full bg-[#141A28] border border-[#242F46] focus:border-[#E5A93C] rounded-xl py-2.5 pl-11 pr-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Primary Fitness Goal / Plan
                  </label>
                  <select
                    value={inquiryGoal}
                    onChange={(e) => setInquiryGoal(e.target.value)}
                    className="w-full bg-[#141A28] border border-[#242F46] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                  >
                    <option value="general_fitness">General Health &amp; Fitness</option>
                    <option value="strength_hypertrophy">Raw Strength &amp; Muscle Building</option>
                    <option value="fat_loss">Weight Loss &amp; Conditioning</option>
                    <option value="monthly">Monthly Plan (₹1,500)</option>
                    <option value="quarterly">Quarterly Plan (₹4,000)</option>
                    <option value="half_yearly">Half-Yearly Plan (₹7,500)</option>
                    <option value="yearly">Yearly Plan (₹12,000)</option>
                  </select>
                </div>

                {/* Visit Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#E5A93C]" />
                      <span>Preferred Visit Date</span>
                    </label>
                    <input
                      type="date"
                      value={inquiryDate}
                      onChange={(e) => setInquiryDate(e.target.value)}
                      min={todayDateStr}
                      className="w-full bg-[#141A28] border border-[#242F46] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#E5A93C]" />
                      <span>Preferred Visit Time</span>
                    </label>
                    <select
                      value={inquiryTime}
                      onChange={(e) => setInquiryTime(e.target.value)}
                      className="w-full bg-[#141A28] border border-[#242F46] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                      required
                    >
                      <option value="06:00 AM - 07:30 AM">Morning: 6:00 AM - 7:30 AM</option>
                      <option value="07:30 AM - 09:00 AM">Morning: 7:30 AM - 9:00 AM</option>
                      <option value="09:00 AM - 10:30 AM">Late Morning: 9:00 AM - 10:30 AM</option>
                      <option value="05:00 PM - 06:30 PM">Evening: 5:00 PM - 6:30 PM</option>
                      <option value="06:30 PM - 08:00 PM">Evening: 6:30 PM - 8:00 PM</option>
                      <option value="08:00 PM - 09:30 PM">Night: 8:00 PM - 9:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    checked={inquiryConsent}
                    onChange={(e) => setInquiryConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-600 text-[#E5A93C] focus:ring-[#E5A93C] bg-[#141A28]"
                    required
                  />
                  <label htmlFor="consentCheck" className="text-[11px] text-slate-400 leading-snug">
                    I agree to allow Karnataka Gym to contact me via phone or WhatsApp regarding my walkthrough inquiry. We respect your privacy and never share your data.
                  </label>
                </div>

                {inquiryStatus === 'error' && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{inquiryMessage}</span>
                  </div>
                )}

                {inquiryStatus === 'success' && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{inquiryMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#E5A93C]/20 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Submit Walkthrough Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Website Footer */}
      <Footer />
    </div>
  );
}
