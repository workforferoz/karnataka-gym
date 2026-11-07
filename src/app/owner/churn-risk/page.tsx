'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OwnerBottomNav } from '@/components/OwnerBottomNav';
import { FollowUpOutcome } from '@/types/database';
import {
  AlertTriangle,
  Phone,
  MessageSquare,
  CheckCircle,
  Calendar,
  User,
  ArrowLeft,
  X,
  Search,
  Filter,
  Sparkles,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function ChurnRiskPage() {
  const { users, noShowCases, memberships, plans, markFollowUpOutcome, attendance } = useGym();

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<FollowUpOutcome>('Will return');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'open' | 'resolved' | 'all'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepare table data
  const casesWithDetails = noShowCases.map((caseItem) => {
    const user = users.find((u) => u.id === caseItem.user_id);
    const membership = memberships.find((m) => m.user_id === caseItem.user_id);
    const plan = plans.find((p) => p.id === membership?.plan_id);

    // Calculate last check-in
    const userAtt = attendance
      .filter((a) => a.user_id === caseItem.user_id && a.status === 'valid')
      .sort((a, b) => new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime());
    const lastCheckinTime = userAtt[0]?.check_in_time;

    return {
      ...caseItem,
      user,
      membership,
      plan,
      lastCheckinTime
    };
  });

  const filteredCases = casesWithDetails.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.user?.name.toLowerCase().includes(q);
      const matchPhone = item.user?.phone.includes(q);
      return matchName || matchPhone;
    }
    return true;
  });

  const handleOpenOutcomeModal = (caseId: string) => {
    setSelectedCaseId(caseId);
    setOutcome('Will return');
    setFollowUpDate('');
    setNotes('');
  };

  const handleSubmitOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) return;
    setIsSubmitting(true);

    try {
      await markFollowUpOutcome(selectedCaseId, outcome, followUpDate, notes);
      setSelectedCaseId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCaseRecord = casesWithDetails.find((c) => c.id === selectedCaseId);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/owner/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-800 px-2.5 py-0.5 rounded-full">
            Silent Churn Detection
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span className="text-red-500">Red-List:</span> Absent Members Rescue
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies members absent for 10+ days before they abandon their fitness journey.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-xl border border-[#232B3E]">
            <button
              onClick={() => setFilterStatus('open')}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === 'open' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Open Cases ({casesWithDetails.filter((c) => c.status === 'open').length})
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === 'resolved' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Resolved ({casesWithDetails.filter((c) => c.status === 'resolved').length})
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === 'all' ? 'bg-[#E5A93C] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search absent member by name or mobile number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121622] border border-[#232B3E] focus:border-red-500 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Red-List Cards / Table */}
        <div className="space-y-3">
          {filteredCases.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">No absent members in this filter! 💪</h3>
              <p className="text-xs text-slate-400">
                Hubballi gym attendance discipline is running strong.
              </p>
            </div>
          ) : (
            filteredCases.map((item) => {
              const userName = item.user?.name || 'Gym Member';
              const userPhone = item.user?.phone || '9902667407';
              const planName = item.plan?.name || 'Active Membership';
              const expiryDate = item.membership?.expiry_date || 'N/A';
              const trainer = item.user?.assigned_trainer || 'Vikram';
              const isOpen = item.status === 'open';

              // WhatsApp personalized message deep link
              const waText = encodeURIComponent(
                `Namaste ${userName}! Karnataka Gym Hubballi se Manjunath baat kar raha hoon. Dekha aap ${item.days_absent} dinon se workout par nahi aaye hain. Sab kushal mangal hai na? Aaj sham aaiye, apke liye slot reserved hai! 💪 Call: 9902667407`
              );
              const waLink = `https://wa.me/91${userPhone}?text=${waText}`;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isOpen
                      ? 'bg-gradient-to-r from-[#17141E] via-[#121622] to-[#121622] border-red-900/60 hover:border-red-600'
                      : 'bg-[#121622] border-[#222A3C] opacity-80'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Member Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-white">{userName}</span>
                        <span className="text-xs font-mono text-slate-400">+91 {userPhone}</span>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isOpen ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {isOpen ? `${item.days_absent} Days Absent` : 'Resolved'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-400 pt-1">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Plan Tier:</span>
                          <span className="font-semibold text-slate-200">{planName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Expiry Date:</span>
                          <span className="font-semibold text-slate-200">{expiryDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Assigned Coach:</span>
                          <span className="font-semibold text-amber-400">{trainer}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Case Status:</span>
                          <span className="font-semibold text-slate-200 capitalize">
                            {item.status} {item.resolved_reason ? `(${item.resolved_reason})` : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1F2739]">
                      {/* WhatsApp Deep Link Button */}
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-md shadow-emerald-950/40 transition-transform active:scale-95"
                        title="Send personalized WhatsApp follow-up"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Direct Phone Call Button */}
                      <a
                        href={`tel:${userPhone}`}
                        className="flex items-center gap-1.5 bg-[#1C2333] hover:bg-[#252E42] border border-[#2F3A50] text-slate-200 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                        title="Direct phone call"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
                        <span>Call</span>
                      </a>

                      {/* Mark Outcome Button */}
                      {isOpen && (
                        <button
                          onClick={() => handleOpenOutcomeModal(item.id)}
                          className="flex items-center gap-1.5 bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black text-xs px-3 py-2 rounded-xl shadow-md shadow-[#E5A93C]/20 transition-transform active:scale-95 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Mark Outcome</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Follow-up / Mark Outcome Modal */}
        {selectedCaseId && activeCaseRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-[#121622] border-2 border-red-500/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                <div>
                  <h3 className="text-sm font-black text-white">Record Churn Follow-up</h3>
                  <span className="text-xs text-slate-400">
                    Member: <strong className="text-white">{activeCaseRecord.user?.name}</strong> (+91 {activeCaseRecord.user?.phone})
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCaseId(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitOutcome} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Follow-Up Outcome Reason:
                  </label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value as FollowUpOutcome)}
                    className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-[#E5A93C] rounded-xl p-2.5 text-white focus:outline-none"
                    required
                  >
                    <option value="Will return">Will return (Confirmed returning this week)</option>
                    <option value="Injured">Injured (Recovery ongoing)</option>
                    <option value="Travelling">Travelling (Out of Hubballi)</option>
                    <option value="Timing issue">Timing issue (Work shift problem)</option>
                    <option value="Unhappy">Unhappy (Needs trainer attention)</option>
                    <option value="No response">No response (Phone not reachable)</option>
                    <option value="Cancelled">Cancelled (Requested drop out)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Next Follow-up Date (Optional):
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-[#E5A93C] rounded-xl p-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Owner / Caller Notes:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Spoke to Rahul, he had fever, promises to resume on Monday."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-[#E5A93C] rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCaseId(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#2B354B] text-slate-400 font-semibold text-xs hover:bg-[#1A202E]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
                  >
                    {isSubmitting ? 'Saving...' : 'Save & Update Case'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <OwnerBottomNav />
    </div>
  );
}
