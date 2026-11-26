'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Menu,
  X,
  Camera,
  Sparkles,
  Dumbbell
} from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export const PublicNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0E14]/95 backdrop-blur-md px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none group flex-shrink-0"
          aria-label="Karnataka Gym Hubballi Home"
        >
          <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 drop-shadow-[0_2px_10px_rgba(229,169,60,0.35)]">
            <Image
              src="/karnataka-gym-badge.png"
              alt="Karnataka Gym Hubballi Logo"
              width={44}
              height={44}
              className="object-contain w-full h-full rounded-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base md:text-lg tracking-wide text-white leading-none group-hover:text-[#E5A93C] transition-colors">
              KARNATAKA <span className="text-[#E5A93C]">GYM</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">
              Hubballi • Est. 2011
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
          <a href="#about" className="hover:text-[#E5A93C] transition-colors">
            About
          </a>
          <a href="#facilities" className="hover:text-[#E5A93C] transition-colors">
            Facilities
          </a>
          <a href="#facility-tour" className="hover:text-[#E5A93C] text-slate-300 transition-colors flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Facility Tour</span>
          </a>
          <a href="#transformations" className="hover:text-[#E5A93C] text-slate-300 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Transformations</span>
          </a>
          <a href="#trainer" className="hover:text-[#E5A93C] text-[#E5A93C] transition-colors flex items-center gap-1.5 font-extrabold">
            <Dumbbell className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Trainer</span>
          </a>
          <a href="#pricing" className="hover:text-[#E5A93C] transition-colors">
            Pricing
          </a>
          <a href="#location" className="hover:text-[#E5A93C] transition-colors">
            Location & Hours
          </a>
          <a href="#contact" className="hover:text-[#E5A93C] transition-colors">
            Contact
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] rounded-lg text-slate-300 cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-80 bg-[#0F131D] border-l border-[#232B3E] h-full flex flex-col p-5 shadow-2xl animate-in slide-in-from-right duration-250">
            {/* Header */}
            <div className="flex items-center justify-between pb-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 group"
                title="Karnataka Gym Home"
              >
                <div className="w-9 h-9 relative rounded-full overflow-hidden flex-shrink-0 drop-shadow-sm">
                  <Image
                    src="/karnataka-gym-badge.png"
                    alt="Karnataka Gym"
                    width={36}
                    height={36}
                    className="object-contain w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-white group-hover:text-[#E5A93C] transition-colors block">
                    Karnataka Gym
                  </span>
                  <span className="text-[10px] text-slate-400">Hubballi, Karnataka</span>
                </div>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Section Links */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Explore Website
              </span>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-[#181F2F]"
              >
                About Karnataka Gym
              </a>
              <a
                href="#facilities"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-[#181F2F]"
              >
                Facilities & Equipment
              </a>
              <a
                href="#facility-tour"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:text-[#E5A93C] hover:bg-[#181F2F] flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-[#E5A93C]" />
                <span>Facility Tour (Real Photos)</span>
              </a>
              <a
                href="#transformations"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:text-[#E5A93C] hover:bg-[#181F2F] flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                <span>Real Member Transformations</span>
              </a>
              <a
                href="#trainer"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-[#E5A93C] font-bold hover:bg-[#181F2F] flex items-center gap-2"
              >
                <Dumbbell className="w-4 h-4 text-[#E5A93C]" />
                <span>Head Coach & Trainer</span>
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-[#181F2F]"
              >
                Membership Pricing
              </a>
              <a
                href="#location"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-[#181F2F]"
              >
                Location & Timings
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-[#181F2F]"
              >
                Contact & Inquiry
              </a>
            </div>

            {/* Direct Contact Bar */}
            <div className="pt-4 space-y-2 text-xs">
              <a
                href="tel:9902667407"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171D2B] text-slate-200 font-bold hover:border-[#E5A93C] border border-transparent transition-colors"
              >
                <Phone className="w-4 h-4 text-[#E5A93C]" />
                <span>Call: 9902667407</span>
              </a>

              <a
                href="https://wa.me/919902667407"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171D2B] text-emerald-400 font-bold hover:border-emerald-500 border border-transparent transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: 9902667407</span>
              </a>

              <a
                href="https://www.instagram.com/riyaz_gokul/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171D2B] text-pink-400 font-bold hover:border-pink-500 border border-transparent transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@riyaz_gokul</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
