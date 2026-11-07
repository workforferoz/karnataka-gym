'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { sanitizePhone, checkRateLimit } from '@/lib/security';
import { Phone, ArrowRight, ShieldCheck, CheckCircle, Search, UserCheck, KeyRound, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { users, switchUser, memberships, noShowCases } = useGym();

  const [phoneInput, setPhoneInput] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'expiring' | 'churn' | 'staff'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedUser, setMatchedUser] = useState<typeof users[0] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Rate limiting check
    const rateCheck = checkRateLimit('login_otp', 5, 60000);
    if (!rateCheck.allowed) {
      setErrorMsg(`Too many lookup attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`);
      return;
    }

    const { sanitized, isValid } = sanitizePhone(phoneInput);
    if (!sanitized) {
      setErrorMsg('Please enter a valid mobile number.');
      return;
    }

    const found = users.find((u) => u.phone === sanitized || u.phone.includes(sanitized));

    if (found) {
      setMatchedUser(found);
      setOtpStep(true);
      setOtpCode('1234'); // auto-fill demo OTP
    } else {
      setErrorMsg('Mobile number not found in register. Please select from the seeded demo accounts below.');
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchedUser) {
      switchUser(matchedUser.id);
      if (matchedUser.role === 'owner') {
        router.push('/owner/dashboard');
      } else {
        router.push('/member/home');
      }
    }
  };

  const handleDirectSelect = (user: typeof users[0]) => {
    switchUser(user.id);
    if (user.role === 'owner') {
      router.push('/owner/dashboard');
    } else {
      router.push('/member/home');
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);

    if (!matchesQuery) return false;

    if (selectedCategory === 'staff') {
      return u.role === 'owner' || u.role === 'front_desk';
    }
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
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Top Branding Card */}
        <div className="text-center space-y-2">
          <div className="inline-block relative w-16 h-16 flex-shrink-0 drop-shadow-[0_4px_12px_rgba(229,169,60,0.35)] mb-1">
            <Image
              src="/karnataka-gym-logo.png"
              alt="Karnataka Gym"
              width={64}
              height={64}
              className="object-contain w-full h-full"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Karnataka Gym <span className="text-[#E5A93C]">Hubballi</span> Login
          </h1>
          <p className="text-xs text-slate-400">
            Apna 10-digit mobile number daalein ya neeche direct demo profile chunen.
          </p>
        </div>

        {/* OTP Input Card */}
        <div className="max-w-md mx-auto bg-[#121622] border border-[#232B3E] rounded-2xl p-6 shadow-xl space-y-4">
          {!otpStep ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Mobile Number (OTP Lookup)
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
                className="w-full bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] hover:from-[#d89e34] hover:to-[#e08f06] text-slate-950 font-extrabold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 transition-all cursor-pointer"
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
                  className="text-xs text-slate-400 hover:text-white underline"
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
                <span>Verify OTP & Enter</span>
              </button>
            </form>
          )}
        </div>

        {/* 1-Click Demo Profiles Section (All 30 Indian Members + Staff + Owner) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                1-Click Instant Demo Profiles ({users.length} Users Seeded)
              </h2>
              <p className="text-xs text-slate-400">
                Click any profile to instantly login and test retention and member workflows.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#121622] p-1 rounded-xl border border-[#232B3E] overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#E5A93C] text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All (30+)
              </button>
              <button
                onClick={() => setSelectedCategory('expiring')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'expiring'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Expiring (5)
              </button>
              <button
                onClick={() => setSelectedCategory('churn')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'churn'
                    ? 'bg-red-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Churn Risk (6)
              </button>
              <button
                onClick={() => setSelectedCategory('staff')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'staff'
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Staff / Owner
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
            {filteredUsers.map((user) => {
              const isOwner = user.role === 'owner';
              const isStaff = user.role === 'front_desk';
              const isChurnCase = noShowCases.some((c) => c.user_id === user.id && c.status === 'open');
              const mem = memberships.find((m) => m.user_id === user.id);

              return (
                <button
                  key={user.id}
                  onClick={() => handleDirectSelect(user)}
                  className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between cursor-pointer ${
                    isOwner
                      ? 'bg-purple-950/20 border-purple-700/60 hover:border-purple-400'
                      : isChurnCase
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
                        isOwner
                          ? 'bg-purple-600 text-white'
                          : isStaff
                          ? 'bg-blue-600 text-white'
                          : isChurnCase
                          ? 'bg-red-600 text-white'
                          : 'bg-[#232B3E] text-[#E5A93C]'
                      }`}
                    >
                      {isOwner ? 'Owner' : isStaff ? 'Staff' : isChurnCase ? 'Absent' : 'Member'}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-[#1C2333]">
                    <span>
                      {isOwner
                        ? 'Cockpit Access'
                        : isStaff
                        ? 'Assisted Desk'
                        : `Plan: ${mem?.plan_id ? mem.plan_id.replace('plan_', '') : 'Active'}`}
                    </span>
                    <span className="text-[#E5A93C] font-semibold flex items-center gap-0.5">
                      Enter →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

