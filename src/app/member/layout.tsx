'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGym } from '@/lib/store';
import { Lock, UserCheck, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoggedIn, login } = useGym();

  const isMember = currentUser.role === 'member';

  // Strictly enforce that Member Portal only opens from Member Login
  if (!isLoggedIn || !isMember) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0E14] text-slate-100 p-4">
        <div className="max-w-md w-full bg-[#121622] border-2 border-[#E5A93C] rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl">
          {/* Brand Logo */}
          <div className="relative w-16 h-16 mx-auto drop-shadow-[0_4px_16px_rgba(229,169,60,0.35)]">
            <Image
              src="/karnataka-gym-logo.png"
              alt="Karnataka Gym Hubballi"
              width={64}
              height={64}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Member Portal Access Required</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              Members Only Zone
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Attendance verification, daily streak countdown, QR pass, and renewal discounts are strictly reserved for registered members of Karnataka Gym Hubballi.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login?role=member"
              className="w-full bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 transition-all"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Log In via Mobile OTP</span>
            </Link>

            <button
              onClick={() => login('member_rahul_desai')}
              className="w-full bg-[#1A2234] hover:bg-[#232D44] border border-[#2B354C] text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#E5A93C]" />
              <span>Quick Demo: Enter as Rahul Desai</span>
            </button>

            <Link
              href="/"
              className="w-full text-slate-400 hover:text-white font-medium py-2 text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Karnataka Gym Website</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-[#1C2333] flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Karnataka Gym Hubballi • Role Separation Active</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
