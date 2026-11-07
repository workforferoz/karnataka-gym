'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OwnerBottomNav } from '@/components/OwnerBottomNav';
import { ArrowLeft, Check, Edit, Save, Plus, ShieldCheck, Sparkles } from 'lucide-react';

export default function ManagePlansPage() {
  const { plans } = useGym();
  const [plansList, setPlansList] = useState(plans);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleStartEdit = (plan: typeof plans[0]) => {
    setEditingId(plan.id);
    setEditPrice(plan.base_price);
    setEditDiscount(plan.discount_amount);
  };

  const handleSave = (id: string) => {
    setPlansList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, base_price: editPrice, discount_amount: editDiscount } : p
      )
    );
    setEditingId(null);
    setStatusMsg('Plan pricing updated successfully!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/owner/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2.5 py-0.5 rounded-full">
            Membership Tiers
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">Manage Membership Plans</h1>
          <p className="text-xs text-slate-400">
            Configure base prices, early renewal discounts, and promotional tags for Karnataka Gym.
          </p>
        </div>

        {statusMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-bold">
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plansList.map((plan) => {
            const isEditing = editingId === plan.id;
            const effective = isEditing ? editPrice - editDiscount : plan.base_price - plan.discount_amount;

            return (
              <div
                key={plan.id}
                className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-white">{plan.name}</h3>
                    <span className="text-xs text-slate-400">
                      Duration: {plan.duration_months} Months
                    </span>
                  </div>
                  {plan.tag && (
                    <span className="text-[9px] font-bold uppercase bg-[#E5A93C] text-slate-950 px-2 py-0.5 rounded-full">
                      {plan.tag}
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3 pt-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Base Price (₹):
                      </label>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full bg-[#181F2F] border border-[#2D3950] rounded-xl p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        Renewal Discount (₹):
                      </label>
                      <input
                        type="number"
                        value={editDiscount}
                        onChange={(e) => setEditDiscount(Number(e.target.value))}
                        className="w-full bg-[#181F2F] border border-[#2D3950] rounded-xl p-2 text-white font-mono"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-1.5 rounded-lg border border-[#2A354C] text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(plan.id)}
                        className="flex-1 py-1.5 rounded-lg bg-[#E5A93C] text-slate-950 font-bold text-xs"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between pt-2 border-t border-[#1C2333]">
                      <span className="text-xs text-slate-400">Effective Amount:</span>
                      <span className="text-xl font-black text-[#E5A93C] font-mono">
                        ₹{effective}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex justify-between">
                      <span>Base: ₹{plan.base_price}</span>
                      <span>Discount: -₹{plan.discount_amount}</span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleStartEdit(plan)}
                        className="flex items-center gap-1 text-xs text-[#E5A93C] hover:underline cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Pricing</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
      <OwnerBottomNav />
    </div>
  );
}
