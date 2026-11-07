'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            Legal & Compliance
          </span>
          <h1 className="text-2xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">
            Last Updated: November 2026 • Compliant with Digital Personal Data Protection (DPDP) Act, India.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#121622] border border-[#232B3E] space-y-5 text-xs text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Business Identity</h2>
            <p>
              This Progressive Web Application (PWA) is owned and operated by <strong>Karnataka Gym</strong>, located near Old Bus Stand, Station Road, Hubballi, Karnataka - 580020.
              For privacy inquiries, contact our Data Protection Officer at <a href="mailto:karnatakagymhubli@gmail.com" className="text-[#E5A93C] underline">karnatakagymhubli@gmail.com</a> or call <a href="tel:9902667407" className="text-[#E5A93C] underline">9902667407</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Data We Collect (No Unnecessary Data)</h2>
            <p>
              We collect strictly minimal operational data required to deliver gym retention, attendance verification, and membership renewal services:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>Member Identity:</strong> Full Name and Mobile Number for OTP authentication and attendance binding.</li>
              <li><strong>Attendance Log:</strong> Timestamp and method (QR scan or assisted front-desk check-in).</li>
              <li><strong>Membership Details:</strong> Active plan duration, start date, and expiry date.</li>
              <li><strong>Emergency Contact:</strong> Optional phone number provided by the member for gym floor safety.</li>
              <li><strong>Communication Preference:</strong> Your choice between WhatsApp, SMS, or Phone Call.</li>
            </ul>
            <p className="text-slate-400">
              We do <strong>not</strong> collect Aadhaar numbers, biometric fingerprint templates, location tracking coordinates, or browsing history.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Camera Access Policy</h2>
            <p>
              The mobile camera permission is used solely in real-time to scan gym entrance QR codes on physical turnstiles.
              We <strong>never</strong> record, store, or transmit photos or video streams to any external server.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">4. Marketing Communications & Opt-Out</h2>
            <p>
              We respect your right to undisturbed communication. You can turn off promotional discount messages at any time from your <Link href="/member/profile" className="text-[#E5A93C] underline font-bold">Member Profile</Link>.
              Transactional notifications (such as membership expiry reminders and check-in verifications) remain active to ensure seamless gym access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">5. Data Deletion & Member Rights</h2>
            <p>
              Under Indian DPDP Act regulations, members have the right to request full erasure of their personal profile and attendance history.
              To exercise your right to be forgotten, submit a formal request via our <Link href="/data-deletion" className="text-[#E5A93C] underline font-bold">Data Deletion Request Page</Link> or email us directly.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-[#1C2333]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">6. Contact Information</h2>
            <div className="space-y-1 text-slate-400">
              <div><strong>Facility:</strong> Karnataka Gym Hubballi</div>
              <div><strong>Address:</strong> Station Road, Near Old Bus Stand, Hubballi, Karnataka - 580020</div>
              <div><strong>Helpline:</strong> +91 9902667407</div>
              <div><strong>Official Email:</strong> karnatakagymhubli@gmail.com</div>
              <div><strong>Instagram:</strong> @KARNATAKA_GYM_HUBLI</div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
