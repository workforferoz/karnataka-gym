'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PublicNav } from '@/components/PublicNav';
import { Footer } from '@/components/Footer';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { InstagramIcon } from '@/components/InstagramIcon';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { sanitizeString, sanitizePhone, checkRateLimit } from '@/lib/sanitize';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Dumbbell,
  Calendar,
  AlertCircle,
  ExternalLink,
  Camera,
  X,
  Sparkles,
  Check
} from 'lucide-react';

const FACILITY_PHOTOS = [
  {
    src: '/facility/gym-floor-wide.webp',
    title: 'Olympic Free Weights & Training Floor',
    tag: 'Free Weights & Olympic Benches',
    specs: 'Commercial Olympic benches • 50kg+ Dumbbell line • Shock-absorbing rubber floor',
    desc: 'Spacious training floor with commercial Olympic bench press stations, heavy dumbbell rack, shock-absorbing rubber matting, and dual cable towers.',
  },
  {
    src: '/facility/strength-cable-station.webp',
    title: 'Dual Cable Crossover & Arm Station',
    tag: 'Multi-Station Cable Towers',
    specs: 'Dual 100kg weight stacks • Multi-grip pull-up bar • Preacher curl bench',
    desc: 'Heavy-duty cable crossover system with multi-grip chin-up station, preacher curl bench, and anatomical muscle guides for joint-safe resistance.',
  },
  {
    src: '/facility/leg-press-cardio.webp',
    title: 'Plate-Loaded Leg Press & Cardio Suite',
    tag: 'Leg Press, Pec Fly & Treadmill',
    specs: '45° Linear bearing leg press • Selectorized pec fly • Commercial cardio',
    desc: 'Commercial 45° plate-loaded leg press machine, selectorized pec fly station, and digital commercial treadmill for cardio conditioning.',
  },
  {
    src: '/facility/free-weights-mirrors.webp',
    title: 'Resistance Machine Line & Mirror Wall',
    tag: 'Resistance Equipment & Mirror Wall',
    specs: 'Full-span posture mirrors • Selectorized pin stacks • Heavy adjustable benches',
    desc: 'Full wall-to-wall mirror setup for posture and technique verification, paired with selectorized resistance machines and heavy-duty benches.',
  },
];

