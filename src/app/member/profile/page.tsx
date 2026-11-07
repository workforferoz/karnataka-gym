'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MemberBottomNav } from '@/components/MemberBottomNav';
import {
  User,
  Phone,
  Camera,
  CheckCircle,
  MessageSquare,
  Bell,
  Shield,
  ArrowLeft,
  Save,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function MemberProfilePage() {
  const { currentUser, updateUserProfile } = useGym();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [emergencyContact, setEmergencyContact] = useState(currentUser.emergency_contact || '9902667407');
  const [commPreference, setCommPreference] = useState<'whatsapp' | 'sms' | 'call'>(currentUser.comm_preference || 'whatsapp');
  const [marketingOptIn, setMarketingOptIn] = useState<boolean>(currentUser.marketing_opt_in ?? true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const avatarOptions = [
    '/karnataka-gym-logo.png',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  ];

  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentUser.profile_image || avatarOptions[0]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateUserProfile(currentUser.id, {
        name,
        phone,
        emergency_contact: emergencyContact,
        comm_preference: commPreference,
        marketing_opt_in: marketingOptIn,
        profile_image: selectedAvatar
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-5 space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/member/home"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mera Home</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Account & Settings
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl font-extrabold text-white">Member Profile</h1>
          <p className="text-xs text-slate-400">
            Manage your details, emergency contact, and notification preferences.
          </p>
        </div>

        {/* Save Status Toast */}
        {saveSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Profile details saved globally! Marketing preferences updated.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Selector Card */}
          <div className="p-4 rounded-3xl bg-[#121622] border border-[#232B3E] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Profile Picture / Avatar
            </span>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#E5A93C] flex-shrink-0 shadow-lg">
                <img
                  src={selectedAvatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <span className="text-xs font-bold text-white block mb-1.5">Choose Avatar:</span>
                <div className="flex items-center gap-2">
                  {avatarOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(opt)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform cursor-pointer ${
                        selectedAvatar === opt ? 'border-[#E5A93C] scale-110 shadow-md' : 'border-slate-700 opacity-60'
                      }`}
                    >
                      <img src={opt} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Details Card */}
          <div className="p-4 rounded-3xl bg-[#121622] border border-[#232B3E] space-y-3 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-[#1E2638] pb-1.5">
              Contact Information
            </span>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Primary Phone Number (+91)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-white font-mono focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Communication & Marketing Opt-out Card */}
          <div className="p-4 rounded-3xl bg-[#121622] border border-[#232B3E] space-y-3.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-[#1E2638] pb-1.5">
              Communication & Privacy Preferences
            </span>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                Preferred Channel for Reminders & Alerts:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['whatsapp', 'sms', 'call'] as const).map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => setCommPreference(channel)}
                    className={`py-2 px-2 rounded-xl text-center font-bold capitalize transition-all cursor-pointer ${
                      commPreference === channel
                        ? 'bg-[#E5A93C] text-slate-950 shadow-md'
                        : 'bg-[#181F2F] border border-[#2C3852] text-slate-300'
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
            </div>

            {/* Marketing Opt-Out Toggle Switch */}
            <div className="pt-2 border-t border-[#1E2638] flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Promotional & Discount Offers
                </span>
                <span className="text-[10px] text-slate-400 block leading-snug mt-0.5">
                  Receive festive sale alerts, supplement discounts & special gym event invitations.
                  (Transactional renewal alerts remain active).
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#253046] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E5A93C]"></div>
              </label>
            </div>

            {!marketingOptIn && (
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/40 text-[11px] text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Marketing Opt-out Active: Non-transactional promotions will not be sent to your phone.</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] hover:from-[#d89e34] hover:to-[#e08f06] text-slate-950 font-black py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#E5A93C]/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </main>

      <Footer />
      <MemberBottomNav />
    </div>
  );
}

