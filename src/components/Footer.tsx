'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ShieldCheck, FileText, Trash2, Code } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080B10] border-t border-[#1C2333] pt-8 pb-24 md:pb-10 px-4 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Brand Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#182030]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 drop-shadow-[0_2px_8px_rgba(229,169,60,0.35)]">
              <Image
                src="/karnataka-gym-badge.png"
                alt="Karnataka Gym Hubballi Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <span className="text-base font-extrabold text-white tracking-wide block">
                KARNATAKA <span className="text-[#E5A93C]">GYM</span>
              </span>
              <p className="text-[11px] text-slate-400">Hubballi Premier Strength & Fitness Destination</p>
            </div>
          </Link>

          {/* Prominent Clickable Contact & Social Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Clickable Phone */}
            <a
              href="tel:9902667407"
              className="flex items-center gap-2 bg-[#121724] border border-[#232B3E] hover:border-[#E5A93C] px-3.5 py-2 rounded-xl text-white font-semibold transition-all group"
              title="Call Karnataka Gym Helpline"
            >
              <div className="p-1.5 rounded-full bg-[#E5A93C]/20 text-[#E5A93C] group-hover:scale-105 transition-transform">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Call Helpline</span>
                <span className="text-xs text-slate-100 font-bold">9902667407</span>
              </div>
            </a>

            {/* Clickable Email */}
            <a
              href="mailto:karnatakagymhubli@gmail.com"
              className="flex items-center gap-2 bg-[#121724] border border-[#232B3E] hover:border-[#E5A93C] px-3.5 py-2 rounded-xl text-white font-semibold transition-all group"
              title="Send an email to Karnataka Gym"
            >
              <div className="p-1.5 rounded-full bg-[#E5A93C]/20 text-[#E5A93C] group-hover:scale-105 transition-transform">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Official Email</span>
                <span className="text-xs text-slate-100 font-bold">karnatakagymhubli@gmail.com</span>
              </div>
            </a>

            {/* Clickable Instagram */}
            <a
              href="https://www.instagram.com/riyaz_gokul/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#121724] border border-[#232B3E] hover:border-pink-500 px-3.5 py-2 rounded-xl text-white font-semibold transition-all group"
              title="Follow Riyaz Gokul / Karnataka Gym on Instagram"
            >
              <div className="p-1.5 rounded-full bg-pink-500/20 text-pink-400 group-hover:scale-105 transition-transform">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Follow Us</span>
                <span className="text-xs text-pink-300 font-bold">@riyaz_gokul</span>
              </div>
            </a>
          </div>
        </div>

        {/* Business Details & Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-400">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#E5A93C] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-bold block">Facility Address</span>
              <span>Near Old Bus Stand, Station Road, Hubballi, Karnataka - 580020</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#E5A93C] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-bold block">Operating Hours</span>
              <span>Mon - Sat: 5:30 AM - 10:00 PM | Sun: 6:00 AM - 12:00 PM</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Code className="w-4 h-4 text-[#E5A93C] flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-bold block">Designed and Developed By</span>
              <span className="text-slate-300">
                Ayesha Tech Studio • Contact:{' '}
                <a
                  href="tel:9663396058"
                  className="text-[#E5A93C] hover:underline font-bold"
                >
                  9663396058
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Legal & Compliance Links */}
        <div className="pt-4 border-t border-[#141B28] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>© 2026 Karnataka Gym Hubballi. All rights reserved.</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span>
              Crafted by{' '}
              <strong className="text-slate-300 font-bold">Ayesha Tech Studio</strong> (
              <a href="tel:9663396058" className="text-[#E5A93C] hover:underline font-bold">
                9663396058
              </a>
              )
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/data-deletion" className="hover:text-red-400 transition-colors">
              Data Deletion Request
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/install-prompt" className="hover:text-[#E5A93C] transition-colors">
              Install PWA
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
