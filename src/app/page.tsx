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
  X,
  Sparkles,
  TrendingUp
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

const TRANSFORMATIONS = [
  {
    id: 'transformation-1',
    src: '/transformations/transformation-1-male-fatloss.webp',
    title: 'Fat Loss & Stamina Rebuild',
    badge: 'Weight Loss & Endurance',
    story: 'Shifted from long hours of sedentary routine to disciplined daily resistance workouts and a calorie-managed diet.',
    achievements: [
      'Substantial reduction in visceral fat',
      'Daily cardiovascular stamina improved',
      'Consistent strength training 5 days a week'
    ],
  },
  {
    id: 'transformation-2',
    src: '/transformations/transformation-2-female-toning.webp',
    title: 'Body Recomposition & Core Toning',
    badge: 'Fat Loss & Lean Muscle',
    story: 'Dedicated strength training focusing on core stability, compound lifts, and balanced nutrition without extreme starvation diets.',
    achievements: [
      'Inches lost across waist and hips',
      'Enhanced functional core strength',
      'Structured home-diet meal balance'
    ],
  },
  {
    id: 'transformation-3',
    src: '/transformations/transformation-3-lifestyle-fitness.webp',
    title: 'Lifestyle Fitness & Fat Loss',
    badge: 'Sustainable Weight Loss',
    story: 'Replaced fad diets with structured push-pull-legs training splits and regular cardio conditioning at Karnataka Gym.',
    achievements: [
      'Consistent fat loss over months',
      'Noticeable postural correction',
      'Increased energy throughout the day'
    ],
  },
  {
    id: 'transformation-4',
    src: '/transformations/transformation-4-core-conditioning.webp',
    title: 'Middle-Age Strength & Waistline Trim',
    badge: 'Trained Inside Karnataka Gym',
    story: 'Trained directly on the Karnataka Gym floor with barbell complexes, plate resistance, and coach-guided nutrition protocols.',
    achievements: [
      'Visible abdominal fat loss & tone',
      'Joint mobility & heavy compound strength',
      'Proven proof of work right in Hubballi'
    ],
  },
  {
    id: 'transformation-5',
    src: '/transformations/transformation-5-active-fitness.webp',
    title: 'Active Lifestyle & Core Slimming',
    badge: 'Weight Loss & Active Life',
    story: 'Shifted from long hours of sedentary desk work to consistent daily workouts, burning stubborn body fat while boosting cardiovascular fitness.',
    achievements: [
      'Visible waist & midsection trimming',
      'Consistent daily morning workout habit',
      'Enhanced endurance and daily energy'
    ],
  },
  {
    id: 'transformation-6',
    src: '/transformations/transformation-6-lifestyle-toning.webp',
    title: 'Postural Alignment & Waistline Tone',
    badge: 'Fat Loss & Posture',
    story: 'Replaced extreme food restriction with strength-based resistance training and structured, nutrient-dense home-cooked meals.',
    achievements: [
      'Inches reduced from waist and hips',
      'Improved shoulder and spinal posture',
      'Sustainable eating without starving'
    ],
  },
  {
    id: 'transformation-7',
    src: '/transformations/transformation-7-athletic-conditioning.webp',
    title: 'Athletic Conditioning & Leaning Out',
    badge: 'Athletic Recomposition',
    story: 'Committed to full-body resistance splits and HIIT cardio, transforming overall stamina and dropping body fat percentage steadily.',
    achievements: [
      'Full-body lean muscle toning',
      'Athletic agility and high energy levels',
      'Consistent 4-day gym training schedule'
    ],
  },
  {
    id: 'transformation-8',
    src: '/transformations/transformation-8-strength-recomposition.webp',
    title: 'Body Recomposition & Confidence',
    badge: 'Toning & Confidence',
    story: 'Combined progressive weight resistance with balanced daily protein intake, creating a fit, toned silhouette with renewed self-confidence.',
    achievements: [
      'Noticeable total body inch loss',
      'Increased upper and lower body strength',
      'Long-term sustainable lifestyle habits'
    ],
  },
];

