'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useGym } from '@/lib/store';
import { User } from '@/types/database';
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
  UserCheck,
  UserPlus,
  Trash2,
  AlertTriangle,
  Flame,
  Phone,
  Filter
} from 'lucide-react';

function ManageMembersContent() {
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get('filter'); // 'active' | 'expiring' | 'frozen' | null

  const {
    users,
    memberships,
    plans,
    addOns,
    updateUserProfile,
    freezeMembership,
    unfreezeMembership,
    ownerOverrideMemberPlan,
    createMember,
    deleteMember
  } = useGym();

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'expiring' | 'frozen'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Sync activeFilter with URL parameter
  useEffect(() => {
    if (urlFilter === 'active' || urlFilter === 'expiring' || urlFilter === 'frozen') {
      setActiveFilter(urlFilter);
    }
  }, [urlFilter]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addPlanId, setAddPlanId] = useState(plans[0]?.id || 'plan_quarterly');
  const [addTrainer, setAddTrainer] = useState('Vikram');
  const [addDiet, setAddDiet] = useState('None');
  const [addEmergencyPhone, setAddEmergencyPhone] = useState('9902667407');
  const [addCommPref, setAddCommPref] = useState<'whatsapp' | 'sms' | 'call'>('whatsapp');
  const [addError, setAddError] = useState<string | null>(null);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  const [deleteModalUser, setDeleteModalUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [overrideDiet, setOverrideDiet] = useState('');
  const [overrideTrainer, setOverrideTrainer] = useState('');
  const [overridePlanId, setOverridePlanId] = useState('');

  const [freezeModalUser, setFreezeModalUser] = useState<User | null>(null);
  const [freezeReason, setFreezeReason] = useState('Medical rest / doctor advice');

  const today = new Date();
  const membersOnly = users.filter((u) => u.role === 'member');

  // Filter Counts
  const activeCount = membersOnly.filter((u) => {
    const m = memberships.find((mem) => mem.user_id === u.id);
    return m?.status === 'active';
  }).length;

  const expiringCount = membersOnly.filter((u) => {
    const m = memberships.find((mem) => mem.user_id === u.id);
    if (!m || m.status !== 'active') return false;
    const exp = new Date(m.expiry_date);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).length;

  const frozenCount = membersOnly.filter((u) => {
    const m = memberships.find((mem) => mem.user_id === u.id);
    return m?.status === 'frozen';
  }).length;

  // Filtered members list
  const filtered = membersOnly.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.phone.includes(q);
    if (!matchesSearch) return false;

    const mem = memberships.find((x) => x.user_id === m.id);

    if (activeFilter === 'active') {
      return mem?.status === 'active';
    }
    if (activeFilter === 'expiring') {
      if (!mem || mem.status !== 'active') return false;
      const exp = new Date(mem.expiry_date);
      const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0;
    }
    if (activeFilter === 'frozen') {
      return mem?.status === 'frozen';
    }
    return true;
  });

  // Action Handlers
  const handleOpenAdd = () => {
    setAddError(null);
    setAddName('');
    setAddPhone('');
    setAddPlanId(plans[0]?.id || 'plan_quarterly');
    setAddTrainer('Vikram');
    setAddDiet('None');
    setAddEmergencyPhone('9902667407');
    setAddCommPref('whatsapp');
    setIsAddModalOpen(true);
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setIsSubmittingAdd(true);

    const res = await createMember({
      name: addName,
      phone: addPhone,
      planId: addPlanId,
      assignedTrainer: addTrainer,
      dietPlan: addDiet === 'None' ? undefined : addDiet,
      emergencyContact: addEmergencyPhone,
      commPreference: addCommPref
    });

    setIsSubmittingAdd(false);
    if (!res.success) {
      setAddError(res.message);
      return;
    }

    setStatusMsg(res.message);
    setIsAddModalOpen(false);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalUser) return;
    setIsDeleting(true);
    const res = await deleteMember(deleteModalUser.id);
    setIsDeleting(false);
    setDeleteModalUser(null);
    setStatusMsg(res.message);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    const userMem = memberships.find((m) => m.user_id === user.id);
    setOverrideDiet(user.active_diet_plan || 'None');
    setOverrideTrainer(user.assigned_trainer || 'Vikram');
    setOverridePlanId(userMem?.plan_id || plans[0]?.id || 'plan_quarterly');
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
      'Administrative update by Owner Riyaz'
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
        {/* Top Breadcrumb & Badge */}
        <div className="flex items-center justify-between">
          <Link
            href="/owner/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2.5 py-0.5 rounded-full">
            Full Member CRUD • Supabase Live
          </span>
        </div>

        {/* Title & Primary Add Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-[#E5A93C]" />
              <span>Gym Members Directory ({membersOnly.length})</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Enroll new gym members, remove obsolete profiles, freeze memberships, or update workout plans.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-[#E5A93C]/20 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer flex-shrink-0"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Enroll New Member</span>
          </button>
        </div>

        {/* Global Status Banner */}
        {statusMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Filter Pills & Quick Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#E5A93C] text-slate-950 shadow-md shadow-[#E5A93C]/20'
                : 'bg-[#121622] text-slate-400 border border-[#232B3E] hover:text-white'
            }`}
          >
            <span>All Members</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{membersOnly.length}</span>
          </button>

          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeFilter === 'active'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-[#121622] text-slate-400 border border-[#232B3E] hover:text-white'
            }`}
          >
            <span>Active Plan</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{activeCount}</span>
          </button>

          <button
            onClick={() => setActiveFilter('expiring')}
            className={`px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeFilter === 'expiring'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-[#121622] text-slate-400 border border-[#232B3E] hover:text-white'
            }`}
          >
            <span>Expiring (7d)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{expiringCount}</span>
          </button>

          <button
            onClick={() => setActiveFilter('frozen')}
            className={`px-3.5 py-1.5 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeFilter === 'frozen'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/20'
                : 'bg-[#121622] text-slate-400 border border-[#232B3E] hover:text-white'
            }`}
          >
            <span>Frozen</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">{frozenCount}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by member name, phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121622] border border-[#232B3E] focus:border-[#E5A93C] rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
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
                  <th className="py-3 px-4 text-right">Owner Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2536]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No members match the current filter or search criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => {
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
                              title="Edit Plan, Diet & Trainer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>

                            <button
                              onClick={() => setDeleteModalUser(user)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg border border-red-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Delete Member from Register"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL 1: ADD / ENROLL NEW MEMBER */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-[#121622] border-2 border-[#E5A93C] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#E5A93C] flex items-center justify-center">
                    <UserPlus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Enroll New Gym Member</h3>
                    <p className="text-[11px] text-slate-400">Creates profile, initializes streak & syncs to Supabase</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1A2234]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {addError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <form onSubmit={handleAddMemberSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-[#E5A93C] rounded-xl p-2.5 text-white focus:outline-none placeholder-slate-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    10-Digit Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={addPhone}
                      onChange={(e) => setAddPhone(e.target.value)}
                      className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-[#E5A93C] rounded-xl p-2.5 pl-11 text-white focus:outline-none placeholder-slate-500 font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Membership Plan *
                    </label>
                    <select
                      value={addPlanId}
                      onChange={(e) => setAddPlanId(e.target.value)}
                      className="w-full bg-[#181F2F] border border-[#2D3950] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#E5A93C]"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.duration_months} mo • ₹{p.base_price - p.discount_amount})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Assigned Coach
                    </label>
                    <select
                      value={addTrainer}
                      onChange={(e) => setAddTrainer(e.target.value)}
                      className="w-full bg-[#181F2F] border border-[#2D3950] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#E5A93C]"
                    >
                      <option value="Vikram">Coach Vikram (Strength Specialist)</option>
                      <option value="Pooja">Coach Pooja (Functional & HIIT)</option>
                      <option value="Rakesh">Coach Rakesh (Hypertrophy)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Active Diet Chart
                    </label>
                    <select
                      value={addDiet}
                      onChange={(e) => setAddDiet(e.target.value)}
                      className="w-full bg-[#181F2F] border border-[#2D3950] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#E5A93C]"
                    >
                      <option value="None">None</option>
                      <option value="Weight-Loss Diet Plan">Weight-Loss Diet Plan</option>
                      <option value="Muscle Gain Diet Plan">Muscle Gain Diet Plan</option>
                      <option value="Veg High-Protein Nutrition Guide">Veg High-Protein Nutrition Guide</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      Communication Channel
                    </label>
                    <select
                      value={addCommPref}
                      onChange={(e) => setAddCommPref(e.target.value as 'whatsapp' | 'sms' | 'call')}
                      className="w-full bg-[#181F2F] border border-[#2D3950] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#E5A93C]"
                    >
                      <option value="whatsapp">WhatsApp (Instant Updates)</option>
                      <option value="sms">SMS Text Alert</option>
                      <option value="call">Phone Call Preferred</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    Emergency Contact Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">
                      +91
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9902667407"
                      value={addEmergencyPhone}
                      onChange={(e) => setAddEmergencyPhone(e.target.value)}
                      className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-[#E5A93C] rounded-xl p-2.5 pl-11 text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#1A2234] border border-[#2E3C57] text-[11px] text-slate-300 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#E5A93C] flex-shrink-0 mt-0.5" />
                  <span>
                    New member will be assigned a QR check-in key, an active membership record with calculated expiry date, and zero streak counter initialized.
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#2B354B] text-slate-400 font-semibold text-xs hover:bg-[#1A202E]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAdd}
                    className="flex-1 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-[#E5A93C]/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAdd ? (
                      <span>Enrolling...</span>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Confirm Enrollment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: CONFIRM DELETE MEMBER */}
        {deleteModalUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-[#121622] border-2 border-red-500 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <Trash2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Remove Gym Member</h3>
                  <span className="text-xs text-red-300 font-mono">+91 {deleteModalUser.phone}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-slate-300 space-y-2">
                <p>
                  Are you sure you want to permanently delete <strong className="text-white font-extrabold">{deleteModalUser.name}</strong> from the gym register?
                </p>
                <ul className="list-disc pl-4 text-[11px] text-red-300 space-y-1">
                  <li>Active membership & plan removed</li>
                  <li>Attendance check-in history deleted</li>
                  <li>Workout streak records deleted</li>
                  <li>Audit trail permanently recorded</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#2B354B] text-slate-400 font-semibold text-xs hover:bg-[#1A202E]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-950/50 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span>Removing...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm Remove</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: EDIT / OVERRIDE MEMBER */}
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
                    className="flex-1 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-[#E5A93C]/20 active:scale-95 transition-all cursor-pointer"
                  >
                    Apply & Log Audit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: FREEZE / PAUSE MEMBERSHIP */}
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
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-950/40 cursor-pointer"
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

export default function ManageMembersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center">Loading Members Register...</div>}>
      <ManageMembersContent />
    </Suspense>
  );
}
