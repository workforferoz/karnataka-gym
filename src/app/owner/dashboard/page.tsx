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
  ScanLine,
  Palette,
  ChevronRight,
  ShoppingBag,
  Dumbbell,
  Salad,
  Package,
  Edit2,
  Save,
  X,
  Plus,
  Minus
} from 'lucide-react';
import { AddOn, AddOnType } from '@/types/database';

export default function OwnerDashboardPage() {
  const {
    currentUser,
    users,
    memberships,
    attendance,
    noShowCases,
    payments,
    addOns,
    updateAddon,
    runDailyNoShowScan
  } = useGym();

  const [showTests, setShowTests] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // Marketplace & Pricing Editor State
  const [marketplaceFilter, setMarketplaceFilter] = useState<'all' | 'pt' | 'diet' | 'supplement'>('all');
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [addonEditPrice, setAddonEditPrice] = useState<number>(0);
  const [addonEditDescription, setAddonEditDescription] = useState<string>('');
  const [addonEditName, setAddonEditName] = useState<string>('');
  const [addonEditTrainer, setAddonEditTrainer] = useState<string>('');
  const [addonEditValidity, setAddonEditValidity] = useState<number>(30);
  const [addonEditStock, setAddonEditStock] = useState<number>(0);
  const [addonEditAvailable, setAddonEditAvailable] = useState<boolean>(true);
  const [addonSaveSuccess, setAddonSaveSuccess] = useState<string | null>(null);
  const [isSavingAddon, setIsSavingAddon] = useState(false);

  // Start editing a marketplace service
  const handleStartEditAddon = (item: AddOn) => {
    setEditingAddonId(item.id);
    setAddonEditPrice(item.price);
    setAddonEditDescription(item.description || '');
    setAddonEditName(item.name);
    setAddonEditTrainer(item.trainer_name || '');
    setAddonEditValidity(item.validity_days || 30);
    setAddonEditStock(item.stock || 0);
    setAddonEditAvailable(item.is_available ?? true);
  };

  // Save marketplace updates
  const handleSaveAddon = async (id: string) => {
    setIsSavingAddon(true);
    try {
      await updateAddon(id, {
        name: addonEditName.trim(),
        price: Number(addonEditPrice),
        description: addonEditDescription.trim(),
        trainer_name: addonEditTrainer.trim() || undefined,
        validity_days: Number(addonEditValidity),
        stock: Number(addonEditStock),
        is_available: addonEditAvailable
      });
      setEditingAddonId(null);
      setAddonSaveSuccess(`"${addonEditName}" pricing and description updated!`);
      setTimeout(() => setAddonSaveSuccess(null), 3500);
    } finally {
      setIsSavingAddon(false);
    }
  };

  // Quick stock counter increment/decrement for supplements
  const handleQuickStockUpdate = async (id: string, delta: number) => {
    const item = addOns.find((a) => a.id === id);
    if (!item) return;
    const newStock = Math.max(0, item.stock + delta);
    await updateAddon(id, { stock: newStock });
    setAddonSaveSuccess(`Stock for "${item.name}" updated to ${newStock} units.`);
    setTimeout(() => setAddonSaveSuccess(null), 2500);
  };

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

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="#marketplace-editor"
              className="bg-[#171D2B] hover:bg-[#1E2538] border border-[#2B354C] hover:border-[#E5A93C] text-xs font-bold text-[#E5A93C] px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Edit Marketplace Prices</span>
            </a>

            <Link
              href="/owner/manage/app-look"
              className="bg-[#171D2B] hover:bg-[#1E2538] border border-[#2B354C] hover:border-[#E5A93C] text-xs font-bold text-[#E5A93C] px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Member App Look</span>
            </Link>

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

        {/* Metric Cards Grid - Every section can be opened to detailed operational views */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* 1. Active Members */}
          <Link
            href="/owner/manage/members"
            className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] hover:bg-[#151B29] transition-all duration-200 cursor-pointer space-y-2 group shadow-sm hover:shadow-lg hover:shadow-[#E5A93C]/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                  Total Members
                </span>
                <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 group-hover:bg-blue-500/25 transition-colors">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white group-hover:text-[#E5A93C] transition-colors">{totalMembers}</div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#1C2333]">
              <span className="text-[10px] text-slate-400">{totalMembers} Registered Profiles</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#E5A93C] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          {/* 2. Today's Check-ins */}
          <Link
            href="/owner/assisted-checkin"
            className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-emerald-500 hover:bg-[#151B29] transition-all duration-200 cursor-pointer space-y-2 group shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                  Today Check-ins
                </span>
                <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25 transition-colors">
                  <ScanLine className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-400">{todayCheckinsCount}</div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#1C2333]">
              <span className="text-[10px] text-slate-400">Real-time attendance</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          {/* 3. 7-Day Active */}
          <Link
            href="/owner/manage/members?filter=active"
            className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] hover:bg-[#151B29] transition-all duration-200 cursor-pointer space-y-2 group shadow-sm hover:shadow-lg hover:shadow-[#E5A93C]/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                  7-Day Active
                </span>
                <div className="p-1.5 rounded-lg bg-[#E5A93C]/15 text-[#E5A93C] group-hover:bg-[#E5A93C]/25 transition-colors">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white group-hover:text-[#E5A93C] transition-colors">{count7DayActive}</div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#1C2333]">
              <span className="text-[10px] text-slate-400">Consistent gym lifters</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#E5A93C] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          {/* 4. Open No-Show Cases */}
          <Link
            href="/owner/churn-risk"
            className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-red-500 hover:bg-[#151B29] transition-all duration-200 cursor-pointer space-y-2 group shadow-sm hover:shadow-lg hover:shadow-red-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                  No-Show Cases
                </span>
                <div className="p-1.5 rounded-lg bg-red-500/15 text-red-400 group-hover:bg-red-500/25 transition-colors">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-red-400">{openNoShows.length}</div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#1C2333]">
              <span className="text-[10px] text-slate-400">10+ Days Absent</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          {/* 5. Returned Members */}
          <Link
            href="/owner/churn-risk?tab=resolved"
            className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-teal-500 hover:bg-[#151B29] transition-all duration-200 cursor-pointer space-y-2 group shadow-sm hover:shadow-lg hover:shadow-teal-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                  Returned Members
                </span>
                <div className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400 group-hover:bg-teal-500/25 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-teal-400">{resolvedNoShowsCount}</div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#1C2333]">
              <span className="text-[10px] text-slate-400">Saved from churning</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          {/* 6. Renewals Due (<7 Days) */}
          <Link
            href="/owner/manage/members?filter=expiring"
            className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-amber-500 hover:bg-[#151B29] transition-all duration-200 cursor-pointer space-y-2 group shadow-sm hover:shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                  Renewals Due
                </span>
                <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25 transition-colors">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-400">{renewalsDueCount}</div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#1C2333]">
              <span className="text-[10px] text-slate-400">Expiring in 4-7 days</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          {/* 7. Add-On Revenue */}
          <Link
            href="/owner/manage/addons"
            className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-purple-500 hover:bg-[#151B29] transition-all duration-200 cursor-pointer space-y-2 group shadow-sm hover:shadow-lg hover:shadow-purple-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                  Add-on Revenue
                </span>
                <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400 group-hover:bg-purple-500/25 transition-colors">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-purple-300 font-mono">₹{addonRevenue}</div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#1C2333]">
              <span className="text-[10px] text-slate-400">PT, Diet, Supplements</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

          {/* 8. Total Membership Revenue */}
          <Link
            href="/owner/summary"
            className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] hover:bg-[#151B29] transition-all duration-200 cursor-pointer space-y-2 group shadow-sm hover:shadow-lg hover:shadow-[#E5A93C]/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-slate-200 transition-colors">
                  Total Cashflow
                </span>
                <div className="p-1.5 rounded-lg bg-[#E5A93C]/15 text-[#E5A93C] group-hover:bg-[#E5A93C]/25 transition-colors">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#E5A93C] font-mono">₹{totalPaidRevenue}</div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#1C2333]">
              <span className="text-[10px] text-slate-400">All Collections</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#E5A93C] group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>
        </div>

        {/* Action Gateway Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          <a
            href="#marketplace-editor"
            className="p-4 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] hover:border-[#E5A93C] transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white group-hover:text-[#E5A93C] transition-colors block">
                  Marketplace Prices
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30">
                  EDIT
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                PT, Diet & Supplements pricing
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-[#E5A93C] transition-all" />
          </a>

          <Link
            href="/owner/manage/app-look"
            className="p-4 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] hover:border-[#E5A93C] transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white group-hover:text-[#E5A93C] transition-colors block">
                  Member App Look
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30">
                  LIVE
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Announcements, motivation quote & branding
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-[#E5A93C] transition-all" />
          </Link>

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
                Manage Members ({totalMembers})
              </span>
              <span className="text-[11px] text-slate-400">Enroll, remove, freeze & override plans</span>
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

        {/* ============================================================== */}
        {/* MARKETPLACE & SERVICES PRICING EDITOR SECTION                 */}
        {/* ============================================================== */}
        <section id="marketplace-editor" className="space-y-4 pt-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2 py-0.5 rounded-full">
                  Owner Store & Pricing Cockpit
                </span>
                <span className="text-xs text-slate-400">Total: {addOns.length} Services Listed</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#E5A93C]" />
                <span>Marketplace & Services Pricing Editor</span>
              </h2>
              <p className="text-xs text-slate-400 max-w-2xl">
                Edit price (₹) and descriptions for all PT packages, diet plans, and supplements. Changes reflect immediately in the Member App and sync to Supabase.
              </p>
            </div>

            <Link
              href="/owner/manage/addons"
              className="bg-[#171D2B] hover:bg-[#1E2538] border border-[#2B354C] hover:border-[#E5A93C] text-xs font-bold text-[#E5A93C] px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Full Inventory & Add New</span>
            </Link>
          </div>

          {/* Toast Notification */}
          {addonSaveSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{addonSaveSuccess}</span>
            </div>
          )}

          {/* Category Filter Tabs (Matching the Member App Marketplace) */}
          <div className="flex rounded-2xl bg-[#121622] p-1.5 border border-[#232B3E] overflow-x-auto gap-1">
            <button
              type="button"
              onClick={() => setMarketplaceFilter('all')}
              className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                marketplaceFilter === 'all'
                  ? 'bg-[#E5A93C] text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>All Services</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 font-mono">
                {addOns.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMarketplaceFilter('pt')}
              className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                marketplaceFilter === 'pt'
                  ? 'bg-[#E5A93C] text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>PT Packages</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 font-mono">
                {addOns.filter((a) => a.type === 'pt').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMarketplaceFilter('diet')}
              className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                marketplaceFilter === 'diet'
                  ? 'bg-[#E5A93C] text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Salad className="w-3.5 h-3.5" />
              <span>Diet Plans</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 font-mono">
                {addOns.filter((a) => a.type === 'diet').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMarketplaceFilter('supplement')}
              className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                marketplaceFilter === 'supplement'
                  ? 'bg-[#E5A93C] text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Supplements</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 font-mono">
                {addOns.filter((a) => a.type === 'supplement').length}
              </span>
            </button>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns
              .filter((item) => {
                if (marketplaceFilter === 'all') return true;
                return item.type === marketplaceFilter;
              })
              .map((item) => {
                const isEditing = editingAddonId === item.id;
                const isSupp = item.type === 'supplement';
                const isPT = item.type === 'pt';
                const isDiet = item.type === 'diet';

                if (isEditing) {
                  return (
                    /* EDITING MODE FORM */
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-[#141A28] border-2 border-[#E5A93C] space-y-4 shadow-2xl animate-in fade-in"
                    >
                      <div className="flex items-center justify-between border-b border-[#243046] pb-2.5">
                        <span className="text-xs font-black text-[#E5A93C] uppercase tracking-wider flex items-center gap-1.5">
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Service Details</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingAddonId(null)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Service / Item Name */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                            Name / Title
                          </label>
                          <input
                            type="text"
                            value={addonEditName}
                            onChange={(e) => setAddonEditName(e.target.value)}
                            className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs font-bold text-white focus:outline-none"
                            required
                          />
                        </div>

                        {/* Price (₹) & Validity (Days) */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider mb-1">
                              Price (₹)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                              <input
                                type="number"
                                value={addonEditPrice}
                                onChange={(e) => setAddonEditPrice(Number(e.target.value))}
                                className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 pl-6 pr-3 text-sm font-mono font-black text-[#E5A93C] focus:outline-none"
                                min={0}
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                              Validity (Days)
                            </label>
                            <input
                              type="number"
                              value={addonEditValidity}
                              onChange={(e) => setAddonEditValidity(Number(e.target.value))}
                              className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs font-mono text-white focus:outline-none"
                              min={1}
                              required
                            />
                          </div>
                        </div>

                        {/* Trainer (if PT/Diet) or Stock (if Supplement) */}
                        {isSupp ? (
                          <div>
                            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                              Physical Counter Stock (Units)
                            </label>
                            <input
                              type="number"
                              value={addonEditStock}
                              onChange={(e) => setAddonEditStock(Number(e.target.value))}
                              className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                              min={0}
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                              Assigned Coach / Specialist
                            </label>
                            <input
                              type="text"
                              value={addonEditTrainer}
                              onChange={(e) => setAddonEditTrainer(e.target.value)}
                              placeholder="e.g. Vikram, Pooja, Rakesh"
                              className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                            />
                          </div>
                        )}

                        {/* Description (Textarea) */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                            Service Description (What members see)
                          </label>
                          <textarea
                            value={addonEditDescription}
                            onChange={(e) => setAddonEditDescription(e.target.value)}
                            rows={3}
                            placeholder="Enter detailed description of sessions, diet chart, or product specs..."
                            className="w-full bg-[#182133] border border-[#2D3C57] focus:border-[#E5A93C] rounded-xl p-2.5 text-xs text-white focus:outline-none leading-relaxed"
                          />
                        </div>

                        {/* Available in Member Store Toggle */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#243046]">
                          <span className="text-xs text-slate-300 font-medium">
                            Active in Member App Store:
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={addonEditAvailable}
                              onChange={(e) => setAddonEditAvailable(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-[#253046] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#243046]">
                        <button
                          type="button"
                          onClick={() => setEditingAddonId(null)}
                          disabled={isSavingAddon}
                          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-[#2C3852] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveAddon(item.id)}
                          disabled={isSavingAddon}
                          className="bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-[#E5A93C]/20 cursor-pointer disabled:opacity-60"
                        >
                          <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>{isSavingAddon ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                /* STANDARD VIEW CARD */
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#2C3852] transition-colors space-y-3.5 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Icon, Title, Price */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2.5 rounded-xl flex-shrink-0 ${
                              isPT
                                ? 'bg-purple-500/15 text-purple-400'
                                : isDiet
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-amber-500/15 text-amber-400'
                            }`}
                          >
                            {isSupp ? (
                              <Package className="w-5 h-5" />
                            ) : isPT ? (
                              <Dumbbell className="w-5 h-5" />
                            ) : (
                              <Salad className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              {item.category_label || (isPT ? 'Personal Training' : isDiet ? 'Nutrition & Diet' : 'Supplements')}
                            </span>
                            <h3 className="text-sm font-extrabold text-white leading-tight mt-0.5">
                              {item.name}
                            </h3>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end flex-shrink-0">
                          <span className="text-lg font-black text-[#E5A93C] font-mono leading-none">
                            ₹{item.price}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded ${
                              item.is_available !== false
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/15 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {item.is_available !== false ? 'Live in App' : 'Paused'}
                          </span>
                        </div>
                      </div>

                      {/* Description Box */}
                      <div className="mt-3 p-3 rounded-xl bg-[#0B0E14]/70 border border-[#1C2333] min-h-[54px]">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                          Description
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {item.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>

                    {/* Meta Row & Action Button */}
                    <div className="pt-2 border-t border-[#1C2333] space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px]">
                          Validity: <strong className="text-slate-200">{item.validity_days} Days</strong>
                        </span>

                        {isSupp ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 text-[11px]">
                              Stock:{' '}
                              <strong className={item.stock > 0 ? 'text-emerald-400' : 'text-red-400'}>
                                {item.stock} Units
                              </strong>
                            </span>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => handleQuickStockUpdate(item.id, -1)}
                                className="w-5 h-5 rounded bg-[#1F2739] hover:bg-[#28324A] text-slate-300 flex items-center justify-center font-bold text-[10px] cursor-pointer"
                                title="Minus 1"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <button
                                onClick={() => handleQuickStockUpdate(item.id, 1)}
                                className="w-5 h-5 rounded bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 flex items-center justify-center font-bold text-[10px] cursor-pointer"
                                title="Add 1"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          item.trainer_name && (
                            <span className="text-slate-400 text-[11px]">
                              Coach: <strong className="text-slate-200">{item.trainer_name}</strong>
                            </span>
                          )
                        )}
                      </div>

                      <button
                        onClick={() => handleStartEditAddon(item)}
                        className="w-full bg-[#182133] hover:bg-[#1E2940] border border-[#2D3C57] hover:border-[#E5A93C] text-[#E5A93C] hover:text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Price & Description</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </main>

      <Footer />
      <OwnerBottomNav />
      <TestChecklistDrawer isOpen={showTests} onClose={() => setShowTests(false)} />
    </div>
  );
}

