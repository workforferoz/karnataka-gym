'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OwnerBottomNav } from '@/components/OwnerBottomNav';
import { TestChecklistDrawer } from '@/components/TestChecklistDrawer';
import {
  Users,
  UserCheck,
  AlertCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Phone,
  Flame,
  CheckCircle,
  Clock,
  ScanLine
} from 'lucide-react';

export default function OwnerDashboardPage() {
  const {
    currentUser,
    users,
    memberships,
    attendance,
    noShowCases,
    payments,
    runDailyNoShowScan
  } = useGym();

  const [showTests, setShowTests] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Metrics
  const totalMembers = users.filter((u) => u.role === 'member').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckinsCount = attendance.filter(
    (a) => a.check_in_time.startsWith(todayStr) && a.status === 'valid'
  ).length;

  // 7-day active members
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const active7DaysUserIds = new Set(
    attendance
      .filter((a) => new Date(a.check_in_time) >= sevenDaysAgo && a.status === 'valid')
      .map((a) => a.user_id)
  );
  const count7DayActive = active7DaysUserIds.size;

  // Open no-shows
  const openNoShows = noShowCases.filter((c) => c.status === 'open');
  const resolvedNoShowsCount = noShowCases.filter((c) => c.status === 'resolved').length;

  // Renewals due in 7 days
  const today = new Date();
  const renewalsDueCount = memberships.filter((m) => {
    if (m.status !== 'active') return false;
    const exp = new Date(m.expiry_date);
    const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 7 && diff >= 0;
  }).length;

  // Add-on revenue
  const addonRevenue = payments
    .filter((p) => p.status === 'paid' && p.addon_id)
    .reduce((sum, p) => sum + p.amount, 0);

  // Total collected revenue
  const totalPaidRevenue = payments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleRunScan = () => {
    const res = runDailyNoShowScan();
    if (res.createdCount > 0) {
      setScanMessage(`Scan complete: ${res.createdCount} new no-show cases flagged (${res.details.join(', ')})`);
    } else {
      setScanMessage('Daily scan complete: All silent churn cases are already flagged & tracked.');
    }
    setTimeout(() => setScanMessage(null), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header onOpenTests={() => setShowTests(true)} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Welcome & Owner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2 py-0.5 rounded-full">
                Manager & Owner Cockpit
              </span>
              <span className="text-xs text-slate-400">Hubballi Branch</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Karnataka Gym Retention Radar
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunScan}
              className="bg-[#171D2B] hover:bg-[#1E2538] border border-[#2B354C] hover:border-[#E5A93C] text-xs font-bold text-slate-200 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Run Daily 23:59 Scan</span>
            </button>

            <Link
              href="/owner/assisted-checkin"
              className="bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#E5A93C]/20 transition-transform active:scale-95"
            >
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Assisted Desk</span>
            </Link>
          </div>
        </div>

        {/* Scan Notification Banner */}
        {scanMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-600 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{scanMessage}</span>
          </div>
        )}

        {/* Critical Red-List Churn Alert Hero Card */}
        {openNoShows.length > 0 && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/80 via-rose-950/60 to-red-950/80 border-2 border-red-600/90 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex-shrink-0">
                <AlertCircle className="w-7 h-7 stroke-[2.5] animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-300 block">
                  SILENT CHURN EMERGENCY ({openNoShows.length} Cases Open)
                </span>
                <h2 className="text-base font-extrabold text-white mt-0.5">
                  {openNoShows.length} Members absent for 10+ consecutive days!
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  Prakash Hubli (18d), Sunita Rao (16d), Vinod Angadi (15d) and others have not visited. Reach out on WhatsApp before they drop out permanently.
                </p>
              </div>
            </div>

            <Link
              href="/owner/churn-risk"
              className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-950/50 flex items-center gap-1.5 flex-shrink-0 self-stretch sm:self-auto justify-center transition-transform active:scale-95"
            >
              <span>Rescue Members Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Metric Cards Grid (All 7 required indicators) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* 1. Active Members */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Members</span>
              <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{totalMembers}</div>
            <span className="text-[10px] text-slate-400 block">30 Seeded Indian Profiles</span>
          </div>

          {/* 2. Today's Check-ins */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Today Check-ins</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                <ScanLine className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400">{todayCheckinsCount}</div>
            <span className="text-[10px] text-slate-400 block">Real-time attendance</span>
          </div>

          {/* 3. 7-Day Active */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">7-Day Active</span>
              <div className="p-1.5 rounded-lg bg-[#E5A93C]/15 text-[#E5A93C]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{count7DayActive}</div>
            <span className="text-[10px] text-slate-400 block">Consistent gym lifters</span>
          </div>

          {/* 4. Open No-Show Cases */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">No-Show Cases</span>
              <div className="p-1.5 rounded-lg bg-red-500/15 text-red-400">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-red-400">{openNoShows.length}</div>
            <span className="text-[10px] text-slate-400 block">10+ Days Absent</span>
          </div>

          {/* 5. Returned Members */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Returned Members</span>
              <div className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-teal-400">{resolvedNoShowsCount}</div>
            <span className="text-[10px] text-slate-400 block">Saved from churning</span>
          </div>

          {/* 6. Renewals Due (<7 Days) */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Renewals Due</span>
              <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-400">{renewalsDueCount}</div>
            <span className="text-[10px] text-slate-400 block">Expiring in 4-7 days</span>
          </div>

          {/* 7. Add-On Revenue */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Add-on Revenue</span>
              <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-300 font-mono">₹{addonRevenue}</div>
            <span className="text-[10px] text-slate-400 block">PT, Diet, Supplements</span>
          </div>

          {/* 8. Total Membership Revenue */}
          <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Cashflow</span>
              <div className="p-1.5 rounded-lg bg-[#E5A93C]/15 text-[#E5A93C]">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#E5A93C] font-mono">₹{totalPaidRevenue}</div>
            <span className="text-[10px] text-slate-400 block">All Collections</span>
          </div>
        </div>

        {/* Action Gateway Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <Link
            href="/owner/churn-risk"
            className="p-4 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] hover:border-red-500 transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-black text-white group-hover:text-red-400 transition-colors block">
                Silent Churn Red-List
              </span>
              <span className="text-[11px] text-slate-400">WhatsApp & Call absent members</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-red-400 transition-all" />
          </Link>

          <Link
            href="/owner/manage/members"
            className="p-4 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] hover:border-[#E5A93C] transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-black text-white group-hover:text-[#E5A93C] transition-colors block">
                Manage 30 Members (CRUD)
              </span>
              <span className="text-[11px] text-slate-400">Edit plans, freeze & override diet</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-[#E5A93C] transition-all" />
          </Link>

          <Link
            href="/owner/summary"
            className="p-4 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] hover:border-emerald-500 transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors block">
                Daily Operations Summary
              </span>
              <span className="text-[11px] text-slate-400">Peak hours, cashflow & reports</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
          </Link>
        </div>
      </main>

      <Footer />
      <OwnerBottomNav />
      <TestChecklistDrawer isOpen={showTests} onClose={() => setShowTests(false)} />
    </div>
  );
}

