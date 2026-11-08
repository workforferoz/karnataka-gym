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
  LogIn,
  Eye,
  EyeOff,
  ShieldAlert
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

  // Owner authentication credentials
  const [ownerPhone, setOwnerPhone] = useState('9902667407');
  const [ownerPin, setOwnerPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [ownerError, setOwnerError] = useState('');

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

    const found =
      users.find((u) => u.phone === sanitized || u.phone.includes(sanitized)) ||
      (sanitized === '9743247790' ? demoMember : null);

    if (found) {
      setMatchedUser(found);
      setOtpStep(true);
      setOtpCode('1234'); // auto-fill demo password / OTP
    } else {
      setErrorMsg('Mobile number not found in Karnataka Gym register. Please check the number or use Demo Account: 9743247790.');
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim() !== '1234') {
      setErrorMsg('Invalid password/OTP. Please enter demo password: 1234');
      return;
    }
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

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerError('');

    // Rate limiting check
    const rateCheck = checkRateLimit('login_owner_pin', 5, 60000);
    if (!rateCheck.allowed) {
      setOwnerError(`Too many login attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`);
      return;
    }

    const { sanitized } = sanitizePhone(ownerPhone);
    const cleanPin = ownerPin.trim();

    // Verify phone is owner phone 9902667407 and PIN is 9902
    const isOwnerPhone = sanitized === '9902667407' || sanitized.endsWith('9902667407');
    const isOwnerPin = cleanPin === '9902';

    if (!isOwnerPhone || !isOwnerPin) {
      setOwnerError('Access Denied: Invalid Owner credentials. Only Karnataka Gym authorized owner with verified PIN can access the cockpit.');
      return;
    }

    const ownerUser = users.find((u) => u.role === 'owner') || users.find((u) => u.phone === '9902667407') || {
      id: 'user_owner_riyaz',
      role: 'owner' as const,
      phone: '9902667407',
      name: 'Riyaz (Gym Owner)'
    };

    login(ownerUser.id);
    router.push('/owner/dashboard');
  };

  // Grouped users
  const trainerUsers = users.filter((u) => u.role === 'trainer');
  const ownerUsers = users.filter((u) => u.role === 'owner' || u.role === 'front_desk');
  const demoMember =
    users.find((u) => u.phone === '9743247790') ||
    users.find((u) => u.id === 'member_rahul_desai') ||
    users.find((u) => u.role === 'member') || {
      id: 'member_rahul_desai',
      name: 'Rahul Desai',
      phone: '9743247790',
      role: 'member' as const,
      marketing_opt_in: true,
      comm_preference: 'whatsapp' as const,
      created_at: '2025-01-01'
    };

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

          {/* Owner Tab - Only accessible via direct link (?role=owner) */}
          {requestedRole === 'owner' && (
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
              <span>Owner Portal</span>
            </button>
          )}
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
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Mobile Number
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneInput('9743247790');
                          setErrorMsg('');
                        }}
                        className="text-[11px] text-[#E5A93C] hover:underline font-bold cursor-pointer"
                      >
                        Demo: 9743247790
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                        +91
                      </div>
                      <input
                        type="tel"
                        placeholder="e.g. 9743247790"
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
                    <span>Continue to Password / OTP</span>
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
                      <span>Enter 4-Digit Password / OTP</span>
                      <span className="text-[#E5A93C] text-[10px] font-bold">Demo Password: 1234</span>
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="1234"
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
                    <span>Verify & Enter Member Portal</span>
                  </button>
                </form>
              )}
            </div>

            {/* 1 Demo Member Profile */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Demo Member Account:</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Password: 1234
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDirectSelect(demoMember)}
                className="w-full p-3.5 rounded-xl bg-[#171D2B] border border-[#28354A] hover:border-[#E5A93C] text-left flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1F2739] border border-[#2D3950] text-[#E5A93C] font-black flex items-center justify-center text-sm">
                    {demoMember.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-white block group-hover:text-[#E5A93C] transition-colors">
                      {demoMember.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      +91 {demoMember.phone} • Password: 1234 • Active Plan
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#E5A93C]">
                  <span>1-Tap Demo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Click to test QR check-in, workout streak, and renewal features.
              </p>
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

        {/* TAB 3: OWNER SECURE CREDENTIAL LOGIN */}
        {activeTab === 'owner' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-[#121622] border-2 border-red-800/80 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 text-red-500 flex items-center justify-center">
                  <Lock className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-700/60 px-2 py-0.5 rounded-full">
                      Owner Only • Protected
                    </span>
                  </div>
                  <h2 className="text-base font-extrabold text-white mt-1">Owner Cockpit Authentication</h2>
                  <p className="text-xs text-slate-400">Strict credential verification for Karnataka Gym Hubballi</p>
                </div>
              </div>

              <form onSubmit={handleOwnerLogin} className="space-y-4 pt-1">
                {/* Owner Phone Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Owner Registered Mobile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="9902667407"
                      className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-red-500 rounded-xl py-2.5 pl-12 pr-4 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {/* Owner Secret PIN Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Owner Secret PIN
                    </label>
                    <span className="text-[11px] text-[#E5A93C] font-semibold">
                      PIN: 9902
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={ownerPin}
                      onChange={(e) => setOwnerPin(e.target.value)}
                      placeholder="Enter 4-Digit Owner PIN"
                      className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-red-500 rounded-xl py-2.5 pl-10 pr-10 text-sm font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none"
                      maxLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                      title={showPin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {ownerError && (
                  <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{ownerError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>Verify Credentials & Enter Cockpit</span>
                </button>
              </form>

              <div className="p-3 rounded-xl bg-[#171D2B] border border-[#232B3E] text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E5A93C] flex-shrink-0 mt-0.5" />
                <span>
                  Only the verified owner can configure Member App appearance, announcement banners, churn recovery, and membership plans.
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
