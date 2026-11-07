'use client';

import React from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { ShieldAlert, ArrowLeft, Lock, UserCheck } from 'lucide-react';

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, switchUser } = useGym();

  const isOwnerOrStaff = currentUser.role === 'owner' || currentUser.role === 'front_desk';

  if (!isOwnerOrStaff) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0E14] text-slate-100 p-4">
        <div className="max-w-md w-full bg-[#121622] border-2 border-red-600 rounded-3xl p-6 md:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-600/15 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-widest text-red-400 block">
              Security Boundary Guard
            </span>
            <h1 className="text-xl font-black text-white">403 - Restricted Access</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are currently authenticated as <strong className="text-white">{currentUser.name}</strong> ({currentUser.role}). Owner Cockpit and management tools are strictly restricted to gym administrators.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => switchUser('user_owner_manjunath')}
              className="w-full bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Switch to Owner (Manjunath)</span>
            </button>

            <Link
              href="/member/home"
              className="w-full bg-[#1A2234] hover:bg-[#232D44] border border-[#2B354C] text-slate-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Member Portal</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-[#1C2333] text-[10px] text-slate-500">
            Karnataka Gym Hubballi • Strict Role-Based Access Control
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
