'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { sanitizePhone, sanitizeString } from '@/lib/security';
import { ArrowLeft, Trash2, CheckCircle, ShieldAlert } from 'lucide-react';

export default function DataDeletionPage() {
  const { currentUser, users } = useGym();

  const [phone, setPhone] = useState(currentUser.phone || '');
  const [reason, setReason] = useState('Relocated from Hubballi');
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const phoneValidation = sanitizePhone(phone);
    if (!phoneValidation.isValid) {
      setErrorMsg('Please enter a valid 10-digit registered Indian mobile number.');
      return;
    }

    if (!confirmCheckbox) {
      setErrorMsg('Please check the confirmation box to authorize data deletion.');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-8 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-800 px-2.5 py-0.5 rounded-full">
            Right to Erasure (DPDP Act)
          </span>
          <h1 className="text-2xl font-black text-white">Data Deletion Request</h1>
          <p className="text-xs text-slate-400">
            Submit a formal request to purge your personal profile, attendance logs, and contact details from Karnataka Gym Hubballi records.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-3xl bg-emerald-950/60 border-2 border-emerald-500 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h2 className="text-base font-black text-white">Data Deletion Request Received</h2>
            <p className="text-xs text-slate-200 leading-relaxed max-w-sm mx-auto">
              Your request for mobile number <strong className="text-white">+91 {phone}</strong> has been logged. In accordance with DPDP regulations, all personal logs and contact records will be purged within 7 business days.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-block bg-[#E5A93C] text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-[#121622] border border-[#232B3E] space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Registered Mobile Number (+91)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-red-500 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                maxLength={10}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Reason for Account & Data Removal
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#181F2F] border border-[#2D3950] focus:border-red-500 rounded-xl p-2.5 text-white focus:outline-none"
              >
                <option value="Relocated from Hubballi">Relocated from Hubballi</option>
                <option value="No longer using gym services">No longer using gym services</option>
                <option value="Privacy preference">Privacy preference</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-red-950/20 border border-red-900/40 text-[11px] text-red-300 space-y-1">
              <span className="font-bold block">Important Notice:</span>
              <p>
                Deleting your data will erase your earned workout streak, active membership access, and entry QR pass. This action cannot be reversed.
              </p>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="confirm-del"
                checked={confirmCheckbox}
                onChange={(e) => setConfirmCheckbox(e.target.checked)}
                className="w-4 h-4 rounded mt-0.5 accent-red-600 cursor-pointer"
              />
              <label htmlFor="confirm-del" className="text-[11px] text-slate-300 leading-snug cursor-pointer">
                I understand that my membership history, attendance streak, and personal details will be permanently deleted.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-transform active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Submit Data Erasure Request</span>
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
