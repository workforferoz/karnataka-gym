'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGym } from '@/lib/store';
import { sanitizePhone, checkRateLimit } from '@/lib/security';
import {
  Lock,
  Phone,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function OwnerLoginPage() {
  const router = useRouter();
  const { users, login } = useGym();

  const [ownerPhone, setOwnerPhone] = useState('9902667407');
  const [ownerPin, setOwnerPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Rate limit check: 5 attempts per minute
    const rateCheck = checkRateLimit('login_owner_private', 5, 60000);
    if (!rateCheck.allowed) {
      setErrorMsg(`Too many login attempts. Please wait ${rateCheck.retryAfterSeconds}s before retrying.`);
      return;
    }

    const { sanitized } = sanitizePhone(ownerPhone);
    const cleanPin = ownerPin.trim();

    // Verify phone is owner phone 9902667407 and PIN is 9902 or demo 1234
    const isOwnerPhone = sanitized === '9902667407' || sanitized.endsWith('9902667407');
    const isOwnerPin = cleanPin === '9902' || cleanPin === '1234';

    if (!isOwnerPhone || !isOwnerPin) {
      setErrorMsg('Access Denied: Invalid Owner Mobile or Secret PIN. This portal is strictly restricted to Karnataka Gym management.');
      return;
    }

    setIsSubmitting(true);

    const ownerUser =
      users.find((u) => u.role === 'owner') ||
      users.find((u) => u.phone === '9902667407') || {
        id: 'user_owner_manjunath',
        role: 'owner' as const,
        phone: '9902667407',
        name: 'Manjunath (Gym Owner)'
      };

    login(ownerUser.id);
    router.push('/owner/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0E14] text-slate-100 p-4">
      <div className="max-w-md w-full bg-[#121622] border-2 border-red-700/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#232B3E] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Karnataka Gym</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-700 text-red-300">
            <Lock className="w-3 h-3 text-red-400" />
            <span>Private Management Link</span>
          </div>
        </div>

        {/* Brand & Title */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto drop-shadow-[0_4px_16px_rgba(220,38,38,0.35)]">
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
            <h1 className="text-xl md:text-2xl font-black text-white">Owner Cockpit Login</h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct private gateway for Gym Owner Manjunath • Hubballi
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Owner Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Owner Phone */}
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
                maxLength={10}
                required
                className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-red-500 rounded-xl py-2.5 pl-12 pr-4 text-sm font-mono font-bold text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Authorized mobile number: +91 9902667407
            </span>
          </div>

          {/* Owner Secret PIN */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span>Owner Secret PIN</span>
              <span className="text-red-400 text-[10px] font-bold">PIN: 9902 or 1234</span>
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={ownerPin}
                onChange={(e) => setOwnerPin(e.target.value)}
                placeholder="Enter 4-Digit Owner PIN"
                maxLength={6}
                required
                className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-red-500 rounded-xl py-2.5 pl-4 pr-11 text-sm font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Verify & Unlock Owner Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-2 border-t border-[#1C2333] text-[10px] text-slate-500 text-center space-y-1">
          <p>
            This portal allows owner control over member registers, plans, cashflow, and app settings.
          </p>
          <p className="text-slate-400">
            Bookmark this URL for management access: <strong className="text-slate-300">/owner/login</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
