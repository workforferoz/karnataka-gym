'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { Footer } from '@/components/Footer';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { TestChecklistDrawer } from '@/components/TestChecklistDrawer';
import { InstagramIcon } from '@/components/InstagramIcon';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { sanitizeString, sanitizePhone } from '@/lib/security';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Lock,
  QrCode,
  Flame,
  Award,
  Zap,
  Dumbbell,
  Check,
  Calendar,
  AlertCircle,
  ExternalLink,
  Camera,
  Maximize2,
  X
} from 'lucide-react';

const FACILITY_PHOTOS = [
  {
    src: '/facility/gym-floor-wide.webp',
    title: 'Olympic Free Weights & Training Floor',
    tag: 'Free Weights & Olympic Benches',
    desc: 'Spacious training floor with commercial Olympic bench press stations, dumbbell line, shock-absorbing rubber matting, and dual cable towers.',
  },
  {
    src: '/facility/strength-cable-station.webp',
    title: 'Dual Cable Crossover & Arm Station',
    tag: 'Multi-Station Cable Towers',
    desc: 'Heavy-duty cable crossover system with multi-grip chin-up station, preacher curl bench, and anatomical muscle guides.',
  },
  {
    src: '/facility/leg-press-cardio.webp',
    title: 'Plate-Loaded Leg Press & Cardio Suite',
    tag: 'Leg Press, Pec Fly & Treadmill',
    desc: 'Commercial 45° plate-loaded leg press machine, selectorized pec fly station, and digital commercial treadmill for cardio conditioning.',
  },
  {
    src: '/facility/free-weights-mirrors.webp',
    title: 'Resistance Machine Line & Mirror Wall',
    tag: 'Resistance Equipment & Mirror Wall',
    desc: 'Full wall-to-wall mirror setup for posture and technique verification, paired with selectorized resistance machines and heavy-duty benches.',
  },
];

