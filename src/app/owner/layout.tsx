'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGym } from '@/lib/store';
import { ShieldAlert, ArrowLeft, Lock, UserCheck, Sparkles, ShieldCheck } from 'lucide-react';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, isLoggedIn, isHydrated, login } = useGym();

  if (!isHydrated) {
    return <div className="min-h-screen bg-[#0B0E14]" />;
  }

  const isOwnerOrStaff = currentUser.role === 'owner' || currentUser.role === 'front_desk' || currentUser.role === 'trainer';

  // Strictly enforce that Owner Cockpit only opens from Owner Login
  if (!isLoggedIn || !isOwnerOrStaff) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0E14] text-slate-100 p-4">
        <div className="max-w-md w-full bg-[#121622] border-2 border-red-600 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-2xl">
          {/* Brand Logo */}
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

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-700 text-red-300 text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Owner & Staff Cockpit Guard</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              Restricted Management Zone
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isLoggedIn ? (
                <>You are currently authenticated as <strong className="text-white">{currentUser.name}</strong> ({currentUser.role}). Management tools, silent churn recovery, and member overrides require owner or staff authorization.</>
              ) : (
                <>Owner Cockpit requires verified administrator credentials. Please authenticate to view churn analytics, financial summaries, and member management.</>
              )}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login?role=owner"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all"
            >
              <Lock className="w-4 h-4 stroke-[2.5]" />
              <span>Owner Login (PIN Required)</span>
            </Link>

            <Link
              href="/"
              className="w-full text-slate-400 hover:text-white font-medium py-2 text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Karnataka Gym Website</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-[#1C2333] flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span>Karnataka Gym Hubballi • Strict Role-Based Access Control</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