const TRAINER_PHOTOS = [
  {
    id: 'trainer-photo-1',
    src: '/trainers/coach-riyaz-conditioning.webp',
    title: 'Peak Conditioning & Core Striations',
    tag: 'Discipline & Definition',
    desc: 'Elite core definition, serratus cuts, and competition-level conditioning built through years of disciplined, progressive weight training.',
  },
  {
    id: 'trainer-photo-2',
    src: '/trainers/coach-riyaz-side-chest.webp',
    title: 'Side Chest & Arm Hypertrophy',
    tag: 'Karnataka Gym Floor',
    desc: 'Classic bodybuilding side chest pose on the Karnataka Gym floor, showing chest fullness, shoulder striations, and tricep separation.',
  },
  {
    id: 'trainer-photo-3',
    src: '/trainers/coach-riyaz-dumbbells.webp',
    title: 'Olympic Dumbbell Bicep Training',
    tag: 'Free Weight Mastery',
    desc: 'Vascular dumbbell training on the main gym floor. Teaching members proper tempo, peak contraction, and zero-momentum form.',
  },
  {
    id: 'trainer-photo-4',
    src: '/trainers/coach-riyaz-most-muscular.webp',
    title: 'Most Muscular & Quadricep Power',
    tag: 'Competition-Ready Physique',
    desc: 'Front most muscular pose showcasing quad separation, abdominal vascularity, and thick traps forged with heavy compound training.',
  },
];

