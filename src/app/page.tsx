'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { Footer } from '@/components/Footer';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { TestChecklistDrawer } from '@/components/TestChecklistDrawer';
import { InstagramIcon } from '@/components/InstagramIcon';
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
  AlertCircle
} from 'lucide-react';

export default function PublicGymWebsite() {
  const [showTests, setShowTests] = useState(false);

  // Inquiry form states
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryGoal, setInquiryGoal] = useState('general_fitness');
  const [inquiryConsent, setInquiryConsent] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [inquiryMessage, setInquiryMessage] = useState('');

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

    setInquiryStatus('success');
    setInquiryMessage(`Dhanyavad ${cleanName}! Your inquiry has been registered. Coach Vikram / front desk will call you at +91 ${cleanPhone}.`);
    setInquiryName('');
    setInquiryPhone('');
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
                  <div className="relative w-14 h-14 flex-shrink-0 drop-shadow-[0_4px_16px_rgba(229,169,60,0.4)]">
                    <Image
                      src="/karnataka-gym-logo.png"
                      alt="Karnataka Gym Hubballi Badge"
                      width={56}
                      height={56}
                      className="object-contain w-full h-full"
                      priority
                    />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black tracking-widest text-[#E5A93C] uppercase block">
                      Hubballi, Karnataka
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Station Road • Established Strength Center
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

                {/* Direct Action Gateways */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                  <Link
                    href="/login?role=member"
                    className="w-full sm:w-auto bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 transition-all cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Member Login (Open App)</span>
                  </Link>

                  <Link
                    href="/login?role=owner"
                    className="w-full sm:w-auto bg-[#161D2C] hover:bg-[#1E273A] border border-[#2D3950] text-slate-200 font-extrabold px-5 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-red-400" />
                    <span>Owner Cockpit</span>
                  </Link>

                  <a
                    href="#plans"
                    className="w-full sm:w-auto text-slate-400 hover:text-white font-bold px-4 py-3 text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Plans (₹)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
                        <span className="font-bold text-white block">Digital Retention PWA</span>
                        <span className="text-slate-400 text-[11px]">Contactless QR check-in & daily streak tracking</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/login?role=member"
                      className="w-full bg-[#1A2234] hover:bg-[#222C42] border border-[#2D3950] text-[#E5A93C] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Member Access Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
              <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C] block mb-1">
                About The Gym
              </span>
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
                  Located centrally on Station Road near the Old Bus Stand, our gym provides an atmosphere free from ego, gimmicks, or confusing sales pitches. Whether you are deadlifting 200 kg or stepping into a fitness club for the very first time, our coaches provide practical instruction tailored to your body mechanics.
                </p>
              </div>

              <div className="space-y-4">
                <p>
                  We believe fitness facilities must be transparent. In an industry known for hidden maintenance fees and confusing contracts, Karnataka Gym operates with clear pricing in Indian Rupees, respectful communication, and genuine personal attention.
                </p>
                <div className="p-4 rounded-2xl bg-[#171D2B] border border-[#263147] space-y-2">
                  <span className="text-xs font-extrabold text-[#E5A93C] uppercase tracking-wider block">
                    A Message From Manjunath (Owner)
                  </span>
                  <p className="text-xs italic text-slate-200">
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
            <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C] block">
              Equipment & Training Zones
            </span>
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

        {/* 4. TRANSPARENT MEMBERSHIP PLANS (₹ INR, strictly honest, NO hidden fees) */}
        <section id="plans" className="max-w-6xl mx-auto px-4 scroll-mt-20 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C] block">
              Transparent Membership Fees
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Direct Pricing. No Admission Fees.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              All prices in Indian Rupees (₹). Exactly what you see is what you pay.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Monthly */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                  Monthly Plan
                </span>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">₹1,500</span>
                    <span className="text-xs text-slate-400">/ 1 month</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Flexible, no long-term contract</span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#1F2739] text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>Full gym floor access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>Cardio suite included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>Locker access & drinking water</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>PWA digital check-in pass</span>
                  </div>
                </div>
              </div>

              <Link
                href="/login?role=member"
                className="w-full bg-[#1A2234] hover:bg-[#232D44] border border-[#2D3950] text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Join / Member Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quarterly (3 Months) */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                    Quarterly
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300">
                    Save ₹500
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">₹4,000</span>
                    <span className="text-xs text-slate-400">/ 3 months</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">₹1,333 / month equivalent</span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#1F2739] text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>All Monthly plan features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>Custom workout split guideline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>Baseline fitness evaluation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>Streak tracking & badges</span>
                  </div>
                </div>
              </div>

              <Link
                href="/login?role=member"
                className="w-full bg-[#1A2234] hover:bg-[#232D44] border border-[#2D3950] text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Join / Member Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Half-Yearly (6 Months) - Highlighted */}
            <div className="bg-[#121622] border-2 border-[#E5A93C] rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#E5A93C] uppercase tracking-wider block">
                    Half-Yearly
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E5A93C] text-slate-950">
                    Save ₹1,500
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">₹7,500</span>
                    <span className="text-xs text-slate-400">/ 6 months</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">₹1,250 / month equivalent</span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#1F2739] text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>All Quarterly plan features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>1 Complimentary Diet Consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>15-Day freeze option for exams/travel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>Automated renewal discount alerts</span>
                  </div>
                </div>
              </div>

              <Link
                href="/login?role=member"
                className="w-full bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#E5A93C]/20"
              >
                <span>Join / Member Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Yearly (12 Months) */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                    Annual / 1 Year
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300">
                    Save ₹6,000
                  </span>
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">₹12,000</span>
                    <span className="text-xs text-slate-400">/ 12 months</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">₹1,000 / month equivalent</span>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-[#1F2739] text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>Best overall value package</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>1 Free 1-on-1 Personal Training session</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>30-Day membership freeze allowance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#E5A93C] flex-shrink-0" />
                    <span>Priority locker allotment</span>
                  </div>
                </div>
              </div>

              <Link
                href="/login?role=member"
                className="w-full bg-[#1A2234] hover:bg-[#232D44] border border-[#2D3950] text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Join / Member Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] text-center text-xs text-slate-400 max-w-2xl mx-auto">
            Payment modes accepted at front desk: UPI, Cash, Debit/Credit Cards. Zero processing surcharge.
          </div>
        </section>

        {/* 5. CERTIFIED COACHES & TRAINERS */}
        <section id="trainers" className="max-w-6xl mx-auto px-4 scroll-mt-20 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C] block">
              Certified Coaching Staff
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Guidance from Experienced Lifters
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Our floor coaches correct your lifting posture, prevent injury, and program progressive overload.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trainer 1 */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-3xl p-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1A2234] border border-[#2B354C] text-[#E5A93C] font-black text-xl flex items-center justify-center">
                VP
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Coach Vikram Patil</h3>
                <span className="text-xs text-[#E5A93C] font-semibold block">Senior Strength & Conditioning Specialist</span>
                <span className="text-[11px] text-slate-400">8+ Years Experience • Powerlifting</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Specializes in barbell squat, bench press, deadlift biomechanics, and strength periodization for lifters of all ages.
              </p>
            </div>

            {/* Trainer 2 */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-3xl p-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1A2234] border border-[#2B354C] text-pink-400 font-black text-xl flex items-center justify-center">
                PK
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Coach Pooja Kulkarni</h3>
                <span className="text-xs text-pink-400 font-semibold block">Functional Fitness & Female Transformation</span>
                <span className="text-[11px] text-slate-400">5+ Years Experience • Nutrition Consultant</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Expert in mobility, sustainable weight management, postpartum conditioning, and Indian dietary structuring.
              </p>
            </div>

            {/* Trainer 3 */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-3xl p-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#1A2234] border border-[#2B354C] text-emerald-400 font-black text-xl flex items-center justify-center">
                RN
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Coach Rakesh Naik</h3>
                <span className="text-xs text-emerald-400 font-semibold block">Hypertrophy & Contest Preparation</span>
                <span className="text-[11px] text-slate-400">7+ Years Experience • Bodybuilding</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Focuses on muscular hypertrophy, muscle isolation, peak contest conditioning, and strict form discipline.
              </p>
            </div>
          </div>
        </section>

        {/* 6. DIGITAL PWA EXPERIENCE (Why Karnataka Gym has an App) */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl bg-[#121622] border-2 border-[#232B3E] p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
              <div className="space-y-4 max-w-xl">
                <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C] block">
                  Modern Retention Technology
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  The Karnataka Gym Member PWA
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Every active member receives direct access to our mobile-first application. No paperwork, no lost cards. Check in via contactless QR code, track workout streaks, and receive automated reminders before expiry.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#171D2B] border border-[#252E42]">
                    <span className="font-bold text-white block">Contactless QR</span>
                    <span className="text-[11px] text-slate-400">Instant scan at front desk</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#171D2B] border border-[#252E42]">
                    <span className="font-bold text-white block">Daily Streak Pass</span>
                    <span className="text-[11px] text-slate-400">Keep discipline consistent</span>
                  </div>
                </div>
              </div>

              {/* Dual Action Gateway Card */}
              <div className="w-full lg:w-80 bg-[#171D2B] border border-[#2B354C] rounded-2xl p-5 space-y-3 flex-shrink-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  Select Portal to Enter
                </span>

                <Link
                  href="/login?role=member"
                  className="w-full bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-between shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Member Login</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/login?role=owner"
                  className="w-full bg-[#1F2738] hover:bg-red-950/60 border border-red-800/80 text-red-200 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-red-400" />
                    <span>Owner Cockpit</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="text-[10px] text-slate-400 text-center pt-1">
                  Works on iOS, Android, and desktop browsers as a Progressive Web App.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. LOCATION, TIMINGS & INQUIRY FORM */}
        <section id="location" className="max-w-6xl mx-auto px-4 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Location & Hours Details */}
            <div className="rounded-3xl bg-[#121622] border border-[#232B3E] p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C] block mb-1">
                  Visit Us in Hubballi
                </span>
                <h2 className="text-2xl font-black text-white">Location & Operational Hours</h2>
              </div>

              {/* Address Box */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#171D2B] border border-[#263147]">
                <MapPin className="w-5 h-5 text-[#E5A93C] flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-extrabold text-white block text-sm">Karnataka Gym</span>
                  <p className="text-slate-300 leading-relaxed">
                    Station Road, Near Old Bus Stand, Hubballi, Karnataka - 580020
                  </p>
                  <span className="text-[#E5A93C] font-semibold block text-[11px] pt-1">
                    Landmark: Central Hubballi Commercial Belt
                  </span>
                </div>
              </div>

              {/* Timings Table */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#E5A93C]" />
                  Training Hours
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#171D2B] border border-[#263147]">
                    <span className="font-bold text-white">Monday &ndash; Saturday</span>
                    <span className="text-[#E5A93C] font-mono font-bold">5:30 AM &ndash; 10:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#171D2B] border border-[#263147]">
                    <span className="font-bold text-white">Sunday</span>
                    <span className="text-amber-400 font-mono font-bold">6:00 AM &ndash; 1:00 PM</span>
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
                    className="p-3 rounded-xl bg-[#171D2B] border border-[#263147] hover:border-[#E5A93C] flex items-center gap-2 text-slate-200 font-bold transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#E5A93C]" />
                    <span>9902667407</span>
                  </a>

                  <a
                    href="mailto:karnatakagymhubli@gmail.com"
                    className="p-3 rounded-xl bg-[#171D2B] border border-[#263147] hover:border-[#E5A93C] flex items-center gap-2 text-slate-200 font-bold transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#E5A93C]" />
                    <span className="truncate">Email Us</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Walk-in Inquiry Form */}
            <div className="rounded-3xl bg-[#121622] border border-[#232B3E] p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C] block mb-1">
                  Connect With Us
                </span>
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
