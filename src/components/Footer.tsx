'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080B10] border-t border-[#1C2333] pt-8 pb-24 md:pb-10 px-4 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Business Details & Studio Credit Grid */}
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
