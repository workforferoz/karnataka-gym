'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { TestChecklistDrawer } from '@/components/TestChecklistDrawer';
import {
  QrCode,
  Flame,
  LayoutDashboard,
  AlertCircle,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Award,
  Zap,
  Users
} from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

export default function HomePage() {
  const { currentUser, switchUser, noShowCases, memberships, streaks } = useGym();
  const [showTests, setShowTests] = useState(false);

  const openNoShows = noShowCases.filter((c) => c.status === 'open').length;
  const currentStreak = streaks.find((s) => s.user_id === currentUser.id)?.current_streak || 14;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100">
      <Header onOpenTests={() => setShowTests(true)} />
      <PWAInstallBanner />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-10 space-y-8">
        {/* Hero Branding Card */}
        <div className="rounded-3xl bg-[#121622] border-2 border-[#232B3E] p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Logo */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 drop-shadow-[0_8px_24px_rgba(229,169,60,0.35)]">
              <Image
                src="/karnataka-gym-logo.png"
                alt="Karnataka Gym Hubballi"
                width={144}
                height={144}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            {/* Title & Tagline (Clean typography, no gradient text, no badge above headline) */}
            <div className="space-y-2.5">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                KARNATAKA <span className="text-[#E5A93C]">GYM</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 max-w-lg leading-relaxed">
                Hubballi attendance verification, silent churn alerts, workout streak tracking, and transparent membership renewals.
              </p>

              {/* Clickable Contact Bar */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
                <a
                  href="tel:9902667407"
                  className="flex items-center gap-1.5 bg-[#171D2B] border border-[#2D3950] px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:border-[#E5A93C] transition-colors"
                  title="Call Karnataka Gym Helpline"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>9902667407</span>
                </a>

                <a
                  href="mailto:karnatakagymhubli@gmail.com"
                  className="flex items-center gap-1.5 bg-[#171D2B] border border-[#2D3950] px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:border-[#E5A93C] transition-colors"
                  title="Email Karnataka Gym"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Email</span>
                </a>

                <a
                  href="https://instagram.com/KARNATAKA_GYM_HUBLI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-[#171D2B] border border-[#2D3950] px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:border-pink-500 transition-colors"
                  title="Instagram Handle"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span>@KARNATAKA_GYM_HUBLI</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Role Gateways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Member Portal Gateway */}
          <Link
            href="/member/home"
            className="group relative p-6 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] hover:border-[#E5A93C] transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E5A93C] text-slate-950 flex items-center justify-center font-black shadow-lg">
                  <QrCode className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C2436] border border-[#2C3852] text-xs font-bold text-[#E5A93C]">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>{currentStreak} Day Streak</span>
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-white group-hover:text-[#E5A93C] transition-colors flex items-center gap-2">
                Member Portal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Daily attendance check-in, dynamic QR pass, active plan expiry countdown, and transparent add-ons.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1C2436] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Logged in as:</span>
              <span className="text-white font-bold">{currentUser.name}</span>
            </div>
          </Link>

          {/* Owner Cockpit Gateway */}
          <Link
            href="/owner/dashboard"
            className="group relative p-6 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] hover:border-red-500 transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center font-black shadow-lg">
                  <LayoutDashboard className="w-6 h-6 stroke-[2.5]" />
                </div>
                {openNoShows > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-700 text-xs font-bold text-red-200">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>{openNoShows} Churn Alerts</span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-white group-hover:text-red-400 transition-colors flex items-center gap-2">
                Owner Cockpit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                10-Day silent no-shows red list, direct WhatsApp follow-up links, assisted front desk check-in, and audit logs.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1C2436] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Gym Management:</span>
              <span className="text-[#E5A93C] font-bold">Manjunath (Owner)</span>
            </div>
          </Link>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/member/check-in"
            className="p-3.5 rounded-xl bg-[#131824] border border-[#202738] hover:border-[#E5A93C] transition-colors flex flex-col items-center text-center group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E5A93C]/15 text-[#E5A93C] flex items-center justify-center mb-2">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">QR Check-in</span>
            <span className="text-[10px] text-slate-400">Scan & Enter</span>
          </Link>

          <Link
            href="/member/renew"
            className="p-3.5 rounded-xl bg-[#131824] border border-[#202738] hover:border-[#E5A93C] transition-colors flex flex-col items-center text-center group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Renew Membership</span>
            <span className="text-[10px] text-slate-400">Online Gateways</span>
          </Link>

          <Link
            href="/owner/churn-risk"
            className="p-3.5 rounded-xl bg-[#131824] border border-[#202738] hover:border-red-500 transition-colors flex flex-col items-center text-center group"
          >
            <div className="w-9 h-9 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center mb-2">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Red-List</span>
            <span className="text-[10px] text-slate-400">Absent Members</span>
          </Link>

          <button
            onClick={() => setShowTests(true)}
            className="p-3.5 rounded-xl bg-[#131824] border border-[#202738] hover:border-teal-500 transition-colors flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Test Checklist</span>
            <span className="text-[10px] text-slate-400">12 System Checks</span>
          </button>
        </div>
      </main>

      <Footer />
      <TestChecklistDrawer isOpen={showTests} onClose={() => setShowTests(false)} />
    </div>
  );
}
