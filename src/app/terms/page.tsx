'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2.5 py-0.5 rounded-full">
            Gym Terms & Rules
          </span>
          <h1 className="text-2xl font-black text-white">Terms of Membership</h1>
          <p className="text-xs text-slate-400">
            Transparent Gym Rules • No Hidden Charges • Hubballi Facility Policies
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#121622] border border-[#232B3E] space-y-5 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Membership & Facility Access</h2>
            <p>
              Memberships at Karnataka Gym Hubballi are non-transferable and assigned to the registered mobile number.
              Entry requires scanning your active session QR pass at the entrance scanner or verification by front-desk staff.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Transparent Pricing - No Hidden Fees</h2>
            <p>
              All published membership and add-on rates (Monthly ₹1,500, Quarterly ₹4,000, Half-Yearly ₹7,500, Yearly ₹12,000) are all-inclusive.
              We do not charge surprise registration fees, maintenance deposits, or locker surcharge fees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Membership Pause / Freeze Policy</h2>
            <p>
              Annual and Half-Yearly members can request a temporary pause (up to 30 days) for medical reasons, travel, or injuries.
              Approved pauses halt your expiry countdown and strictly preserve your earned workout attendance streak.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">4. Code of Conduct & Safety</h2>
            <p>
              Members must wear clean workout attire and sports shoes on the gym floor.
              Weights must be re-racked after use. Respectful behavior towards fellow gym members and coaching staff is mandatory.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">5. Refund & Cancellation Terms</h2>
            <p>
              Membership renewals may be cancelled for a full refund within 48 hours of purchase if gym facilities have not been accessed.
              Refunds are processed to the original payment method within 5-7 business days.
            </p>
          </section>

          <div className="pt-2 border-t border-[#1C2333] text-slate-400">
            For questions regarding these terms, reach us at <a href="tel:9902667407" className="text-[#E5A93C] font-bold">9902667407</a> or visit the front desk in Hubballi.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