const TRANSFORMATIONS = [
  {
    id: 'transformation-1',
    src: '/transformations/transformation-1-male-fatloss.webp',
    title: 'Fat Loss & Stamina Rebuild',
    badge: '18kg Fat Loss • 20 Weeks',
    story: 'Shifted from long hours of sedentary routine to disciplined daily resistance workouts and a calorie-managed diet under Coach Riyaz.',
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
    badge: 'Lean Muscle & Toning • 16 Weeks',
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
    badge: 'Sustainable Fitness • 24 Weeks',
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
    badge: 'Trained at Karnataka Gym • 18 Weeks',
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
    badge: 'Weight Loss & Energy • 14 Weeks',
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
    badge: 'Postural Correction • 16 Weeks',
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
    badge: 'Athletic Conditioning • 20 Weeks',
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
    badge: 'Strength & Confidence • 22 Weeks',
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

const PRICING_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: '₹1,500',
    duration: '1 Month',
    perMonth: '₹1,500 / month',
    badge: null,
    highlight: false,
    description: 'Ideal for beginners and short-term fitness goals without long commitments.',
    features: [
      'Full gym floor & free weights access',
      'Selectorized pin-loaded resistance machines',
      'Cardio suite (treadmill & conditioning equipment)',
      'Clean locker & changing facilities',
      'General workout & form guidance',
      'Zero admission or registration fee'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly Plan',
    price: '₹4,000',
    duration: '3 Months',
    perMonth: '₹1,333 / month',
    badge: 'Most Popular',
    highlight: true,
    description: 'The proven sweet spot to build habit consistency and visible physical changes.',
    features: [
      'Save ₹500 compared to monthly rate',
      'Full gym floor & Olympic equipment access',
      'All selectorized resistance stations included',
      'Cardio suite & locker access',
      'Personalized split routine consultation',
      'Zero admission fee • No hidden charges'
    ]
  },
  {
    id: 'half_yearly',
    name: 'Half-Yearly Plan',
    price: '₹7,500',
    duration: '6 Months',
    perMonth: '₹1,250 / month',
    badge: 'Great Value',
    highlight: false,
    description: 'Complete body recomposition window for dedicated lifters and fitness athletes.',
    features: [
      'Save ₹1,500 over monthly rates',
      'Includes 15-day membership freeze option',
      'Full unrestricted gym floor access',
      'All heavy Olympic free weights (up to 50kg+)',
      'Cardio suite & locker facility included',
      'Progress check-ins & form reviews'
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    price: '₹12,000',
    duration: '12 Months',
    perMonth: '₹1,000 / month',
    badge: 'Best Value',
    highlight: false,
    description: 'Our most economical plan for a lifetime fitness commitment in Hubballi.',
    features: [
      'Save ₹6,000 annually (effectively ₹1,000/mo)',
      'Includes 30-day membership pause option',
      'Unrestricted year-round facility access',
      'Full Olympic barbells, cages & cable towers',
      'Free lock & locker room facility',
      'Highest long-term transformation rate'
    ]
  }
];

export default function PublicGymWebsite() {
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
            {/* Live Operational Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131826] border border-[#232D42] text-xs font-semibold text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Facility Open Today • Hubballi Floor Active (5:30 AM - 10:00 PM)</span>
            </div>

            {/* Primary Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight uppercase">
              BUILD RAW STRENGTH.<br />
              <span className="text-[#E5A93C]">KARNATAKA GYM</span> HUBBALLI
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Hubballi&apos;s home for serious lifters, functional athletes, and beginner fitness journeys since 2011. Heavy Olympic iron, pin-loaded resistance machines, and certified coaching under Coach Riyaz at Kalidas Nagar.
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
                href="tel:9902667407"
                className="flex items-center gap-1.5 bg-[#121724] border border-[#242F46] hover:border-[#E5A93C] px-3.5 py-2 rounded-xl text-slate-300 font-bold transition-colors"
                title="Call Karnataka Gym"
              >
                <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Call 9902667407</span>
              </a>

              <a
                href="https://wa.me/919902667407"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#121724] border border-[#242F46] hover:border-emerald-500 px-3.5 py-2 rounded-xl text-emerald-400 font-bold transition-colors"
                title="Chat with Gym on WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Chat</span>
              </a>

              <a
                href="https://www.instagram.com/riyaz_gokul/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#121724] border border-[#242F46] hover:border-pink-500 px-3.5 py-2 rounded-xl text-pink-400 font-bold transition-colors"
                title="Visit Coach Riyaz Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@riyaz_gokul</span>
              </a>
            </div>

            {/* Metric / Trust Pillars Horizontal Ticker */}
            <div className="pt-8 border-t border-[#1C2538] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#0F1420] border border-[#1E273A]">
                <span className="text-2xl sm:text-3xl font-black text-white block">14+ Years</span>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase mt-1 block">
                  Hubballi Legacy (Est. 2011)
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0F1420] border border-[#1E273A]">
                <span className="text-2xl sm:text-3xl font-black text-[#E5A93C] block">50kg+</span>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase mt-1 block">
                  Olympic Free Weights Rack
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0F1420] border border-[#1E273A]">
                <span className="text-2xl sm:text-3xl font-black text-white block">100% Real</span>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase mt-1 block">
                  Local Member Results
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0F1420] border border-[#1E273A]">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">₹0 Hidden</span>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase mt-1 block">
                  Zero Admission Surcharge
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ABOUT KARNATAKA GYM (ARCHITECTURAL PILLARS) */}
        <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="rounded-3xl bg-[#0F1420] border border-[#1E273A] p-6 sm:p-10 space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">
                Our Training Heritage
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Authentic Strength Culture in Hubballi
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Founded with a commitment to pure hard work and measurable physical results, <strong>Karnataka Gym</strong> is Hubballi&apos;s trusted strength institution. Centrally situated at Kalidas Nagar, our facility is engineered for serious lifters, working professionals, and beginners looking for practical fitness without ego or gimmicks.
              </p>
            </div>

            {/* 4 Architectural Pillar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] flex items-center justify-center font-black">
                    01
                  </span>
                  <h3 className="text-sm font-black text-white">Heavy Olympic Free Weights</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Commercial Olympic flat, incline, and decline bench presses, heavy squat stations, and a complete line of precision cast-iron dumbbells up to 50kg for progressive overload.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] flex items-center justify-center font-black">
                    02
                  </span>
                  <h3 className="text-sm font-black text-white">Biomechanical Pin-Loaded Machines</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Selectorized cable crossovers, 45° linear incline leg presses, pec fly machines, and lat pulldowns engineered for peak contraction with natural joint paths.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] flex items-center justify-center font-black">
                    03
                  </span>
                  <h3 className="text-sm font-black text-white">Coaching Under Coach Riyaz</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Learn directly from 14+ years of competitive bodybuilding discipline. Form verification, injury prevention, and customized training splits tailored to your structure.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] flex items-center justify-center font-black">
                    04
                  </span>
                  <h3 className="text-sm font-black text-white">Real Indian Diet & Nutrition Guidance</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  No extreme starvation protocols or forced supplement packages. Practical nutrition frameworks built around real Indian home-cooked meals (dal, eggs, paneer, chicken, rice).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FACILITIES & EQUIPMENT SHOWCASE */}
        <section id="facilities" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">
                Facility Tour
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Built for Heavy, Uncompromised Training
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Inspect our real equipment floor in Hubballi. Commercial-grade steel, biomechanically sound resistance machines, and clean training stations.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F1420] border border-[#1E273A] text-xs font-bold text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Kalidas Nagar Facility Floor</span>
            </div>
          </div>

          {/* 4-Photo Showcase Grid */}
          <div id="facility-tour" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-20">
            {FACILITY_PHOTOS.map((photo, index) => (
              <div
                key={photo.src}
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
                  <div className="pt-2 border-t border-[#1C2538] flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold">{photo.specs}</span>
                    <span className="text-[#E5A93C] font-bold">View Photo</span>
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
            <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">
              Social Proof & Results
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Real Hubballi Transformations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Zero fake fitness models or generic stock images. These are everyday members who put in the daily sweat at Karnataka Gym under disciplined guidance.
            </p>
          </div>

          {/* 8-Item Transformation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRANSFORMATIONS.map((item) => (
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
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-[#E5A93C] block uppercase tracking-wider">
                      {item.badge}
                    </span>
                    <h3 className="text-sm font-black text-white group-hover:text-[#E5A93C] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {item.story}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1C2538] space-y-1">
                    {item.achievements.slice(0, 2).map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-300">
                        <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{ach}</span>
                      </div>
                    ))}
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

                <div className="p-5 bg-[#0A0D14] border-t border-[#1E273A] space-y-3">
                  <h4 className="text-base font-black text-white">{selectedTransformation.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedTransformation.story}</p>
                  <div className="pt-2 space-y-1.5">
                    {selectedTransformation.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
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
                <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">
                  Certified Mentorship
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Train Under Head Coach Riyaz
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  At Karnataka Gym, we don&apos;t preach theories from a desk. Train directly under competition-proven bodybuilding discipline, biomechanically sound lifting mechanics, and authentic Indian diet planning.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href="https://www.instagram.com/riyaz_gokul/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#141A28] border border-[#242F46] hover:border-pink-500 text-pink-400 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
                  title="Follow Coach Riyaz on Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>@riyaz_gokul</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* 4 Coach Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TRAINER_PHOTOS.map((photo) => (
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
            <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Honest Plans. No Hidden Surcharges.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Published fees in Indian Rupees. Zero admission charges, zero locker maintenance deposits, and direct facility access.
            </p>
          </div>

          {/* 4-Tier Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => (
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
                    <span className="font-bold text-white">Monday - Saturday</span>
                    <span className="text-[#E5A93C] font-mono font-bold">5:30 AM - 10:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#141A28] border border-[#242F46]">
                    <span className="font-bold text-white">Sunday</span>
                    <span className="text-amber-400 font-mono font-bold">6:00 AM - 1:00 PM</span>
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
                    href="tel:9902667407"
                    className="p-3 rounded-xl bg-[#141A28] border border-[#242F46] hover:border-[#E5A93C] flex items-center justify-center sm:justify-start gap-2.5 text-slate-200 font-bold transition-colors group cursor-pointer"
                    title="Call Karnataka Gym Helpline"
                  >
                    <Phone className="w-4 h-4 text-[#E5A93C] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span>Call 9902667407</span>
                  </a>

                  <a
                    href="https://wa.me/919902667407"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#141A28] border border-[#242F46] hover:border-emerald-500 flex items-center justify-center sm:justify-start gap-2.5 text-emerald-400 font-bold transition-colors group cursor-pointer"
                    title="Chat on WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span>WhatsApp Chat</span>
                  </a>

                  <a
                    href="mailto:karnatakagymhubli@gmail.com"
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
                <span className="text-xs font-black uppercase tracking-widest text-[#E5A93C]">
                  Free Walkthrough
                </span>
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
