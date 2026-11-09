'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGym } from '@/lib/store';
import {
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function TrainerLoginPage() {
  const router = useRouter();
  const { users, login } = useGym();

  const trainerUsers = users.filter((u) => u.role === 'trainer');

  const handleSelectTrainer = (trainerId: string) => {
    login(trainerId, 'trainer_portal');
    router.push('/owner/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0E14] text-slate-100 p-4">
      <div className="max-w-md w-full bg-[#121622] border-2 border-emerald-700/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#232B3E] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Karnataka Gym</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300">
            <Dumbbell className="w-3 h-3 text-emerald-400" />
            <span>Trainer Portal (Direct Link)</span>
          </div>
        </div>

        {/* Brand & Title */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto drop-shadow-[0_4px_16px_rgba(16,185,129,0.35)]">
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
            <h1 className="text-xl md:text-2xl font-black text-white">Trainer & Coach Desk</h1>
            <p className="text-xs text-slate-400 mt-1">
              Hubballi certified coaches: Vikram, Pooja & Rakesh
            </p>
          </div>
        </div>

        {/* Trainer Selection List */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
            Select Certified Trainer:
          </span>

          {trainerUsers.map((trainer) => (
            <button
              key={trainer.id}
              onClick={() => handleSelectTrainer(trainer.id)}
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

        {/* Notice */}
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-[11px] text-emerald-300 flex items-start gap-2.5">
          <Award className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            Trainers have full permissions to view active members, conduct assisted check-ins at reception, and assign diet charts.
          </span>
        </div>

        {/* Footer Link */}
        <div className="pt-2 border-t border-[#1C2333] text-[11px] text-center text-slate-400">
          Not a trainer?{' '}
          <Link href="/login" className="text-[#E5A93C] hover:underline font-bold">
            Switch to Member Login →
          </Link>
        </div>
      </div>
    </div>
  );
}