export default function PublicGymWebsite() {
  const [showTests, setShowTests] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof FACILITY_PHOTOS[0] | null>(null);
  const [selectedTransformation, setSelectedTransformation] = useState<typeof TRANSFORMATIONS[0] | null>(null);
  const [selectedTrainerPhoto, setSelectedTrainerPhoto] = useState<typeof TRAINER_PHOTOS[0] | null>(null);

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

      {/* App Install Banner */}
      <PWAInstallBanner />

      <main className="flex-1 space-y-20 pb-16">
        {/* 1. HERO SECTION */}
        <section className="relative pt-10 pb-16 px-4 overflow-hidden">
          {/* Watermark Background Logo with subtle golden aura */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <div className="relative w-[300px] h-[300px] sm:w-[440px] sm:h-[440px] lg:w-[520px] lg:h-[520px] opacity-15 sm:opacity-20 transition-opacity drop-shadow-[0_0_70px_rgba(229,169,60,0.3)]">
              <Image
                src="/karnataka-gym-logo.png"
                alt=""
                fill
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 440px, 520px"
                className="object-contain"
                priority
              />
            </div>
            {/* Subtle warm golden ambient glow behind the logo */}
            <div className="absolute w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] rounded-full bg-[#E5A93C]/10 blur-3xl pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            {/* Primary Hero Headline (High contrast, solid white and warm gold, NO gradient text, NO emojis) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              BUILD RAW STRENGTH AT <span className="text-[#E5A93C]">KARNATAKA GYM</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Hubballi&apos;s home for serious lifters, functional athletes, and beginner fitness journeys. Heavy Olympic free weights, pin-loaded resistance machines, certified coaching, and transparent fees in Indian Rupees.
            </p>

            {/* Direct Action Gateways for Website Visitors */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
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
                <span>Explore Facilities &amp; Equipment</span>
              </a>
            </div>

            {/* Clickable Quick Helpline Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] flex-shrink-0">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  Free Weights &amp; Power Racks
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full dumbbell rack from 2.5 kg to 50 kg, Olympic barbells, dedicated deadlift platform, squat cages, and adjustable benches.
              </p>
            </div>

            {/* Zone 2 */}
            <div className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  Plate &amp; Pin Resistance
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Heavy leg press, hack squat, lat pulldowns, seated cable rows, pec fly, hamstring curls, and dual adjustable cable crossovers.
              </p>
            </div>

            {/* Zone 3 */}
            <div className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  Cardio Conditioning
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-grade commercial treadmills with shock absorption, cross-trainers, and spin cycles for cardiovascular endurance and fat loss.
              </p>
            </div>

            {/* Zone 4 */}
            <div className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] transition-all space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                  Lockers &amp; Nutrition
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clean member lockers, water dispensers, hygienic washrooms, and verified genuine whey protein and BCAA nutrition counter.
              </p>
            </div>
          </div>
        </section>

        {/* 4. FACILITY TOUR & REAL GYM PHOTOS */}
        <section id="facility-tour" className="max-w-6xl mx-auto px-4 scroll-mt-20 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div className="space-y-2 max-w-2xl">
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

        {/* 4B. REAL MEMBER TRANSFORMATIONS */}
        <section id="transformations" className="max-w-6xl mx-auto px-4 scroll-mt-20 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Real Member Transformations
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                No extreme starvation. No synthetic shortcuts. Just honest coaching, progressive overload, and disciplined consistency at Karnataka Gym Hubballi.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121622] border border-[#232B3E]">
                <Award className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span className="text-slate-200 font-bold">100% Genuine Member Photos</span>
              </div>
            </div>
          </div>

          {/* 8 Transformations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRANSFORMATIONS.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedTransformation(item)}
                className="group relative bg-[#121622] border-2 border-[#232B3E] hover:border-[#E5A93C] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container with 1:1 Aspect Ratio */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#0A0D14]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-black/25 pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0B0E14]/90 text-[#E5A93C] border border-[#E5A93C]/40 backdrop-blur-sm shadow-md">
                      {item.badge}
                    </span>
                  </div>

                  {/* Before / After Floating Badges at Bottom */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-black/85 text-rose-300 border border-rose-500/30 backdrop-blur-sm">
                      Before
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#E5A93C] text-slate-950 font-black shadow-md">
                      After • Fit
                    </span>
                  </div>

                  {/* Expand icon top-right */}
                  <div className="absolute top-2.5 right-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="w-7 h-7 rounded-full bg-black/75 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm shadow-md group-hover:border-[#E5A93C] group-hover:text-[#E5A93C] transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-black text-white group-hover:text-[#E5A93C] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                      {item.story}
                    </p>
                  </div>

                  {/* Key Takeaways */}
                  <div className="pt-2.5 border-t border-[#1F2637] space-y-1">
                    {item.achievements.slice(0, 2).map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                        <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{ach}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#1F2637] flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Karnataka Gym</span>
                    <span className="text-[#E5A93C] font-bold group-hover:underline flex items-center gap-1">
                      <span>View</span>
                      <Maximize2 className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Motivation Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#171D2B] via-[#121622] to-[#171D2B] border border-[#2D3950] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="text-base font-black text-white flex items-center justify-center sm:justify-start gap-2">
                <Flame className="w-4 h-4 text-[#E5A93C]" />
                <span>Ready to Write Your Own Transformation Story?</span>
              </h4>
              <p className="text-xs text-slate-300 max-w-xl">
                Get individualized strength training guidance and sensible nutrition coaching. Visit Karnataka Gym in Kalidas Nagar, Hubballi today.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <a
                href="#location"
                className="bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Book Gym Walkthrough
              </a>
              <a
                href="https://wa.me/919902667407?text=Hi%20Karnataka%20Gym%2C%20I%20saw%20your%20member%20transformations%20and%20want%20to%20know%20more."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A2234] hover:bg-[#232E44] border border-emerald-600/40 text-emerald-400 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Transformation Modal Lightbox */}
          {selectedTransformation && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedTransformation(null)}
            >
              <div
                className="relative max-w-2xl w-full bg-[#121622] border-2 border-[#232B3E] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#232B3E] bg-[#0F131D]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30">
                      {selectedTransformation.badge}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      {selectedTransformation.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedTransformation(null)}
                    className="p-1.5 rounded-xl bg-[#1A2234] hover:bg-[#232E44] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close transformation preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Image */}
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
                      After • Transformed
                    </span>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-5 bg-[#0F131D] border-t border-[#232B3E] space-y-3 overflow-y-auto">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedTransformation.story}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {selectedTransformation.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#232B3E] flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      Kalidas Nagar, Hubballi
                    </span>
                    <a
                      href="https://wa.me/919902667407?text=Hi%20Karnataka%20Gym%2C%20I%20want%20to%20start%20my%20fitness%20transformation."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Inquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 4C. HEAD COACH & TRAINERS */}
        <section id="trainer" className="max-w-6xl mx-auto px-4 scroll-mt-20 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Lead By Example: Meet Head Coach Riyaz
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                At Karnataka Gym, we don&apos;t preach theories from a desk. Train directly under competition-proven bodybuilding discipline, biomechanically sound lifting mechanics, and authentic Indian diet planning.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
              <a
                href="https://www.instagram.com/riyaz_gokul/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121622] border border-[#232B3E] hover:border-pink-500/50 text-slate-200 hover:text-pink-400 transition-colors group cursor-pointer"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold">@riyaz_gokul</span>
              </a>
            </div>
          </div>

          {/* Coach Highlights Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-1">
              <span className="text-base sm:text-lg font-black text-[#E5A93C] block">15+ Years</span>
              <span className="text-[11px] text-slate-300 font-bold block leading-tight">Coaching Experience</span>
              <span className="text-[10px] text-slate-500 block">Training Hubballi since 2011</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-1">
              <span className="text-base sm:text-lg font-black text-emerald-400 block">Form First</span>
              <span className="text-[11px] text-slate-300 font-bold block leading-tight">Zero-Injury Biomechanics</span>
              <span className="text-[10px] text-slate-500 block">Safe compound overload</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-1">
              <span className="text-base sm:text-lg font-black text-blue-400 block">Real Nutrition</span>
              <span className="text-[11px] text-slate-300 font-bold block leading-tight">Indian Home Meal Plans</span>
              <span className="text-[10px] text-slate-500 block">Roti, dal, eggs &amp; paneer</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-1">
              <span className="text-base sm:text-lg font-black text-purple-400 block">Daily Access</span>
              <span className="text-[11px] text-slate-300 font-bold block leading-tight">Floor Accountability</span>
              <span className="text-[10px] text-slate-500 block">Direct supervision daily</span>
            </div>
          </div>

          {/* 4 Trainer Photo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRAINER_PHOTOS.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedTrainerPhoto(photo)}
                className="group relative bg-[#121622] border-2 border-[#232B3E] hover:border-[#E5A93C] rounded-3xl overflow-hidden shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Container with 4:5 aspect ratio */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0A0D14]">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-black/30 pointer-events-none" />

                  {/* Top Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0B0E14]/90 text-[#E5A93C] border border-[#E5A93C]/40 backdrop-blur-sm shadow-md">
                      {photo.tag}
                    </span>
                  </div>

                  {/* Expand icon top-right */}
                  <div className="absolute top-2.5 right-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="w-7 h-7 rounded-full bg-black/75 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm shadow-md group-hover:border-[#E5A93C] group-hover:text-[#E5A93C] transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-sm font-black text-white group-hover:text-[#E5A93C] transition-colors leading-snug">
                      {photo.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {photo.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#1F2637] flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Head Coach Riyaz</span>
                    <span className="text-[#E5A93C] font-bold group-hover:underline flex items-center gap-1">
                      <span>Enlarge</span>
                      <Maximize2 className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trainer Consultation CTA Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[#171D2B] via-[#121622] to-[#171D2B] border border-[#2D3950] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="text-base font-black text-white flex items-center justify-center sm:justify-start gap-2">
                <Award className="w-4 h-4 text-[#E5A93C]" />
                <span>Want 1-on-1 Guidance from Head Coach Riyaz?</span>
              </h4>
              <p className="text-xs text-slate-300 max-w-xl">
                Whether you need beginner form instruction, competition prep, or targeted fat loss, Coach Riyaz provides direct personal coaching at Kalidas Nagar.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <a
                href="https://wa.me/919902667407?text=Hi%20Coach%20Riyaz%2C%20I%20want%20to%20discuss%20training%20at%20Karnataka%20Gym."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors inline-flex items-center gap-1.5 shadow-md"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Chat with Coach</span>
              </a>
              <a
                href="#location"
                className="bg-[#1A2234] hover:bg-[#232E44] border border-[#374561] text-[#E5A93C] font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                Visit Gym Floor
              </a>
            </div>
          </div>

          {/* Trainer Modal Lightbox */}
          {selectedTrainerPhoto && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedTrainerPhoto(null)}
            >
              <div
                className="relative max-w-2xl w-full bg-[#121622] border-2 border-[#232B3E] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#232B3E] bg-[#0F131D]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30">
                      {selectedTrainerPhoto.tag}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      {selectedTrainerPhoto.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => setSelectedTrainerPhoto(null)}
                    className="p-1.5 rounded-xl bg-[#1A2234] hover:bg-[#232E44] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close trainer preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Image */}
                <div className="relative aspect-[4/5] w-full bg-black max-h-[60vh]">
                  <Image
                    src={selectedTrainerPhoto.src}
                    alt={selectedTrainerPhoto.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-contain"
                  />
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-[#0F131D] border-t border-[#232B3E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <p className="text-slate-300">
                    {selectedTrainerPhoto.desc}
                  </p>
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
