'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('karnataka_gym_cookie_consent');
      if (!consent) {
        setShow(true);
      }
    } catch (e) {
      // Ignore if localStorage unavailable
    }
  }, []);

  const handleAccept = (type: 'all' | 'necessary') => {
    try {
      localStorage.setItem('karnataka_gym_cookie_consent', type);
    } catch (e) {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-16 md:bottom-4 left-4 right-4 max-w-lg mx-auto z-50 bg-[#121622] border-2 border-[#E5A93C] rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-[#E5A93C]/15 text-[#E5A93C] flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-2 flex-1 min-w-0">
          <h3 className="text-xs font-black text-white">Privacy & Cookie Consent</h3>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            We use essential local storage strictly to keep your gym check-in pass cached offline and maintain your login state. We do <strong>not</strong> track you with third-party advertising cookies.{' '}
            <Link href="/privacy-policy" className="text-[#E5A93C] underline font-bold">
              Read Policy
            </Link>.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleAccept('all')}
              className="bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow cursor-pointer transition-transform active:scale-95"
            >
              Accept All
            </button>
            <button
              onClick={() => handleAccept('necessary')}
              className="bg-[#1C2333] hover:bg-[#252E42] border border-[#2F3A50] text-slate-300 font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
            >
              Essential Only
            </button>
          </div>
        </div>
        <button
          onClick={() => handleAccept('necessary')}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Close cookie consent banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

