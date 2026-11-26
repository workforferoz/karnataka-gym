import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicNav } from '@/components/PublicNav';
import { Footer } from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Karnataka Gym Hubballi',
  description: 'Privacy Policy and data protection standards for Karnataka Gym Hubballi. Compliant with Digital Personal Data Protection (DPDP) Act, India.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <PublicNav />

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
              This Progressive Web Application (PWA) is owned and operated by <strong>Karnataka Gym</strong>, located at Kalidas Nagar, Hubballi, Karnataka 580031 (<a href="https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA" target="_blank" rel="noopener noreferrer" className="text-[#E5A93C] underline">Google Maps Location</a>).
              For privacy inquiries, contact our Data Protection Officer at <a href="mailto:karnatakagymhubli@gmail.com" className="text-[#E5A93C] underline">karnatakagymhubli@gmail.com</a> or call <a href="tel:9902667407" className="text-[#E5A93C] underline">9902667407</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Data We Collect (No Unnecessary Data)</h2>
            <p>
              We do not require user accounts, logins, or passwords. We collect strictly minimal contact data only when you voluntarily submit a gym walkthrough request:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li><strong>Contact Identity:</strong> Full Name and 10-digit Mobile Number provided in the walkthrough request form.</li>
              <li><strong>Fitness Interest:</strong> Selected primary fitness goal and preferred visit timing.</li>
            </ul>
            <p className="text-slate-400">
              We do <strong>not</strong> collect passwords, payment cards, biometric data, location tracking coordinates, or browsing history.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Permissions & Device Access</h2>
            <p>
              This website does not require or request access to your device camera, microphone, contacts, or location.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">4. Marketing Communications & Opt-Out</h2>
            <p>
              We respect your right to undisturbed communication. You can request to opt out of promotional messages at any time by contacting us directly via WhatsApp or phone at <a href="tel:9902667407" className="text-[#E5A93C] underline font-bold">9902667407</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">5. Data Deletion & Member Rights</h2>
            <p>
              Under Indian DPDP Act regulations, you have the right to request full erasure of your contact details at any time.
              To request data deletion, contact us directly via email at <a href="mailto:karnatakagymhubli@gmail.com" className="text-[#E5A93C] underline font-bold">karnatakagymhubli@gmail.com</a> or call <a href="tel:9902667407" className="text-[#E5A93C] underline font-bold">9902667407</a>.
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-[#1C2333]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">6. Contact Information</h2>
            <div className="space-y-1 text-slate-400">
              <div><strong>Facility:</strong> Karnataka Gym Hubballi</div>
              <div><strong>Address:</strong> Kalidas Nagar, Hubballi, Karnataka 580031 (<a href="https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA" target="_blank" rel="noopener noreferrer" className="text-[#E5A93C] underline">Google Maps</a>)</div>
              <div><strong>Helpline:</strong> +91 9902667407</div>
              <div><strong>Official Email:</strong> karnatakagymhubli@gmail.com</div>
              <div><strong>Instagram:</strong> @riyaz_gokul</div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

