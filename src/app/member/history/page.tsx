'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MemberBottomNav } from '@/components/MemberBottomNav';
import {
  Calendar,
  Clock,
  ArrowLeft,
  QrCode,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Filter,
  Flame,
  Award
} from 'lucide-react';

export default function MemberHistoryPage() {
  const { currentUser, attendance, streaks } = useGym();
  const [filterMethod, setFilterMethod] = useState<'all' | 'qr' | 'assisted'>('all');

  const userAttendance = attendance.filter((a) => a.user_id === currentUser.id);
  const streak = streaks.find((s) => s.user_id === currentUser.id);

  const filtered = userAttendance.filter((a) => {
    if (filterMethod === 'all') return true;
    return a.method === filterMethod;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-5 space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/member/home"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mera Home</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Attendance Log
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-extrabold text-white">Workout & Check-in History</h1>
          <p className="text-xs text-slate-400">
            Apka complete workout attendance record with timestamp and entry method.
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-[#121622] border border-[#232B3E] text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Workouts</span>
            <span className="text-lg font-black text-white mt-0.5 block">
              {userAttendance.filter((a) => a.status === 'valid').length}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#121622] border border-[#232B3E] text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Streak</span>
            <span className="text-lg font-black text-amber-400 mt-0.5 block flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400" />
              {streak?.current_streak || 0}d
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-[#121622] border border-[#232B3E] text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Best Streak</span>
            <span className="text-lg font-black text-[#E5A93C] mt-0.5 block flex items-center justify-center gap-1">
              <Award className="w-4 h-4" />
              {streak?.highest_streak || 0}d
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between border-b border-[#1F2739] pb-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-300">Filter By:</span>
          </div>
          <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-xl border border-[#232B3E]">
            <button
              onClick={() => setFilterMethod('all')}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterMethod === 'all'
                  ? 'bg-[#E5A93C] text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({userAttendance.length})
            </button>
            <button
              onClick={() => setFilterMethod('qr')}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterMethod === 'qr'
                  ? 'bg-[#E5A93C] text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              QR Scans
            </button>
            <button
              onClick={() => setFilterMethod('assisted')}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterMethod === 'assisted'
                  ? 'bg-[#E5A93C] text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Assisted Desk
            </button>
          </div>
        </div>

        {/* Attendance List */}
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No attendance records found</h3>
              <p className="text-xs text-slate-400">
                Pehle check-in karein entry register karne ke liye.
              </p>
              <Link
                href="/member/check-in"
                className="inline-block bg-[#E5A93C] text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl mt-2"
              >
                Go to QR Check-in
              </Link>
            </div>
          ) : (
            filtered.map((att) => {
              const checkinDate = new Date(att.check_in_time);
              const dateStr = checkinDate.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
              const timeStr = checkinDate.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              });

              const isDuplicate = att.status === 'duplicate';
              const isAssisted = att.method === 'assisted';

              return (
                <div
                  key={att.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                    isDuplicate
                      ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                      : 'bg-[#121622] border-[#202738] text-white hover:border-[#2E3A52]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isDuplicate
                          ? 'bg-amber-500/20 text-amber-400'
                          : isAssisted
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {isDuplicate ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : isAssisted ? (
                        <UserCheck className="w-5 h-5" />
                      ) : (
                        <QrCode className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{dateStr}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            isDuplicate
                              ? 'bg-amber-500/20 text-amber-400'
                              : isAssisted
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {isDuplicate ? 'Duplicate' : isAssisted ? 'Front Desk' : 'QR Scan'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {timeStr}
                        {att.notes && <span className="text-slate-400 italic">• {att.notes}</span>}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-xs font-bold ${
                        isDuplicate ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {isDuplicate ? 'Cooldown' : 'Present ✓'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
      <MemberBottomNav />
    </div>
  );
}
