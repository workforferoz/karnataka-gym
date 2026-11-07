'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MemberBottomNav } from '@/components/MemberBottomNav';
import { TestChecklistDrawer } from '@/components/TestChecklistDrawer';
import {
  QrCode,
  Flame,
  Calendar,
  RefreshCcw,
  ShoppingBag,
  Award,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

export default function MemberHomePage() {
  const { currentUser, memberships, plans, streaks, attendance } = useGym();
  const [showTests, setShowTests] = useState(false);

  const membership = memberships.find((m) => m.user_id === currentUser.id);
  const plan = plans.find((p) => p.id === membership?.plan_id);
  const streak = streaks.find((s) => s.user_id === currentUser.id);

  // Expiry calculation
  const today = new Date();
  let daysUntilExpiry = 0;
  let isExpiringSoon = false;
  let isExpired = false;

  if (membership) {
    const expDate = new Date(membership.expiry_date);
    const diffTime = expDate.getTime() - today.getTime();
    daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 7 && daysUntilExpiry >= 0) isExpiringSoon = true;
    if (daysUntilExpiry < 0) isExpired = true;
  }

  // Today check-in status
  const todayStr = today.toISOString().split('T')[0];
  const userTodayCheckin = attendance.find(
    (a) => a.user_id === currentUser.id && a.check_in_time.startsWith(todayStr) && a.status === 'valid'
  );

  const currentStreakVal = streak?.current_streak ?? 0;
  const highestStreakVal = streak?.highest_streak ?? 0;
  const weeklyGoalTarget = streak?.weekly_goal_target ?? 5;
  const weeklyGoalCompleted = streak?.weekly_goal_completed ?? 0;

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header onOpenTests={() => setShowTests(true)} />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-5 space-y-5">
        {/* Urgent Renewal Reminder Banner (If <= 7 days) */}
        {isExpiringSoon && (
          <div className="bg-gradient-to-r from-amber-950/80 via-red-950/70 to-amber-950/80 border-2 border-amber-500/80 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 animate-pulse-subtle">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">
                  Renew Aaj Hi Karein!
                </span>
                <span className="text-xs text-white font-medium">
                  Plan expires in <strong className="text-amber-400 font-extrabold">{daysUntilExpiry} days</strong> ({membership?.expiry_date}).
                </span>
              </div>
            </div>
            <Link
              href="/member/renew"
              className="bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-[#E5A93C]/30 flex-shrink-0 transition-transform active:scale-95"
            >
              Renew
            </Link>
          </div>
        )}

        {/* Expired Warning */}
        {isExpired && (
          <div className="bg-red-950/80 border-2 border-red-600 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-black text-red-300 uppercase tracking-wider block">
                  Membership Expired
                </span>
                <span className="text-xs text-slate-300">
                  Expired on {membership?.expiry_date}. QR entry is currently locked.
                </span>
              </div>
            </div>
            <Link
              href="/member/renew"
              className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl"
            >
              Reactivate
            </Link>
          </div>
        )}

        {/* Member Greeting Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E5A93C] bg-[#171D2B] flex items-center justify-center font-extrabold text-lg text-[#E5A93C]">
              {currentUser.profile_image ? (
                <Image
                  src={currentUser.profile_image}
                  alt={currentUser.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#E5A93C] uppercase tracking-wider block">
                Mera Gym Dashboard
              </span>
              <h1 className="text-xl font-extrabold text-white">
                Namaste, {currentUser.name.split(' ')[0]}
              </h1>
            </div>
          </div>

          <Link
            href="/member/profile"
            className="text-[11px] font-semibold text-slate-400 hover:text-white bg-[#171D2B] border border-[#232B3E] px-2.5 py-1.5 rounded-lg"
          >
            Profile
          </Link>
        </div>

        {/* Active Membership Card ("Mera Plan") */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#161D2B] via-[#121622] to-[#0E121B] border-2 border-[#2C3852] p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">
                MERA ACTIVE PLAN
              </span>
              <h2 className="text-lg font-extrabold text-white">
                {plan?.name || 'Standard Gym Plan'}
              </h2>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                membership?.status === 'frozen'
                  ? 'bg-blue-950 text-blue-300 border border-blue-700'
                  : isExpired
                  ? 'bg-red-950 text-red-300 border border-red-700'
                  : isExpiringSoon
                  ? 'bg-amber-950 text-amber-300 border border-amber-600'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
              }`}
            >
              {membership?.status === 'frozen' ? 'Paused (Frozen)' : isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1F2739] text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Valid Till (Expiry)</span>
              <span className="text-sm font-bold text-slate-100">
                {membership?.expiry_date || 'N/A'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Days Remaining</span>
              <span className={`text-sm font-extrabold ${daysUntilExpiry <= 7 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {daysUntilExpiry > 0 ? `${daysUntilExpiry} Din Baki` : 'Expired'}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1F2739] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Assigned Coach: <strong className="text-white">{currentUser.assigned_trainer || 'Vikram'}</strong>
            </span>
            <Link
              href="/member/renew"
              className="text-xs font-bold text-[#E5A93C] hover:text-[#f3b544] flex items-center gap-1"
            >
              <span>Renew / Upgrade Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Primary QR Check-In Big Action Button */}
        <Link
          href="/member/check-in"
          className="group block relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E5A93C] via-[#F59E0B] to-[#D97706] p-5 shadow-2xl shadow-[#E5A93C]/20 transition-all active:scale-[0.98]"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-slate-950 text-[#E5A93C] flex items-center justify-center font-black shadow-lg">
                <QrCode className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-950/70 block">
                  Aaj Ka Check-in
                </span>
                <h3 className="text-lg font-black text-slate-950 leading-tight">
                  {userTodayCheckin ? 'Checked In Today ✓' : 'Scan QR at Entry'}
                </h3>
                <span className="text-xs font-bold text-slate-900">
                  {userTodayCheckin
                    ? `Recorded at ${new Date(userTodayCheckin.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : 'Tap to show QR or scan counter code'}
                </span>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-slate-950/15 flex items-center justify-center text-slate-950 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </Link>

        {/* Streak & Weekly Goal Widget */}
        <div className="grid grid-cols-2 gap-3">
          {/* Workout Streak Card */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                  <Flame className="w-5 h-5 fill-amber-500" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  BEST: {highestStreakVal}d
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Current Streak
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-white">{currentStreakVal}</span>
                <span className="text-xs font-bold text-amber-400">Days 🔥</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 mt-2 block">
              {currentStreakVal >= 7 ? 'Dhamakedar discipline! Keep it up.' : 'Consistency is key. Daily workout!'}
            </span>
          </div>

          {/* Weekly Goal Progress */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-400">
                  {Math.round((weeklyGoalCompleted / weeklyGoalTarget) * 100)}%
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Weekly Goal
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-white">{weeklyGoalCompleted}</span>
                <span className="text-xs font-bold text-slate-400">/ {weeklyGoalTarget} Days</span>
              </div>
            </div>

            {/* Day Bubbles */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1C2333]">
              {daysOfWeek.map((day, idx) => {
                const isDone = idx < weeklyGoalCompleted;
                return (
                  <div
                    key={idx}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/40'
                        : 'bg-[#1C2333] text-slate-500'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Secondary Hubballi Gym Shortcuts */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Mera Gym Services
          </span>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/member/add-ons"
              className="p-3.5 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] transition-colors flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-extrabold text-white block truncate">Diet & PT Add-ons</span>
                <span className="text-[10px] text-slate-400 block truncate">Transparent Store</span>
              </div>
            </Link>

            <Link
              href="/member/history"
              className="p-3.5 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] transition-colors flex items-center gap-3 group"
            >
              <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-extrabold text-white block truncate">Attendance Log</span>
                <span className="text-[10px] text-slate-400 block truncate">Full History</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171D2B] to-[#121622] border border-[#232B3E] flex items-center gap-3 text-xs text-slate-300">
          <div className="p-2 rounded-xl bg-[#E5A93C]/15 text-[#E5A93C] flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-white block font-bold">Karnataka Gym Hubballi Motivation:</strong>
            &quot;Consistency beats intensity. Kal fir milenge gym floor par!&quot;
          </div>
        </div>
      </main>

      <Footer />
      <MemberBottomNav />
      <TestChecklistDrawer isOpen={showTests} onClose={() => setShowTests(false)} />
    </div>
  );
}

