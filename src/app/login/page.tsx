'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGym } from '@/lib/store';
import { Footer } from '@/components/Footer';
import { sanitizePhone, checkRateLimit } from '@/lib/security';
import {
  ArrowRight,
  CheckCircle,
  KeyRound,
  ArrowLeft,
  Lock,
  LayoutDashboard
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const { users, login } = useGym();

  const [phoneInput, setPhoneInput] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const ownerUser = users.find((u) => u.role === 'owner') || {
    id: 'user_owner_riyaz',
    name: 'Riyaz (Gym Owner)',
    phone: '9902667407',
    role: 'owner'
  };

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

    if (sanitized === ownerUser.phone || sanitized === '9902667407') {
      setOtpStep(true);
      setOtpCode('1234'); // auto-fill demo OTP
    } else {
      setErrorMsg('Access restricted. Currently only the Gym Owner mobile number (+91 9902667407) is active.');
    }
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    login(ownerUser.id);
    router.push('/owner/dashboard');
  };

  const handleDirectSelect = () => {
    login(ownerUser.id);
    router.push('/owner/dashboard');
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

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-10 space-y-8">
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
              Owner & Management Cockpit Portal
            </p>
          </div>
        </div>

        {/* OWNER LOGIN CARD */}
        <div className="bg-[#121622] border-2 border-red-900/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 text-red-500 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Owner Portal Access</h2>
              <p className="text-xs text-slate-400">Exclusive administrative cockpit for Riyaz (Gym Owner)</p>
            </div>
          </div>

          {/* Quick Direct Access */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
              Active Owner Account:
            </span>

            <button
              onClick={handleDirectSelect}
              className="w-full p-4 rounded-xl bg-[#171D2B] border border-[#28354A] hover:border-red-500 text-left flex items-center justify-between transition-all group cursor-pointer shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-800 text-red-300 font-black flex items-center justify-center text-sm">
                  R
                </div>
                <div>
                  <span className="text-sm font-extrabold text-white block group-hover:text-red-400 transition-colors">
                    {ownerUser.name}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    +91 {ownerUser.phone} • Gym Owner
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:text-red-300">
                <span>Enter Cockpit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-[#232B3E]"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-slate-500 tracking-wider">or sign in with mobile OTP</span>
            <div className="flex-grow border-t border-[#232B3E]"></div>
          </div>

          {/* OTP FORM */}
          {!otpStep ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Owner Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                    +91
                  </div>
                  <input
                    type="tel"
                    placeholder="9902667407"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-red-500 rounded-xl py-2.5 pl-12 pr-4 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
                    maxLength={10}
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-red-400 mt-1.5 font-medium">{errorMsg}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                <span>Request OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div className="bg-[#181F2F] p-3 rounded-xl border border-[#2C3852] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Logging in as:</span>
                  <span className="text-sm font-extrabold text-white">{ownerUser.name}</span>
                  <span className="text-xs text-red-400 font-mono block">+91 {ownerUser.phone}</span>
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
                  <span className="text-red-400 text-[10px] font-normal">Demo OTP: 1234</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-red-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none text-center"
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
                <span>Verify OTP & Enter Cockpit</span>
              </button>
            </form>
          )}

          <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/50 text-[11px] text-red-300 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Karnataka Gym Hubballi is in single-owner operational mode. Member and trainer portal sign-ins will be enabled following initial member enrollment.
            </span>
          </div>
        </div>
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
