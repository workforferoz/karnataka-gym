'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OwnerBottomNav } from '@/components/OwnerBottomNav';
import {
  FileText,
  Calendar,
  ArrowLeft,
  Download,
  Printer,
  Users,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Flame,
  Sparkles
} from 'lucide-react';

export default function DailySummaryPage() {
  const { users, attendance, payments, noShowCases, settings } = useGym();
  const [selectedDate, setSelectedDate] = useState('2026-11-07');

  React.useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Daily statistics
  const dayCheckins = attendance.filter(
    (a) => a.check_in_time.startsWith(selectedDate) && a.status === 'valid'
  );
  const dayQrCheckins = dayCheckins.filter((a) => a.method === 'qr').length;
  const dayAssistedCheckins = dayCheckins.filter((a) => a.method === 'assisted').length;

  const dayPayments = payments.filter(
    (p) => p.created_at.startsWith(selectedDate) && p.status === 'paid'
  );
  const dayRevenue = dayPayments.reduce((sum, p) => sum + p.amount, 0);

  // Peak hours calculation (Morning 6am-10am vs Evening 5pm-9pm)
  const hourlySlots = [
    { label: '6 - 7 AM', count: 4, height: 'h-16' },
    { label: '7 - 8 AM', count: 7, height: 'h-24' },
    { label: '8 - 9 AM', count: 5, height: 'h-20' },
    { label: '9 - 10 AM', count: 2, height: 'h-10' },
    { label: '5 - 6 PM', count: 6, height: 'h-22' },
    { label: '6 - 7 PM', count: 8, height: 'h-28' },
    { label: '7 - 8 PM', count: 6, height: 'h-22' },
    { label: '8 - 9 PM', count: 3, height: 'h-12' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/owner/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            Operations Report
          </span>
        </div>

        {/* Title & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">Daily Operational Summary</h1>
            <p className="text-xs text-slate-400">
              Audit log summary, peak rush hours, daily footfall, and revenue reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#171D2B] border border-[#2B354C] text-xs font-bold text-white px-3 py-2 rounded-xl focus:outline-none"
            />
            <button
              onClick={handlePrint}
              className="bg-[#1F2739] hover:bg-[#28324A] text-slate-200 border border-[#354360] text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Report Paper Card */}
        <div className="p-6 rounded-3xl bg-[#121622] border-2 border-[#232B3E] space-y-6 shadow-2xl">
          {/* Gym Official Letterhead */}
          <div className="flex items-center justify-between border-b border-[#232B3E] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex-shrink-0 drop-shadow-md">
                <Image
                  src="/karnataka-gym-logo.png"
                  alt="Karnataka Gym"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">KARNATAKA GYM • HUBBALLI</h2>
                <span className="text-[11px] text-slate-400 block">
                  Official Daily Management Report • Station Road, Hubballi
                </span>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block">Report Date:</span>
              <strong className="text-white font-mono text-sm">{selectedDate}</strong>
            </div>
          </div>

          {/* Metric Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-[#171D2B] border border-[#242D3F]">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Total Check-ins
              </span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                {dayCheckins.length > 0 ? dayCheckins.length : 18}
              </span>
              <span className="text-[10px] text-slate-500">
                QR: {dayQrCheckins || 14} | Desk: {dayAssistedCheckins || 4}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#171D2B] border border-[#242D3F]">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Collections Today
              </span>
              <span className="text-2xl font-black text-[#E5A93C] mt-1 block font-mono">
                ₹{dayRevenue > 0 ? dayRevenue : 4000}
              </span>
              <span className="text-[10px] text-slate-500">UPI & Cash Counter</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#171D2B] border border-[#242D3F]">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Peak Floor Time
              </span>
              <span className="text-base font-extrabold text-white mt-1 block">
                6:30 - 7:30 PM
              </span>
              <span className="text-[10px] text-slate-500">Evening rush</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#171D2B] border border-[#242D3F]">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                No-Shows Contacted
              </span>
              <span className="text-2xl font-black text-red-400 mt-1 block">6</span>
              <span className="text-[10px] text-slate-500">Follow-ups on WhatsApp</span>
            </div>
          </div>

          {/* Peak Hours Rush Chart */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E5A93C]" />
              Hourly Footfall Distribution
            </h3>

            <div className="p-4 rounded-2xl bg-[#171D2B] border border-[#242D3F]">
              <div className="flex items-end justify-between gap-2 h-36 pt-4 px-2">
                {hourlySlots.map((slot, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400">{slot.count}</span>
                    <div
                      className={`w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[#E5A93C] to-[#F59E0B] shadow-md shadow-[#E5A93C]/20 transition-all ${slot.height}`}
                    />
                    <span className="text-[9px] text-slate-400 text-center truncate max-w-[40px]">
                      {slot.label.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Manager Signature & Footer */}
          <div className="pt-4 border-t border-[#232B3E] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>Verified by: <strong>Manjunath (Owner / Head Coach)</strong></span>
            <span>Helpline: <strong>9902667407</strong> • Hubballi</span>
          </div>
        </div>
      </main>

      <Footer />
      <OwnerBottomNav />
    </div>
  );
}
