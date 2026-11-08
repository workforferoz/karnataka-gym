'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OwnerBottomNav } from '@/components/OwnerBottomNav';
import {
  Users,
  Search,
  Plus,
  Edit,
  Pause,
  Play,
  ShieldAlert,
  ArrowLeft,
  X,
  CheckCircle,
  Clock,
  Sparkles,
  Calendar,
  UserCheck
} from 'lucide-react';

export default function ManageMembersPage() {
  const {
    users,
    memberships,
    plans,
    addOns,
    updateUserProfile,
    freezeMembership,
    unfreezeMembership,
    ownerOverrideMemberPlan
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [freezeModalUser, setFreezeModalUser] = useState<typeof users[0] | null>(null);
  const [freezeReason, setFreezeReason] = useState('Medical rest / doctor advice');
  const [overrideDiet, setOverrideDiet] = useState('');
  const [overrideTrainer, setOverrideTrainer] = useState('');
  const [overridePlanId, setOverridePlanId] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const membersOnly = users.filter((u) => u.role === 'member');

  const filtered = membersOnly.filter((m) => {
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.phone.includes(q);
  });

  const handleOpenEdit = (user: typeof users[0]) => {
    setSelectedUser(user);
    const userMem = memberships.find((m) => m.user_id === user.id);
    setOverrideDiet(user.active_diet_plan || 'None');
    setOverrideTrainer(user.assigned_trainer || 'Vikram');
    setOverridePlanId(userMem?.plan_id || 'plan_quarterly');
    setIsEditing(true);
    setStatusMsg(null);
  };

  const handleSaveOverrides = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const res = await ownerOverrideMemberPlan(
      selectedUser.id,
      overridePlanId,
      overrideDiet === 'None' ? undefined : overrideDiet,
      overrideTrainer,
      'Administrative update by Owner Manjunath'
    );

    setStatusMsg(res.message);
    setTimeout(() => {
      setIsEditing(false);
      setStatusMsg(null);
    }, 1500);
  };

  const handleConfirmFreeze = async () => {
    if (!freezeModalUser) return;
    const res = await freezeMembership(freezeModalUser.id, freezeReason);
    setFreezeModalUser(null);
    setStatusMsg(res.message);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleUnfreeze = async (userId: string) => {
    const res = await unfreezeMembership(userId);
    setStatusMsg(res.message);
    setTimeout(() => setStatusMsg(null), 3000);
  };

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
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2.5 py-0.5 rounded-full">
            Full Member CRUD
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-white">Manage Gym Members ({membersOnly.length})</h1>
            <p className="text-xs text-slate-400">
              Adjust active plans, freeze memberships without breaking streaks, and override diets.
            </p>
          </div>
        </div>

        {/* Global Status Message */}
        {statusMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by member name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121622] border border-[#232B3E] focus:border-[#E5A93C] rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Members Table */}
        <div className="bg-[#121622] border border-[#232B3E] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#171D2B] text-slate-400 font-bold border-b border-[#232B3E]">
                <tr>
                  <th className="py-3 px-4">Member Name & Contact</th>
                  <th className="py-3 px-3">Active Plan</th>
                  <th className="py-3 px-3">Expiry Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Assigned Coach</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2536]">
                {filtered.map((user) => {
                  const mem = memberships.find((m) => m.user_id === user.id);
                  const plan = plans.find((p) => p.id === mem?.plan_id);
                  const isFrozen = mem?.status === 'frozen';
                  const isExpired = mem?.status === 'expired';

                  return (
                    <tr key={user.id} className="hover:bg-[#182030] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-white">{user.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">+91 {user.phone}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-200">
                          {plan?.name || 'Standard Plan'}
                        </span>
                        {user.active_diet_plan && (
                          <span className="block text-[10px] text-emerald-400">
                            Diet: {user.active_diet_plan}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-300">
                        {mem?.expiry_date || 'N/A'}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isFrozen
                              ? 'bg-blue-950 text-blue-300 border border-blue-700'
                              : isExpired
                              ? 'bg-red-950 text-red-300 border border-red-700'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          }`}
                        >
                          {isFrozen ? 'Frozen' : isExpired ? 'Expired' : 'Active'}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-semibold text-amber-400">
                        {user.assigned_trainer || 'Vikram'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isFrozen ? (
                            <button
                              onClick={() => handleUnfreeze(user.id)}
                              className="p-1.5 bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 rounded-lg border border-blue-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              title="Unfreeze Membership"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Unfreeze</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setFreezeModalUser(user)}
                              className="p-1.5 bg-[#1F2739] hover:bg-[#28324A] text-slate-300 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              title="Pause / Freeze Membership (Preserves Streak)"
                            >
                              <Pause className="w-3.5 h-3.5 text-blue-400" />
                              <span className="hidden sm:inline">Freeze</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(user)}
                            className="p-1.5 bg-[#E5A93C]/15 hover:bg-[#E5A93C]/30 text-[#E5A93C] rounded-lg border border-[#E5A93C]/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            title="Edit Plan & Add-ons"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit / Override Member Drawer/Modal */}
        {isEditing && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-[#121622] border-2 border-[#E5A93C] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                <div>
                  <h3 className="text-sm font-black text-white">Owner Override: {selectedUser.name}</h3>
                  <span className="text-xs text-slate-400">+91 {selectedUser.phone}</span>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveOverrides} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Change Plan Tier:
                  </label>
                  <select
                    value={overridePlanId}
                    onChange={(e) => setOverridePlanId(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2D3950] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#E5A93C]"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.base_price - p.discount_amount} / {p.duration_months} mo)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Override Active Diet Plan:
                  </label>
                  <select
                    value={overrideDiet}
                    onChange={(e) => setOverrideDiet(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2D3950] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#E5A93C]"
                  >
                    <option value="None">None</option>
                    <option value="Weight-Loss Diet Plan">Weight-Loss Diet Plan (Pooja)</option>
                    <option value="Muscle Gain Diet Plan">Muscle Gain Diet Plan (Vikram)</option>
                    <option value="Veg High-Protein Nutrition Guide">Veg High-Protein Nutrition Guide (Pooja)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Override Assigned Personal Trainer:
                  </label>
                  <select
                    value={overrideTrainer}
                    onChange={(e) => setOverrideTrainer(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2D3950] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#E5A93C]"
                  >
                    <option value="Vikram">Coach Vikram (Strength Specialist)</option>
                    <option value="Pooja">Coach Pooja (Functional & HIIT)</option>
                    <option value="Rakesh">Coach Rakesh (Hypertrophy)</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1A2234] border border-[#2E3C57] text-[11px] text-slate-300">
                  <span className="text-[#E5A93C] font-bold block mb-0.5">Audit Log Notice:</span>
                  This modification will create an immutable log in <strong className="text-white">AuditLogs</strong> linked to your Owner account.
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#2B354B] text-slate-400 font-semibold text-xs hover:bg-[#1A202E]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-[#E5A93C]/20 active:scale-95 transition-all"
                  >
                    Apply & Log Audit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Freeze Modal */}
        {freezeModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-[#121622] border-2 border-blue-500 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400">
                  <Pause className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Pause / Freeze Membership</h3>
                  <span className="text-xs text-slate-400">{freezeModalUser.name}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Freezing temporarily pauses the membership clock. <strong>Important: The user&apos;s workout streak will NOT be broken!</strong>
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Freeze Reason (Mandatory):
                </label>
                <input
                  type="text"
                  value={freezeReason}
                  onChange={(e) => setFreezeReason(e.target.value)}
                  className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-blue-400 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setFreezeModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#2B354B] text-slate-400 font-semibold text-xs hover:bg-[#1A202E]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmFreeze}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-950/40"
                >
                  Confirm Freeze
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <OwnerBottomNav />
    </div>
  );
}