export default function PublicGymWebsite() {
  const [showTests, setShowTests] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof FACILITY_PHOTOS[0] | null>(null);

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

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryStatus('idle');

    if (!inquiryConsent) {
      setInquiryStatus('error');
      setInquiryMessage('Please agree to allow Karnataka Gym to contact you regarding your inquiry.');
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

    setInquiryStatus('success');
    setInquiryMessage(`Dhanyavad ${cleanName}! Your gym walkthrough has been confirmed for ${inquiryDate} (${inquiryTime}). Coach Vikram / front desk will contact you at +91 ${cleanPhone}.`);
    setInquiryName('');
    setInquiryPhone('');
    setInquiryDate('');
    setInquiryConsent(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 font-sans selection:bg-[#E5A93C] selection:text-slate-950">
      {/* Navigation Bar */}
      <PublicNav onOpenTests={() => setShowTests(true)} />

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      <main className="flex-1 space-y-20 pb-16">
        {/* 1. HERO SECTION */}
        <section className="relative pt-8 pb-14 px-4 border-b border-[#232B3E] overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
              {/* Left Column: Heading & Information */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                {/* Brand Logo & Location Flag */}
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 drop-shadow-[0_4px_16px_rgba(229,169,60,0.4)]">
                    <Image
                      src="/karnataka-gym-badge.png"
                      alt="Karnataka Gym Hubballi Badge"
                      width={56}
                      height={56}
                      className="object-contain w-full h-full rounded-full"
                      priority
                    />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black tracking-widest text-[#E5A93C] uppercase block">
                      Hubballi, Karnataka
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Kalidas Nagar • Established Strength Center
                    </span>
                  </div>
                </div>

                {/* Primary Hero Headline (High contrast, solid white and warm gold, NO gradient text, NO emojis) */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                  BUILD RAW STRENGTH AT <span className="text-[#E5A93C]">KARNATAKA GYM</span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Hubballi&apos;s home for serious lifters, functional athletes, and beginner fitness journeys. Heavy Olympic free weights, pin-loaded resistance machines, certified coaching, and transparent fees in Indian Rupees.
                </p>

                {/* Direct Action Gateways for Website Visitors */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                  <a
                    href="#location"
                    className="w-full sm:w-auto bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 stroke-[2.5]" />
                    <span>Schedule Gym Walkthrough</span>
                  </a>

                  <a
                    href="#facilities"
                    className="w-full sm:w-auto bg-[#161D2C] hover:bg-[#1E273A] border border-[#2D3950] text-slate-200 font-extrabold px-5 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Dumbbell className="w-4 h-4 text-[#E5A93C]" />
                    <span>Explore Facilities & Equipment</span>
                  </a>
                </div>

                {/* Clickable Quick Helpline Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs">
                  <a
                    href="tel:9902667407"
                    className="flex items-center gap-1.5 bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] px-3 py-1.5 rounded-lg text-slate-300 font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>Call 9902667407</span>
                  </a>

                  <a
                    href="https://wa.me/919902667407"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-[#121622] border border-[#232B3E] hover:border-emerald-500 px-3 py-1.5 rounded-lg text-emerald-400 font-bold transition-colors"
                  >
                    <span>WhatsApp Chat</span>
                  </a>

                  <a
                    href="https://www.instagram.com/riyaz_gokul/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-[#121622] border border-[#232B3E] hover:border-pink-500 px-3 py-1.5 rounded-lg text-pink-400 font-bold transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>@riyaz_gokul</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Hero Showcase Card */}
              <div className="w-full lg:w-96 flex-shrink-0">
                <div className="bg-[#121622] border-2 border-[#232B3E] rounded-3xl p-6 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between border-b border-[#232B3E] pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#E5A93C] block">
                        Gym Highlights
                      </span>
                      <span className="text-base font-extrabold text-white">Karnataka Gym Hubballi</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center">
                      <Award className="w-5 h-5 text-[#E5A93C]" />
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#171D2B] border border-[#252E42]">
                      <div className="w-7 h-7 rounded-lg bg-[#E5A93C] text-slate-950 font-black flex items-center justify-center text-xs flex-shrink-0">
                        15+
                      </div>
                      <div>
                        <span className="font-bold text-white block">Years of Legacy</span>
                        <span className="text-slate-400 text-[11px]">Serving the fitness community of Hubballi</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#171D2B] border border-[#252E42]">
                      <div className="w-7 h-7 rounded-lg bg-blue-500 text-slate-950 font-black flex items-center justify-center text-xs flex-shrink-0">
                        4K
                      </div>
                      <div>
                        <span className="font-bold text-white block">4,000 Sq.Ft Training Zone</span>
                        <span className="text-slate-400 text-[11px]">Olympic barbells, pin-loaded machines & cardio</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#171D2B] border border-[#252E42]">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs flex-shrink-0">
                        ₹
                      </div>
                      <div>
                        <span className="font-bold text-white block">100% Transparent Pricing</span>
                        <span className="text-slate-400 text-[11px]">No admission fee, no hidden taxes, starting ₹1,500</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#171D2B] border border-[#252E42]">
                      <div className="w-7 h-7 rounded-lg bg-purple-500 text-white font-black flex items-center justify-center text-xs flex-shrink-0">
                        QR
                      </div>
                      <div>
                        <span className="font-bold text-white block">Digital Member App</span>
                        <span className="text-slate-400 text-[11px]">Contactless QR check-in & daily streak tracking</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href="#facilities"
                      className="w-full bg-[#1A2234] hover:bg-[#222C42] border border-[#2D3950] text-[#E5A93C] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Explore Facilities & Equipment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ABOUT KARNATAKA GYM */}
        <section id="about" className="max-w-6xl mx-auto px-4 scroll-mt-20">
          <div className="rounded-3xl bg-[#121622] border border-[#232B3E] p-6 sm:p-10 space-y-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Authentic Strength Culture in Hubballi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-300 leading-relaxed">
              <div className="space-y-4">
                <p>
                  Founded with a dedication to hard work and real results, <strong>Karnataka Gym</strong> stands as Hubballi&apos;s premier destination for fitness enthusiasts, bodybuilders, and everyday people seeking genuine physical transformation.
                </p>
                <p>
                  Located centrally at Kalidas Nagar, Hubballi, our gym provides an atmosphere free from ego, gimmicks, or confusing sales pitches. Whether you are deadlifting 200 kg or stepping into a fitness club for the very first time, our coaches provide practical instruction tailored to your body mechanics.
                </p>
              </div>

              <div className="space-y-4">
                <p>
                  We believe fitness facilities must be transparent. In an industry known for hidden maintenance fees and confusing contracts, Karnataka Gym operates with clear pricing in Indian Rupees, respectful communication, and genuine personal attention.
                </p>
                <div className="p-4 rounded-2xl bg-[#171D2B] border border-[#263147] space-y-2">
                  <span className="text-xs font-extrabold text-[#E5A93C] uppercase tracking-wider block">
                    A Message From The Owner
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    &ldquo;Karnataka Gym was built to give Hubballi a place of discipline and health. We don&apos;t lock you into predatory subscriptions or push useless supplements. We teach you how to train properly, eat right, and stay consistent.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FACILITIES & EQUIPMENT ZONES (Structured 4-zone grid, NO 3-box row) */}
        <section id="facilities" className="max-w-6xl mx-auto px-4 scroll-mt-20 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Built for Heavy Work and Real Progress
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Commercial-grade steel, biomechanically sound resistance equipment, and clean training areas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Zone 1 */}
            <div className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Free Weights & Power Racks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full dumbbell rack from 2.5 kg to 50 kg, Olympic barbells, dedicated deadlift platform, squat cages, and adjustable benches.
              </p>
            </div>

            {/* Zone 2 */}
            <div className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Plate & Pin Resistance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Heavy leg press, hack squat, lat pulldowns, seated cable rows, pec fly, hamstring curls, and dual adjustable cable crossovers.
              </p>
            </div>

            {/* Zone 3 */}
            <div className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Cardio Conditioning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-grade commercial treadmills with shock absorption, cross-trainers, and spin cycles for cardiovascular endurance and fat loss.
              </p>
            </div>

            {/* Zone 4 */}
            <div className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Lockers & Nutrition</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clean member lockers, water dispensers, hygienic washrooms, and verified genuine whey protein and BCAA nutrition counter.
              </p>
            </div>
          </div>
        </section>

        {/* 4. FACILITY TOUR & REAL GYM PHOTOS */}
        <section id="facility-tour" className="max-w-6xl mx-auto px-4 scroll-mt-20 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232B3E] pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-xs font-bold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" />
                <span>Real Facility Photos • Hubballi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Inside Karnataka Gym Hubballi
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Explore our real training floor at Kalidas Nagar, Hubballi — commercial heavy-duty steel, Olympic free weights, multi-station cable towers, and cardio equipment.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121622] border border-[#232B3E]">
                <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span className="text-slate-200 font-bold">Kalidas Nagar, Hubballi</span>
              </div>
            </div>
          </div>

          {/* 4-Photo Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FACILITY_PHOTOS.map((photo, index) => (
              <div
                key={photo.src}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative bg-[#121622] border-2 border-[#232B3E] hover:border-[#E5A93C] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container with 16:10 aspect ratio */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A0D14]">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-black/30 pointer-events-none" />

                  {/* Tag top-left */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#0B0E14]/90 text-[#E5A93C] border border-[#E5A93C]/40 backdrop-blur-sm shadow-md">
                      {photo.tag}
                    </span>
                  </div>

                  {/* Expand Icon top-right */}
                  <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="w-8 h-8 rounded-full bg-black/75 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm shadow-md group-hover:border-[#E5A93C] group-hover:text-[#E5A93C] transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#E5A93C] transition-colors">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {photo.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#1F2637] flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Karnataka Gym • Ground Floor Facility</span>
                    <span className="text-[#E5A93C] font-bold group-hover:underline flex items-center gap-1">
                      <span>Enlarge Photo</span>
                      <Maximize2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox / Full-screen modal when photo is clicked */}
          {selectedPhoto && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedPhoto(null)}
            >
              <div
                className="relative max-w-4xl w-full bg-[#121622] border-2 border-[#232B3E] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#232B3E] bg-[#0F131D]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30">
                      {selectedPhoto.tag}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      {selectedPhoto.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-1.5 rounded-xl bg-[#1A2234] hover:bg-[#232E44] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close photo preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Image */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1000px"
                    className="object-contain"
                  />
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-[#0F131D] border-t border-[#232B3E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <p className="text-slate-300">
                    {selectedPhoto.desc}
                  </p>
                  <a
                    href="https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-1.5 text-[#E5A93C] font-bold hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Visit in Kalidas Nagar, Hubballi</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 5. LOCATION, TIMINGS & INQUIRY FORM */}
        <section id="location" className="max-w-6xl mx-auto px-4 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Location & Hours Details */}
            <div className="rounded-3xl bg-[#121622] border border-[#232B3E] p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Location & Operational Hours</h2>
              </div>

              {/* Address Box & Google Maps Link */}
              <div className="p-4 rounded-2xl bg-[#171D2B] border border-[#263147] space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E5A93C] flex-shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-extrabold text-white block text-sm">Karnataka Gym</span>
                    <p className="text-slate-200 font-semibold leading-relaxed">
                      Kalidas Nagar, Hubballi, Karnataka 580031
                    </p>
                    <span className="text-[#E5A93C] font-medium block text-[11px] pt-0.5">
                      Direct Facility Location • Hubballi
                    </span>
                  </div>
                </div>

                <a
                  href="https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#121622] hover:bg-[#1A202E] border border-[#354360] hover:border-[#E5A93C] text-[#E5A93C] font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm group cursor-pointer"
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
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#171D2B] border border-[#263147]">
                    <span className="font-bold text-white">Monday - Saturday</span>
                    <span className="text-[#E5A93C] font-mono font-bold">5:30 AM - 10:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#171D2B] border border-[#263147]">
                    <span className="font-bold text-white">Sunday</span>
                    <span className="text-amber-400 font-mono font-bold">6:00 AM - 1:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Contact Channels */}
              <div id="contact" className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Official Communication
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <a
                    href="tel:9902667407"
                    className="p-3 rounded-xl bg-[#171D2B] border border-[#263147] hover:border-[#E5A93C] flex items-center justify-center sm:justify-start gap-2.5 text-slate-200 font-bold transition-colors group cursor-pointer"
                    title="Call Karnataka Gym Helpline"
                  >
                    <Phone className="w-4 h-4 text-[#E5A93C] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span>Call 9902667407</span>
                  </a>

                  <a
                    href="https://wa.me/919902667407"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#171D2B] border border-[#263147] hover:border-emerald-500 flex items-center justify-center sm:justify-start gap-2.5 text-emerald-400 font-bold transition-colors group cursor-pointer"
                    title="Chat on WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Walk-in Inquiry Form */}
            <div className="rounded-3xl bg-[#121622] border border-[#232B3E] p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Schedule a Gym Walkthrough</h2>
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
                    className="w-full bg-[#171D2B] border border-[#263147] focus:border-[#E5A93C] rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
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
                      className="w-full bg-[#171D2B] border border-[#263147] focus:border-[#E5A93C] rounded-xl py-2.5 pl-11 pr-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Primary Fitness Goal
                  </label>
                  <select
                    value={inquiryGoal}
                    onChange={(e) => setInquiryGoal(e.target.value)}
                    className="w-full bg-[#171D2B] border border-[#263147] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                  >
                    <option value="general_fitness">General Health & Fitness</option>
                    <option value="strength_hypertrophy">Raw Strength & Muscle Building</option>
                    <option value="fat_loss">Weight Loss & Conditioning</option>
                    <option value="bodybuilding_prep">Competitive Bodybuilding</option>
                    <option value="pt_guidance">1-on-1 Personal Training</option>
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
                      className="w-full bg-[#171D2B] border border-[#263147] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
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
                      className="w-full bg-[#171D2B] border border-[#263147] focus:border-[#E5A93C] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
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
                    className="mt-0.5 w-4 h-4 rounded border-slate-600 text-[#E5A93C] focus:ring-[#E5A93C] bg-[#171D2B]"
                    required
                  />
                  <label htmlFor="consentCheck" className="text-[11px] text-slate-400 leading-snug">
                    I agree to allow Karnataka Gym to contact me via phone or WhatsApp regarding my inquiry. We never share your data.
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
                  className="w-full bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-[#E5A93C]/20 transition-all cursor-pointer"
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

      {/* Test Runner Drawer */}
      <TestChecklistDrawer isOpen={showTests} onClose={() => setShowTests(false)} />
    </div>
  );
}
