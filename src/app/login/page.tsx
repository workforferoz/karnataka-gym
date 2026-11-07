'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { sanitizePhone, checkRateLimit } from '@/lib/security';
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Search,
  UserCheck,
  KeyRound,
  Sparkles,
  ArrowLeft,
  Lock,
  LayoutDashboard
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get('role'); // 'member' | 'owner'

  const { users, login, memberships, noShowCases } = useGym();

  const [activeTab, setActiveTab] = useState<'member' | 'owner'>('member');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'expiring' | 'churn'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedUser, setMatchedUser] = useState<typeof users[0] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync tab with URL parameter
  useEffect(() => {
    if (requestedRole === 'owner') {
      setActiveTab('owner');
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
      setErrorMsg('Mobile number not found in register. Please use one of the demo profiles below.');
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchedUser) {
      login(matchedUser.id);
      if (matchedUser.role === 'owner' || matchedUser.role === 'front_desk') {
        router.push('/owner/dashboard');
      } else {
        router.push('/member/home');
      }
    }
  };

  const handleDirectSelect = (user: typeof users[0]) => {
    login(user.id);
    if (user.role === 'owner' || user.role === 'front_desk') {
      router.push('/owner/dashboard');
    } else {
      router.push('/member/home');
    }
  };

  // Staff and Owner users
  const staffAndOwnerUsers = users.filter((u) => u.role === 'owner' || u.role === 'front_desk');

  // Filter member users
  const memberUsers = users.filter((u) => u.role === 'member');
  const filteredMembers = memberUsers.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);

    if (!matchesQuery) return false;

    if (selectedCategory === 'churn') {
      return noShowCases.some((c) => c.user_id === u.id && c.status === 'open');
    }
    if (selectedCategory === 'expiring') {
      const mem = memberships.find((m) => m.user_id === u.id);
      if (!mem) return false;
      const today = new Date();
      const exp = new Date(mem.expiry_date);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }
    return true;
  });

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
            Station Road, Hubballi • Helpline: <a href="tel:9902667407" className="text-[#E5A93C] font-semibold">9902667407</a>
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
              Select your role to access the dedicated member app or owner cockpit.
            </p>
          </div>
        </div>

        {/* Role Toggle Tabs */}
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#121622] border border-[#232B3E]">
          <button
            type="button"
            onClick={() => setActiveTab('member')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'member'
                ? 'bg-[#E5A93C] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Member Login</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('owner')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'owner'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Owner Cockpit</span>
          </button>
        </div>

        {/* TAB 1: MEMBER LOGIN */}
        {activeTab === 'member' && (
          <div className="space-y-8">
            {/* OTP Input Card */}
            <div className="max-w-md mx-auto bg-[#121622] border border-[#232B3E] rounded-2xl p-6 shadow-xl space-y-4">
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
                        placeholder="9876543210 (e.g. Rahul)"
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

            {/* Quick Demo Member Profiles */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                    Instant Demo Member Profiles ({memberUsers.length} Members)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Click any member below to test check-in, streak counting, and renewal workflows.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 bg-[#121622] p-1 rounded-xl border border-[#232B3E] overflow-x-auto">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#E5A93C] text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All Members
                  </button>
                  <button
                    onClick={() => setSelectedCategory('expiring')}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      selectedCategory === 'expiring'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Expiring in 4 Days
                  </button>
                  <button
                    onClick={() => setSelectedCategory('churn')}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      selectedCategory === 'churn'
                        ? 'bg-red-500 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Absent / Churn
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search member name or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121622] border border-[#232B3E] focus:border-[#E5A93C] rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredMembers.map((user) => {
                  const isChurnCase = noShowCases.some((c) => c.user_id === user.id && c.status === 'open');
                  const mem = memberships.find((m) => m.user_id === user.id);

                  return (
                    <button
                      key={user.id}
                      onClick={() => handleDirectSelect(user)}
                      className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between cursor-pointer ${
                        isChurnCase
                          ? 'bg-red-950/20 border-red-800/60 hover:border-red-400'
                          : 'bg-[#121622] border-[#202738] hover:border-[#E5A93C]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#1F2739] text-[#E5A93C] font-black flex items-center justify-center text-xs border border-[#2D3950]">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-white block leading-tight">
                              {user.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              +91 {user.phone}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            isChurnCase ? 'bg-red-600 text-white' : 'bg-[#232B3E] text-[#E5A93C]'
                          }`}
                        >
                          {isChurnCase ? 'Absent' : 'Active'}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-[#1C2333]">
                        <span>Plan: {mem?.plan_id ? mem.plan_id.replace('plan_', '') : 'Active'}</span>
                        <span className="text-[#E5A93C] font-semibold flex items-center gap-0.5">
                          Enter Portal →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OWNER & STAFF LOGIN */}
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

                {staffAndOwnerUsers.map((staffUser) => (
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
