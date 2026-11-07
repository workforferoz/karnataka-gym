'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OwnerBottomNav } from '@/components/OwnerBottomNav';
import { ArrowLeft, Package, Dumbbell, Salad, Plus, Minus, CheckCircle, Edit, Save } from 'lucide-react';

export default function ManageAddOnsPage() {
  const { addOns } = useGym();
  const [items, setItems] = useState(addOns);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const updateStock = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stock: Math.max(0, a.stock + delta) } : a))
    );
    setStatusMsg('Stock count updated!');
    setTimeout(() => setStatusMsg(null), 2500);
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
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/40 border border-purple-800 px-2.5 py-0.5 rounded-full">
            Inventory & Add-ons
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">Manage Add-Ons & Supplement Inventory</h1>
          <p className="text-xs text-slate-400">
            Control personal training sessions, nutrition packages, and Hubballi counter stock.
          </p>
        </div>

        {statusMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-bold">
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const isSupp = item.type === 'supplement';
            const isPT = item.type === 'pt';

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#1F2739] text-[#E5A93C]">
                      {isSupp ? <Package className="w-5 h-5" /> : isPT ? <Dumbbell className="w-5 h-5" /> : <Salad className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white">{item.name}</h3>
                      <span className="text-[10px] text-slate-400 block">
                        Category: {item.category_label} • Validity: {item.validity_days}d
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-black text-[#E5A93C] font-mono">
                    ₹{item.price}
                  </span>
                </div>

                {item.trainer_name && (
                  <div className="text-xs text-slate-300">
                    Trainer: <strong className="text-white">{item.trainer_name}</strong>
                  </div>
                )}

                {/* Supplement stock controller */}
                {isSupp && (
                  <div className="pt-2 border-t border-[#1C2333] flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Physical Stock: <strong className={item.stock > 0 ? 'text-emerald-400' : 'text-red-400'}>{item.stock} Units</strong>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateStock(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-[#1F2739] hover:bg-[#28324A] text-slate-300 flex items-center justify-center font-bold text-xs cursor-pointer"
                        title="Decrement stock"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateStock(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 flex items-center justify-center font-bold text-xs cursor-pointer"
                        title="Increment stock"
                      >
                        <Plus className="w-3.5 h-3.5" />
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
