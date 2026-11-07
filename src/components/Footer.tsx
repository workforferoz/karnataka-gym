'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MapPin, Clock, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080B10] border-t border-[#1C2333] pt-8 pb-24 md:pb-10 px-4 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Brand Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#182030]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E5A93C] flex-shrink-0 shadow-lg shadow-[#E5A93C]/20">
              <Image
                src="/karnataka-gym-logo.png"
                alt="Karnataka Gym Hubballi Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">
                KARNATAKA <span className="text-[#E5A93C]">GYM</span>
              </h2>
              <p className="text-[11px] text-slate-400">Hubballi&apos;s Premier Strength & Fitness Destination</p>
            </div>
          </div>

          {/* Prominent Contact & Social Badges as required */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Phone */}
            <a
              href="tel:9902667407"
              className="flex items-center gap-2 bg-[#121724] border border-[#232B3E] hover:border-[#E5A93C] px-3.5 py-2 rounded-xl text-white font-semibold transition-all group"
            >
              <div className="p-1.5 rounded-full bg-[#E5A93C]/20 text-[#E5A93C] group-hover:scale-110 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Call Helpline</span>
                <span className="text-xs text-slate-100 font-bold">9902667407</span>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919902667407?text=Namaste%20Karnataka%20Gym!%20I%20have%20an%20inquiry%20regarding%20my%20membership."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#121724] border border-[#232B3E] hover:border-emerald-500 px-3.5 py-2 rounded-xl text-white font-semibold transition-all group"
            >
              <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">WhatsApp Us</span>
                <span className="text-xs text-emerald-300 font-bold">Chat Now</span>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/KARNATAKA_GYM_HUBLI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#121724] border border-[#232B3E] hover:border-pink-500 px-3.5 py-2 rounded-xl text-white font-semibold transition-all group"
            >
              <div className="p-1.5 rounded-full bg-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Follow Us</span>
                <span className="text-xs text-pink-300 font-bold">@KARNATAKA_GYM_HUBLI</span>
              </div>
            </a>
          </div>
        </div>

        {/* Location & Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-400">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#E5A93C] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-bold block">Gym Location</span>
              <span>Near Old Bus Stand, Station Road, Hubballi, Karnataka - 580020</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#E5A93C] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-bold block">Gym Timing</span>
              <span>Mon - Sat: 5:30 AM - 10:00 PM | Sun: 6:00 AM - 12:00 PM</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-bold block">Retention PWA</span>
              <span>Live Attendance Sync • Instant QR Pass • Transparent Renewals</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Quick Links */}
        <div className="pt-4 border-t border-[#141B28] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span>© 2026 Karnataka Gym Hubballi. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/install-prompt" className="hover:text-[#E5A93C] underline">
              Install App (PWA Guide)
            </Link>
            <Link href="/login" className="hover:text-white">
              Switch User
            </Link>
            <span className="text-slate-600">•</span>
            <span className="text-[#E5A93C]">Hubballi Pride 💪</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
