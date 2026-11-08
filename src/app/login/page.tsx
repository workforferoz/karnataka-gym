'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGym } from '@/lib/store';
import { Footer } from '@/components/Footer';
import { sanitizePhone, checkRateLimit } from '@/lib/security';
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  UserCheck,
  KeyRound,
  ArrowLeft,
  Lock,
  LayoutDashboard,
  Dumbbell,
  Award,
  LogIn
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get('role'); // 'member' | 'trainer' | 'owner'

  const { users, login } = useGym();

  const [activeTab, setActiveTab] = useState<'member' | 'trainer' | 'owner'>('member');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [matchedUser, setMatchedUser] = useState<typeof users[0] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync tab with URL parameter
  useEffect(() => {
    if (requestedRole === 'owner') {
      setActiveTab('owner');
    } else if (requestedRole === 'trainer') {
      setActiveTab('trainer');
    } else {
      setActiveTab('member');
    }
  }, [requestedRole]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Rate limiting check
    const rateCheck = checkRateLimit('login_otp', 5, 60000);
    if (!rateCheck.allowed) {
      setErrorMsg(`Too many lookup attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`);
      return;
    }

    const { sanitized } = sanitizePhone(phoneInput);
    if (!sanitized) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const found = users.find((u) => u.phone === sanitized || u.phone.includes(sanitized));

    if (found) {
      setMatchedUser(found);
      setOtpStep(true);
      setOtpCode('1234'); // auto-fill demo OTP
    } else {
      setErrorMsg('Mobile number not found in Karnataka Gym register. Please check the number or contact front desk (9902667407).');
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchedUser) {
      login(matchedUser.id);
      if (matchedUser.role === 'owner' || matchedUser.role === 'front_desk' || matchedUser.role === 'trainer') {
        router.push('/owner/dashboard');
      } else {
        router.push('/member/home');
      }
    }
  };

  const handleDirectSelect = (user: typeof users[0]) => {
    login(user.id);
    if (user.role === 'owner' || user.role === 'front_desk' || user.role === 'trainer') {
      router.push('/owner/dashboard');
    } else {
      router.push('/member/home');
    }
  };

  // Grouped users
  const trainerUsers = users.filter((u) => u.role === 'trainer');
  const ownerUsers = users.filter((u) => u.role === 'owner' || u.role === 'front_desk');

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100">
      {/* Top Website Return Bar */}
      <div className="bg-[#121622] border-b border-[#232B3E] px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-[#E5A93C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Karnataka Gym Website</span>
          </Link>
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Kalidas Nagar, Hubballi • Helpline: <a href="tel:9902667407" className="text-[#E5A93C] font-semibold">9902667407</a>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Top Branding Card */}
        <div className="text-center space-y-3">
          <div className="inline-block relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 drop-shadow-[0_4px_12px_rgba(229,169,60,0.35)]">
            <Image
              src="/karnataka-gym-badge.png"
              alt="Karnataka Gym Hubballi"
              width={64}
              height={64}
              className="object-contain w-full h-full rounded-full"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Karnataka Gym <span className="text-[#E5A93C]">Hubballi</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select your portal below: Member, Trainer, or Owner.
            </p>
          </div>
        </div>

        {/* 3-Role Toggle Tabs */}
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#121622] border border-[#232B3E]">
          {/* Member Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('member')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'member'
                ? 'bg-[#E5A93C] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Member</span>
          </button>

          {/* Trainer Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('trainer')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'trainer'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            <span>Trainer</span>
          </button>

          {/* Owner Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('owner')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'owner'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4 stroke-[2.5]" />
            <span>Owner</span>
          </button>
        </div>

        {/* TAB 1: MEMBER LOGIN */}
        {activeTab === 'member' && (
          <div className="max-w-md mx-auto space-y-6">
            {/* OTP Input Card */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="border-b border-[#232B3E] pb-3">
                <span className="text-xs font-bold text-white block">Member Authentication</span>
                <span className="text-[11px] text-slate-400">Enter your 10-digit registered mobile number</span>
              </div>

              {!otpStep ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                        +91
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2.5 pl-12 pr-4 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
                        maxLength={10}
                        required
                      />
                    </div>
                    {errorMsg && (
                      <p className="text-xs text-red-400 mt-1.5 font-medium">{errorMsg}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-extrabold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 transition-all cursor-pointer"
                  >
                    <span>Get OTP / Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpVerify} className="space-y-4">
                  <div className="bg-[#181F2F] p-3 rounded-xl border border-[#2C3852] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Logging in as:</span>
                      <span className="text-sm font-extrabold text-white">{matchedUser?.name}</span>
                      <span className="text-xs text-[#E5A93C] font-mono block">+91 {matchedUser?.phone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                      <span>Enter 4-Digit OTP</span>
                      <span className="text-[#E5A93C] text-[10px] font-normal">Demo OTP: 1234</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none text-center"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                    <span>Verify OTP & Enter Member Portal</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TRAINER LOGIN */}
        {activeTab === 'trainer' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-[#121622] border-2 border-emerald-800/60 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-600/30 text-emerald-400 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Trainer & Coach Portal</h2>
                  <p className="text-xs text-slate-400">Hubballi certified coaches: Vikram, Pooja & Rakesh</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                  Select Certified Trainer:
                </span>

                {trainerUsers.map((trainer) => (
                  <button
                    key={trainer.id}
                    onClick={() => handleDirectSelect(trainer)}
                    className="w-full p-4 rounded-xl bg-[#171D2B] border border-[#28354A] hover:border-emerald-500 text-left flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-700 text-emerald-300 font-black flex items-center justify-center text-sm">
                        {trainer.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-white block group-hover:text-emerald-400 transition-colors">
                          {trainer.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          +91 {trainer.phone} • Certified Floor Coach
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <span>Enter Desk</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-[11px] text-emerald-300 flex items-start gap-2">
                <Award className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  Trainers have full permissions to view active members, conduct assisted check-ins at reception, and assign diet charts.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OWNER & STAFF LOGIN */}
        {activeTab === 'owner' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-[#121622] border-2 border-red-900/60 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 text-red-500 flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Owner & Staff Cockpit</h2>
                  <p className="text-xs text-slate-400">Restricted administrative access for Karnataka Gym Hubballi</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                  Select Staff / Owner Account:
                </span>

                {ownerUsers.map((staffUser) => (
                  <button
                    key={staffUser.id}
                    onClick={() => handleDirectSelect(staffUser)}
                    className="w-full p-4 rounded-xl bg-[#171D2B] border border-[#28354A] hover:border-red-500 text-left flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800 text-red-300 font-black flex items-center justify-center text-sm">
                        {staffUser.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-white block group-hover:text-red-400 transition-colors">
                          {staffUser.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          +91 {staffUser.phone} • {staffUser.role === 'owner' ? 'Gym Owner' : 'Front Desk Officer'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-red-400">
                      <span>Enter Cockpit</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/50 text-[11px] text-red-300 flex items-start gap-2">
                <Lock className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>
                  Admin features include: 10-day silent churn recovery list, WhatsApp deep links, manual assisted check-in, and audit logging.
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0E14] flex items-center justify-center text-white">Loading Login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
