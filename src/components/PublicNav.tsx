'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  Menu,
  X,
  UserCheck,
  Lock,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  MapPin
} from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

interface PublicNavProps {
  onOpenTests?: () => void;
}

export const PublicNav: React.FC<PublicNavProps> = ({ onOpenTests }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0E14]/95 border-b border-[#232B3E] backdrop-blur-md px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-none group flex-shrink-0"
          aria-label="Karnataka Gym Hubballi Home"
        >
          <div className="relative w-11 h-11 flex-shrink-0 drop-shadow-[0_2px_10px_rgba(229,169,60,0.35)]">
            <Image
              src="/karnataka-gym-logo.png"
              alt="Karnataka Gym Hubballi Logo"
              width={44}
              height={44}
              className="object-contain w-full h-full"
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
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
          <a href="#about" className="hover:text-[#E5A93C] transition-colors">
            About
          </a>
          <a href="#facilities" className="hover:text-[#E5A93C] transition-colors">
            Facilities
          </a>
          <a href="#plans" className="hover:text-[#E5A93C] transition-colors">
            Membership Plans
          </a>
          <a href="#trainers" className="hover:text-[#E5A93C] transition-colors">
            Coaches
          </a>
          <a href="#location" className="hover:text-[#E5A93C] transition-colors">
            Location & Hours
          </a>
          <a href="#contact" className="hover:text-[#E5A93C] transition-colors">
            Contact
          </a>
        </div>

        {/* Desktop CTA Gateways & Helpline */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Clickable Phone */}
          <a
            href="tel:9902667407"
            className="flex items-center gap-1.5 bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] text-xs font-bold px-3 py-2 rounded-xl text-slate-200 transition-colors"
            title="Call Karnataka Gym Helpline"
          >
            <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>9902667407</span>
          </a>

          {/* Test Runner Button */}
          {onOpenTests && (
            <button
              onClick={onOpenTests}
              className="flex items-center gap-1.5 bg-[#142025] hover:bg-[#1a2d34] border border-teal-800/80 text-teal-300 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
              title="Open 12-Item Test Checklist"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Tests (12)</span>
            </button>
          )}

          {/* Member Login Button */}
          <Link
            href="/login?role=member"
            className="bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#E5A93C]/20 transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Member Login</span>
          </Link>

          {/* Owner Cockpit Button */}
          <Link
            href="/login?role=owner"
            className="bg-[#181F2F] hover:bg-red-950/60 border border-red-800/70 text-red-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>Owner Cockpit</span>
          </Link>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/login?role=member"
            className="bg-[#E5A93C] text-slate-950 text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Login</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] rounded-lg text-slate-300"
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
            <div className="flex items-center justify-between pb-4 border-b border-[#232B3E]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 relative">
                  <Image
                    src="/karnataka-gym-logo.png"
                    alt="Karnataka Gym"
                    width={36}
                    height={36}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-white block">Karnataka Gym</span>
                  <span className="text-[10px] text-slate-400">Hubballi, Karnataka</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Portal Action Buttons in Mobile Menu */}
            <div className="py-4 space-y-2 border-b border-[#232B3E]">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Portals & App Entry
              </span>
              <Link
                href="/login?role=member"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Member Portal Login</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login?role=owner"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#1A2234] border border-red-800 text-red-200 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  <span>Owner Cockpit</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
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
                href="#plans"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-[#181F2F]"
              >
                Membership Plans (₹)
              </a>
              <a
                href="#trainers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-[#181F2F]"
              >
                Certified Coaches
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

              {onOpenTests && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenTests();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-teal-400 bg-teal-950/30 border border-teal-800 flex items-center justify-between"
                  >
                    <span>Run 12-Item Test Checklist</span>
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Direct Contact Bar */}
            <div className="pt-4 border-t border-[#232B3E] space-y-2 text-xs">
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
                <span>WhatsApp: 9902667407</span>
              </a>

              <a
                href="https://instagram.com/KARNATAKA_GYM_HUBLI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[#171D2B] text-pink-400 font-bold hover:border-pink-500 border border-transparent transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>@KARNATAKA_GYM_HUBLI</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

