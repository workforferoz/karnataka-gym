'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  Menu,
  X,
  UserCheck,
  Lock,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Dumbbell,
  User,
  LogIn,
  Camera
} from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';

interface PublicNavProps {
  onOpenTests?: () => void;
}

export const PublicNav: React.FC<PublicNavProps> = ({ onOpenTests }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLoginMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0E14]/95 border-b border-[#232B3E] backdrop-blur-md px-4 py-3">
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
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
          <a href="#about" className="hover:text-[#E5A93C] transition-colors">
            About
          </a>
          <a href="#facilities" className="hover:text-[#E5A93C] transition-colors">
            Facilities
          </a>
          <a href="#facility-tour" className="hover:text-[#E5A93C] text-[#E5A93C] transition-colors flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>Facility Tour</span>
          </a>
          <a href="#location" className="hover:text-[#E5A93C] transition-colors">
            Location & Hours
          </a>
          <a href="#contact" className="hover:text-[#E5A93C] transition-colors">
            Contact
          </a>
        </div>

        {/* Desktop Right Controls: Phone + Single Unified Login Dropdown */}
        <div className="hidden md:flex items-center gap-3">
          {/* Clickable Phone */}
          <a
            href="tel:9902667407"
            className="flex items-center gap-1.5 bg-[#121622] border border-[#232B3E] hover:border-[#E5A93C] text-xs font-bold px-3 py-2 rounded-xl text-slate-200 transition-colors"
            title="Call Karnataka Gym Helpline"
          >
            <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>9902667407</span>
          </a>

          {/* Unified Login Icon & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLoginMenuOpen(!loginMenuOpen)}
              className="bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-[#E5A93C]/20 transition-all cursor-pointer"
              aria-label="Open Login Portals"
              aria-expanded={loginMenuOpen}
            >
              <LogIn className="w-4 h-4 stroke-[2.5]" />
              <span>Login</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${loginMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {loginMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#121622] border-2 border-[#232B3E] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-[#232B3E] mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Select Login Portal
                  </span>
                </div>

                {/* 1. Member Login */}
                <Link
                  href="/login?role=member"
                  onClick={() => setLoginMenuOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#181F2F] group transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#E5A93C] flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-white group-hover:text-[#E5A93C] transition-colors block">
                      Member Login
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      QR check-in, streak & renewals
                    </span>
                  </div>
                </Link>

                {/* 2. Trainer Login */}
                <Link
                  href="/login?role=trainer"
                  onClick={() => setLoginMenuOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#181F2F] group transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-white group-hover:text-emerald-400 transition-colors block">
                      Trainer Login
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      Coach Vikram, Pooja & Rakesh
                    </span>
                  </div>
                </Link>


              </div>
            )}
          </div>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Login Button */}
          <Link
            href="/login"
            className="bg-[#E5A93C] text-slate-950 text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
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
                <div className="w-9 h-9 relative rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/karnataka-gym-badge.png"
                    alt="Karnataka Gym"
                    width={36}
                    height={36}
                    className="object-contain w-full h-full rounded-full"
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

            {/* Portal Action Buttons in Mobile Menu: Member, Trainer, Owner */}
            <div className="py-4 space-y-2 border-b border-[#232B3E]">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Select Login Portal
              </span>

              {/* 1. Member Login */}
              <Link
                href="/login?role=member"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Member Login</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>

              {/* 2. Trainer Login */}
              <Link
                href="/login?role=trainer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#162420] border border-emerald-800 text-emerald-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  <span>Trainer Login</span>
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
                href="#facility-tour"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-[#E5A93C] font-bold hover:bg-[#181F2F] flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-[#E5A93C]" />
                <span>Facility Tour (Real Photos)</span>
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
                    className="w-full text-left px-3 py-2 rounded-lg text-teal-400 bg-teal-950/30 border border-teal-800 flex items-center justify-between cursor-pointer"
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
