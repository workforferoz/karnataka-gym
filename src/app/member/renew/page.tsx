'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MemberBottomNav } from '@/components/MemberBottomNav';
import { checkRateLimit } from '@/lib/security';
import {
  RefreshCcw,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  Zap,
  CreditCard,
  XCircle,
  Sparkles,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';

export default function MemberRenewPage() {
  const { currentUser, memberships, plans, renewMembership } = useGym();

  const membership = memberships.find((m) => m.user_id === currentUser.id);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_quarterly');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Expiry calculation
  const today = new Date();
  let daysUntilExpiry = 0;
  if (membership) {
    const expDate = new Date(membership.expiry_date);
    daysUntilExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
  const payableAmount = selectedPlan.base_price - selectedPlan.discount_amount;
  const gstAmount = Math.round(payableAmount * 0.18);
  const totalWithTax = payableAmount; // Gym prices are inclusive of GST in Indian gyms

  const handleStartPayment = () => {
    if (!agreedTerms) {
      alert('Kripya Karnataka Gym ke Rules and Terms agree karein.');
      return;
    }
    setPaymentModalOpen(true);
  };

  const handleExecutePayment = async (status: 'paid' | 'failed' | 'pending') => {
    const rateCheck = checkRateLimit(`pay_${currentUser.id}`, 6, 60000);
    if (!rateCheck.allowed) {
      setPaymentResult({
        success: false,
        message: `Too many payment attempts. Please wait ${rateCheck.retryAfterSeconds}s.`
      });
      return;
    }

    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const res = await renewMembership(currentUser.id, selectedPlanId, status);
      setPaymentResult(res);
      if (res.success) {
        setTimeout(() => {
          setPaymentModalOpen(false);
        }, 2200);
      }
    } finally {
      setIsProcessing(false);
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
            Direct Renewal
          </span>
        </div>

        {/* 7-Day Reminder Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/80 via-red-950/60 to-amber-950/80 border-2 border-amber-500/80 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
              <RefreshCcw className="w-5 h-5 animate-spin-reverse" />
            </div>
            <div>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">
                Renew Aaj Hi Karein!
              </span>
              <span className="text-xs text-slate-200">
                Current validity: <strong className="text-white">{membership?.expiry_date}</strong> ({daysUntilExpiry > 0 ? `${daysUntilExpiry} din baki` : 'Expired'}).
              </span>
            </div>
          </div>
        </div>

        {/* Plan Selection Cards */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Chuniye Apna Naya Plan:
          </h2>

          <div className="space-y-3">
            {plans.map((p) => {
              const isSelected = p.id === selectedPlanId;
              const effectivePrice = p.base_price - p.discount_amount;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#1A2234] to-[#141A28] border-[#E5A93C] shadow-lg shadow-[#E5A93C]/10'
                      : 'bg-[#121622] border-[#222A3C] hover:border-[#2F3A50]'
                  }`}
                >
                  {p.tag && (
                    <span className="absolute -top-2.5 right-4 text-[9px] font-black uppercase tracking-wider bg-[#E5A93C] text-slate-950 px-2.5 py-0.5 rounded-full shadow-md">
                      {p.tag}
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-[#E5A93C] bg-[#E5A93C]' : 'border-slate-500'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                      </div>

                      <div>
                        <h3 className="text-sm font-extrabold text-white">{p.name}</h3>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Duration: {p.duration_months} Months
                        </span>

                        <ul className="mt-2 space-y-1">
                          {p.features.map((feat, i) => (
                            <li key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-[#E5A93C]" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-base font-black text-white block">
                        ₹{effectivePrice}
                      </span>
                      {p.discount_amount > 0 && (
                        <span className="text-[10px] text-slate-400 line-through block">
                          ₹{p.base_price}
                        </span>
                      )}
                      <span className="text-[9px] text-emerald-400 font-bold block mt-0.5">
                        Inclusive GST
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Breakdown Bill Card */}
        <div className="p-4 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-2.5 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-[#1E2638] pb-1.5">
            Bill & Payment Breakdown (INR)
          </span>

          <div className="flex justify-between text-slate-300">
            <span>Base Plan Fee:</span>
            <span className="font-mono">₹{selectedPlan.base_price}</span>
          </div>

          {selectedPlan.discount_amount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Early Renewal Discount:</span>
              <span className="font-mono">-₹{selectedPlan.discount_amount}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-400">
            <span>18% GST (Included):</span>
            <span className="font-mono">₹{gstAmount}</span>
          </div>

          <div className="pt-2 border-t border-[#1E2638] flex justify-between text-sm font-extrabold text-white">
            <span>Total Payable Amount:</span>
            <span className="text-[#E5A93C] font-mono text-base">₹{totalWithTax}</span>
          </div>
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="flex items-start gap-2.5 px-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
            className="w-4 h-4 rounded mt-0.5 accent-[#E5A93C] cursor-pointer"
          />
          <label htmlFor="terms" className="text-[11px] text-slate-400 leading-snug cursor-pointer">
            I agree to Karnataka Gym Hubballi rules, locker policies, and attendance streak guidelines. (No refunds after 7 days).
          </label>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStartPayment}
          className="w-full bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] hover:from-[#d89e34] hover:to-[#e08f06] text-slate-950 font-black py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#E5A93C]/20 active:scale-95 transition-all cursor-pointer"
        >
          <CreditCard className="w-4 h-4 stroke-[2.5]" />
          <span>Pay ₹{totalWithTax} & Renew Instant</span>
        </button>

        {/* Simulated Payment Gateway Modal */}
        {paymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-[#121622] border-2 border-[#E5A93C] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex-shrink-0 drop-shadow-sm">
                    <img src="/karnataka-gym-logo.png" alt="KG" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">Razorpay / UPI Gateway</h3>
                    <span className="text-[10px] text-slate-400">Karnataka Gym Hubballi</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#E5A93C]">₹{totalWithTax}</span>
              </div>

              {/* Status Message */}
              {paymentResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-medium ${
                    paymentResult.success
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                      : 'bg-red-950/60 border-red-600 text-red-200'
                  }`}
                >
                  {paymentResult.message}
                </div>
              )}

              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Select Simulation Mode (Test Gateway):
                </span>

                <button
                  onClick={() => handleExecutePayment('paid')}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Simulate Payment SUCCESS (Auto Extend)</span>
                </button>

                <button
                  onClick={() => handleExecutePayment('failed')}
                  disabled={isProcessing}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Simulate Payment FAILURE (Verify Guard)</span>
                </button>

                <button
                  onClick={() => handleExecutePayment('pending')}
                  disabled={isProcessing}
                  className="w-full bg-[#1F2739] hover:bg-[#28324A] text-slate-300 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>Simulate Payment PENDING</span>
                </button>
              </div>

              <button
                onClick={() => setPaymentModalOpen(false)}
                disabled={isProcessing}
                className="w-full py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel & Close
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MemberBottomNav />
    </div>
  );
}

