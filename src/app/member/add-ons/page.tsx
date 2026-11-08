'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MemberBottomNav } from '@/components/MemberBottomNav';
import { UpiPaymentModal } from '@/components/UpiPaymentModal';
import {
  ShoppingBag,
  Dumbbell,
  Salad,
  Package,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  User,
  ShieldCheck,
  Clock,
  Zap,
  X
} from 'lucide-react';

export default function MemberAddOnsPage() {
  const { currentUser, addOns, addOnOrders, purchaseAddOn } = useGym();

  const [activeCategory, setActiveCategory] = useState<'all' | 'pt' | 'diet' | 'supplement'>('all');
  const [selectedAddon, setSelectedAddon] = useState<typeof addOns[0] | null>(null);
  const [selectedTrainerOverride, setSelectedTrainerOverride] = useState<string>('');
  const [isBuying, setIsBuying] = useState(false);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const filtered = addOns.filter((a) => {
    if (activeCategory === 'all') return true;
    return a.type === activeCategory;
  });

  const userActiveOrders = addOnOrders.filter((o) => o.user_id === currentUser.id);

  const handleOpenPurchase = (addon: typeof addOns[0]) => {
    setSelectedAddon(addon);
    setSelectedTrainerOverride(addon.trainer_name || 'Vikram');
    setPurchaseResult(null);
  };

  const handleProceedToUpi = () => {
    if (!selectedAddon) return;
    if (selectedAddon.type === 'supplement' && selectedAddon.stock <= 0) {
      setPurchaseResult({
        success: false,
        message: `Stock Unavailable! "${selectedAddon.name}" is out of stock.`
      });
      return;
    }
    if (selectedAddon.type === 'pt' && selectedTrainerOverride === 'Rakesh') {
      setPurchaseResult({
        success: false,
        message: `Booking Conflict! Coach Rakesh is currently fully booked. Please select Vikram or Pooja.`
      });
      return;
    }
    setUpiModalOpen(true);
  };

  const handleUpiSuccess = async (details: { transactionId: string }) => {
    if (!selectedAddon) return;
    setIsBuying(true);
    try {
      const res = await purchaseAddOn(
        currentUser.id,
        selectedAddon.id,
        selectedAddon.type === 'pt' ? selectedTrainerOverride : undefined,
        details.transactionId
      );
      setPurchaseResult(res);
      setUpiModalOpen(false);
      setTimeout(() => {
        setSelectedAddon(null);
      }, 1500);
    } finally {
      setIsBuying(false);
    }
  };

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
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2 py-0.5 rounded-full">
            Transparent Pricing
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-extrabold text-white">Karnataka Gym Marketplace</h1>
          <p className="text-xs text-slate-400">
            Personal Training (PT), Custom Diet Plans & Certified Supplements. No hidden costs.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex rounded-2xl bg-[#121622] p-1.5 border border-[#232B3E]">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#E5A93C] text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Services
          </button>
          <button
            onClick={() => setActiveCategory('pt')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'pt'
                ? 'bg-[#E5A93C] text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PT Packages
          </button>
          <button
            onClick={() => setActiveCategory('diet')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'diet'
                ? 'bg-[#E5A93C] text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Diet Plans
          </button>
          <button
            onClick={() => setActiveCategory('supplement')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'supplement'
                ? 'bg-[#E5A93C] text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Supplements
          </button>
        </div>

        {/* Active Purchased Add-ons Pill (If Any) */}
        {userActiveOrders.length > 0 && (
          <div className="p-3 rounded-2xl bg-[#171D2C] border border-[#2B354C] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Mera Active Add-ons ({userActiveOrders.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {userActiveOrders.map((o) => {
                const add = addOns.find((a) => a.id === o.addon_id);
                return (
                  <span
                    key={o.id}
                    className="text-[11px] bg-[#1F2739] border border-[#2D3850] px-2 py-0.5 rounded-lg text-slate-200"
                  >
                    {add?.name} {o.trainer_name ? `(Coach: ${o.trainer_name})` : ''} • Valid till {o.expiry_date}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Add-ons List */}
        <div className="space-y-3">
          {filtered.map((item) => {
            const isPT = item.type === 'pt';
            const isDiet = item.type === 'diet';
            const isSupp = item.type === 'supplement';
            const isOutOfStock = isSupp && item.stock <= 0;
            const isTrainerConflict = isPT && (item.trainer_name === 'Rakesh' || item.is_available === false);

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] hover:border-[#2E3A52] transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isPT
                          ? 'bg-purple-500/15 text-purple-400'
                          : isDiet
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {isPT ? (
                        <Dumbbell className="w-5 h-5" />
                      ) : isDiet ? (
                        <Salad className="w-5 h-5" />
                      ) : (
                        <Package className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-white leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {item.category_label} • Validity: {item.validity_days} Days
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-base font-black text-white block">
                      ₹{item.price}
                    </span>
                    {isSupp && (
                      <span
                        className={`text-[10px] font-bold block ${
                          item.stock > 0 ? 'text-amber-400' : 'text-red-400'
                        }`}
                      >
                        {item.stock > 0 ? `Stock: ${item.stock} left` : 'Out of Stock'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Trainer tag for PT or Diet */}
                {item.trainer_name && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-[#161B28] px-2.5 py-1 rounded-lg w-fit">
                    <User className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>Assigned Specialist: <strong className="text-white">{item.trainer_name}</strong></span>
                    {isTrainerConflict && (
                      <span className="text-red-400 font-bold ml-1 text-[10px]">(Fully Booked)</span>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-[#1C2333] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Strict exact pricing • No auto-renew
                  </span>
                  <button
                    onClick={() => handleOpenPurchase(item)}
                    className="bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-md shadow-[#E5A93C]/20 transition-transform active:scale-95 cursor-pointer"
                  >
                    Select & Buy
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Purchase Confirmation Modal */}
        {selectedAddon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-[#121622] border-2 border-[#E5A93C] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                <h3 className="text-sm font-black text-white">Confirm Add-on Purchase</h3>
                <button
                  onClick={() => setSelectedAddon(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Message */}
              {purchaseResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold ${
                    purchaseResult.success
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                      : 'bg-red-950/60 border-red-600 text-red-200'
                  }`}
                >
                  {purchaseResult.message}
                </div>
              )}

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Selected Item:</span>
                  <strong className="text-white">{selectedAddon.name}</strong>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Exact Price:</span>
                  <strong className="text-[#E5A93C] font-mono text-sm">₹{selectedAddon.price}</strong>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Validity Duration:</span>
                  <strong className="text-white">{selectedAddon.validity_days} Days</strong>
                </div>

                {selectedAddon.type === 'supplement' && (
                  <div className="flex justify-between text-slate-300">
                    <span>Counter Stock:</span>
                    <strong
                      className={selectedAddon.stock > 0 ? 'text-emerald-400' : 'text-red-400'}
                    >
                      {selectedAddon.stock} units available
                    </strong>
                  </div>
                )}

                {/* Trainer selection for PT */}
                {selectedAddon.type === 'pt' && (
                  <div className="pt-2 border-t border-[#1C2333] space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Select Personal Trainer:
                    </label>
                    <select
                      value={selectedTrainerOverride}
                      onChange={(e) => setSelectedTrainerOverride(e.target.value)}
                      className="w-full bg-[#181F2F] border border-[#2D3950] rounded-xl p-2 text-xs text-white focus:outline-none focus:border-[#E5A93C]"
                    >
                      <option value="Vikram">Coach Vikram (Available)</option>
                      <option value="Pooja">Coach Pooja (Available)</option>
                      <option value="Rakesh">Coach Rakesh (Fully Booked - Conflict)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setSelectedAddon(null)}
                  disabled={isBuying}
                  className="flex-1 py-2.5 rounded-xl border border-[#2B354B] text-slate-400 font-semibold text-xs hover:bg-[#1A202E]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToUpi}
                  disabled={isBuying}
                  className="flex-1 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-[#E5A93C]/20 active:scale-95 transition-all"
                >
                  <span>Pay ₹{selectedAddon.price} via UPI QR</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UPI Payment Modal */}
        {selectedAddon && (
          <UpiPaymentModal
            isOpen={upiModalOpen}
            onClose={() => setUpiModalOpen(false)}
            title={selectedAddon.name}
            amount={selectedAddon.price}
            itemDescription={`Karnataka Gym ${selectedAddon.category_label}`}
            onPaymentSuccess={handleUpiSuccess}
          />
        )}
      </main>

      <Footer />
      <MemberBottomNav />
    </div>
  );
}

