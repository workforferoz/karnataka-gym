'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OwnerBottomNav } from '@/components/OwnerBottomNav';
import {
  UserCheck,
  Search,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export default function AssistedCheckinPage() {
  const { users, memberships, recordCheckin, currentUser, auditLogs } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [assistedReason, setAssistedReason] = useState('Forgot phone at home');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const members = users.filter((u) => u.role === 'member');
  const filtered = members.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.phone.includes(q);
  });

  const handleExecuteCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Pehle ek member select karein.');
      return;
    }

    const finalReason = assistedReason === 'Other' ? customReason : assistedReason;
    if (!finalReason || finalReason.trim().length === 0) {
      setResultMessage({
        success: false,
        message: 'Mandatory reason required for assisted front desk check-in!'
      });
      return;
    }

    setIsSubmitting(true);
    setResultMessage(null);

    try {
      const res = await recordCheckin(selectedUser.id, 'assisted', finalReason);
      setResultMessage(res);
      if (res.success) {
        setSearchQuery('');
        setSelectedUser(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const recentAssistedAudits = auditLogs
    .filter((a) => a.action === 'assisted_checkin')
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-6 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/owner/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2.5 py-0.5 rounded-full">
            Front Desk Override
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-extrabold text-white">Assisted / Manual Check-in</h1>
          <p className="text-xs text-slate-400">
            Front desk check-in for members with phone battery issues, camera malfunction, or card loss. Mandatory reason logged to Audit Trail.
          </p>
        </div>

        {/* Result Toast */}
        {resultMessage && (
          <div
            className={`p-4 rounded-2xl border-2 text-xs font-semibold flex items-start gap-2.5 animate-in zoom-in-95 duration-150 ${
              resultMessage.success
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : 'bg-red-950/80 border-red-500 text-red-200'
            }`}
          >
            {resultMessage.success ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <div className="space-y-0.5">
              <span className="font-bold block uppercase text-[10px]">
                {resultMessage.success ? 'Assisted Check-in Recorded' : 'Action Rejected'}
              </span>
              <span>{resultMessage.message}</span>
            </div>
          </div>
        )}

        {/* Member Selector Form */}
        <form onSubmit={handleExecuteCheckin} className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#121622] border border-[#232B3E] space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Step 1: Select Member
            </label>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search member name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-[#E5A93C] rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Member picker list */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 pt-1 text-xs">
              {filtered.slice(0, 10).map((m) => {
                const isSelected = selectedUser?.id === m.id;
                const mem = memberships.find((mb) => mb.user_id === m.id);

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedUser(m)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-white font-bold'
                        : 'bg-[#181F2F] border-[#222A3C] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">{m.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">+91 {m.phone}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Exp: {mem?.expiry_date || 'N/A'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mandatory Reason Card */}
          <div className="p-4 rounded-3xl bg-[#121622] border border-[#232B3E] space-y-3 text-xs">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Step 2: Mandatory Audit Reason
            </label>

            <select
              value={assistedReason}
              onChange={(e) => setAssistedReason(e.target.value)}
              className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-[#E5A93C] rounded-xl p-2.5 text-white focus:outline-none"
              required
            >
              <option value="Forgot phone at home">Forgot phone at home</option>
              <option value="QR camera scanner issue">QR camera scanner issue</option>
              <option value="Phone battery completely dead">Phone battery completely dead</option>
              <option value="Fingerprint / Turnstile failed">Fingerprint / Turnstile failed</option>
              <option value="Other">Other Custom Reason</option>
            </select>

            {assistedReason === 'Other' && (
              <div>
                <input
                  type="text"
                  placeholder="Enter specific mandatory reason..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-[#E5A93C] rounded-xl p-2.5 text-white focus:outline-none"
                  required
                />
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-[#161C2C] p-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Staff Actor: <strong className="text-white">{currentUser.name}</strong> • Immutable Audit Trail
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedUser || isSubmitting}
            className="w-full bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] hover:from-[#d89e34] hover:to-[#e08f06] text-slate-950 font-black py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#E5A93C]/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4 stroke-[2.5]" />
            <span>
              {selectedUser ? `Check-In "${selectedUser.name}"` : 'Select Member First'}
            </span>
          </button>
        </form>

        {/* Recent Assisted Check-in Audit Logs */}
        <div className="p-4 rounded-3xl bg-[#121622] border border-[#232B3E] space-y-3 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-[#1E2638] pb-1.5">
            Recent Assisted Check-in Audit Logs ({recentAssistedAudits.length})
          </span>

          <div className="space-y-2">
            {recentAssistedAudits.length === 0 ? (
              <span className="text-slate-500 italic block">No assisted logs yet.</span>
            ) : (
              recentAssistedAudits.map((log) => {
                const target = users.find((u) => u.id === log.target_user_id);
                const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-[#171D2B] border border-[#222A3C] flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        {target?.name || log.target_user_id}
                      </span>
                      <span className="text-[10px] text-slate-400 italic">
                        Reason: &quot;{log.reason}&quot;
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{timeStr}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Footer />
      <OwnerBottomNav />
    </div>
  );
}

