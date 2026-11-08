'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OwnerBottomNav } from '@/components/OwnerBottomNav';
import {
  ArrowLeft,
  Palette,
  Sparkles,
  Save,
  CheckCircle,
  Megaphone,
  Phone,
  Mail,
  MapPin,
  Share2,
  Eye,
  Layers,
  ShoppingBag,
  Users,
  Dumbbell,
  ShieldCheck,
  ExternalLink,
  QrCode,
  Flame,
  AlertTriangle
} from 'lucide-react';

export default function MemberAppLookPage() {
  const { settings, updateGymSettings } = useGym();

  // Local form state initialized from current settings
  const [gymName, setGymName] = useState(settings.gym_name || 'Karnataka Gym Hubballi');
  const [gymTagline, setGymTagline] = useState(settings.gym_tagline || 'Iron Warrior Fitness Hub');
  const [welcomeSubtitle, setWelcomeSubtitle] = useState(settings.member_welcome_subtitle || 'Mera Gym Dashboard');
  const [bannerActive, setBannerActive] = useState<boolean>(settings.announcement_banner_active ?? true);
  const [bannerTag, setBannerTag] = useState(settings.announcement_banner_tag || 'ANNOUNCEMENT');
  const [bannerText, setBannerText] = useState(
    settings.announcement_banner_text || 'Special Morning Batch from 5:30 AM now open! Limited slots available.'
  );
  const [motivationalQuote, setMotivationalQuote] = useState(
    settings.member_motivational_quote || 'Consistency beats intensity. Kal fir milenge gym floor par!'
  );
  const [gymPhone, setGymPhone] = useState(settings.gym_phone || '9902667407');
  const [gymEmail, setGymEmail] = useState(settings.gym_email || 'karnatakagymhubli@gmail.com');
  const [gymInstagram, setGymInstagram] = useState(settings.gym_instagram || '@riyaz_gokul');
  const [gymLocation, setGymLocation] = useState(settings.gym_location || 'Kalidas Nagar, Hubballi, Karnataka 580031');
  const [gymMapsUrl, setGymMapsUrl] = useState(settings.gym_maps_url || 'https://maps.app.goo.gl/dXnSdvRU9gwHd7sAA');

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await updateGymSettings({
        gym_name: gymName.trim(),
        gym_tagline: gymTagline.trim(),
        member_welcome_subtitle: welcomeSubtitle.trim(),
        announcement_banner_active: bannerActive,
        announcement_banner_tag: bannerTag.trim(),
        announcement_banner_text: bannerText.trim(),
        member_motivational_quote: motivationalQuote.trim(),
        gym_phone: gymPhone.trim(),
        gym_email: gymEmail.trim(),
        gym_instagram: gymInstagram.trim(),
        gym_location: gymLocation.trim(),
        gym_maps_url: gymMapsUrl.trim()
      });

      setStatusMsg(res.message);
      setTimeout(() => setStatusMsg(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const presetAnnouncements = [
    {
      tag: 'ANNOUNCEMENT',
      text: 'Special Early Morning Batch starting 5:30 AM! Register at reception counter.'
    },
    {
      tag: 'SPECIAL OFFER',
      text: 'Festive Renewal Offer: Renew your Annual Membership this week & get 1 month extra!'
    },
    {
      tag: 'TIMINGS NOTICE',
      text: 'Sunday Special Timing: Gym open 6:00 AM to 12:00 PM for all members.'
    },
    {
      tag: 'STORE UPDATE',
      text: 'New batch of Premium Whey Protein & Pre-Workout restocked at front desk.'
    }
  ];

  const presetQuotes = [
    'Consistency beats intensity. Kal fir milenge gym floor par!',
    'The body achieves what the mind believes. Never skip a session!',
    'Discipline over motivation every single day. Hubballi gets stronger!',
    'Ek din ka rest theek hai, par discipline kabhi mat chhodo!',
    'Pound by pound, day by day, Karnataka Gym builds true warriors.'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <Link
              href="/owner/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Cockpit</span>
            </Link>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2.5 py-0.5 rounded-full">
                App Appearance Customizer
              </span>
              <span className="text-xs text-slate-400">Real-Time Sync</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Member App Appearance & Content
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Control everything members see inside the Karnataka Gym PWA: announcement broadcast banners, daily motivational quotes, contact details, and gym branding.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/member/home"
              target="_blank"
              className="bg-[#171D2B] hover:bg-[#1E2538] border border-[#2B354C] text-xs font-bold text-slate-300 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Open Member App ↗</span>
            </Link>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/owner/manage/plans"
            className="p-3.5 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] hover:border-[#E5A93C] transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#E5A93C]/15 text-[#E5A93C]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-[#E5A93C] transition-colors">
                  Edit Membership Plans
                </span>
                <span className="text-[10px] text-slate-400">Pricing, renewal discounts & perks</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#E5A93C]" />
          </Link>

          <Link
            href="/owner/manage/addons"
            className="p-3.5 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] hover:border-purple-500 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-purple-400 transition-colors">
                  Edit Add-Ons & Store
                </span>
                <span className="text-[10px] text-slate-400">Supplements, PT & Diet packages</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
          </Link>

          <Link
            href="/owner/manage/members"
            className="p-3.5 rounded-2xl bg-[#121622] hover:bg-[#161C2C] border border-[#232B3E] hover:border-blue-500 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-blue-400 transition-colors">
                  Manage Members (Directory)
                </span>
                <span className="text-[10px] text-slate-400">Enroll, remove, streaks & freezes</span>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
          </Link>
        </div>

        {/* 2-Column Grid: Left is Settings Editor Form, Right is Real-Time Member App Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Editor Form (7 cols) */}
          <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
            {/* 1. TOP ANNOUNCEMENT BANNER */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#232B3E] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#E5A93C]/15 text-[#E5A93C]">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-white">Member Announcement Broadcast</h2>
                    <p className="text-[11px] text-slate-400">Featured notice displayed at top of Member Home screen</p>
                  </div>
                </div>

                {/* Banner Active Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerActive}
                    onChange={(e) => setBannerActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#253046] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E5A93C]"></div>
                </label>
              </div>

              {bannerActive ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Banner Tag / Badge
                    </label>
                    <input
                      type="text"
                      value={bannerTag}
                      onChange={(e) => setBannerTag(e.target.value)}
                      placeholder="e.g. ANNOUNCEMENT, SPECIAL OFFER, NOTICE"
                      className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs font-bold text-[#E5A93C] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Banner Announcement Text
                    </label>
                    <textarea
                      value={bannerText}
                      onChange={(e) => setBannerText(e.target.value)}
                      rows={2}
                      placeholder="Type the message to broadcast to all members..."
                      className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
                      required
                    />
                  </div>

                  {/* Preset Injectors */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase">
                      1-Tap Quick Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {presetAnnouncements.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setBannerTag(p.tag);
                            setBannerText(p.text);
                          }}
                          className="text-[10px] bg-[#182030] hover:bg-[#202B40] text-slate-300 hover:text-white border border-[#2B3850] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          {p.tag}: {p.text.slice(0, 32)}...
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#181F2F] border border-[#2C3852] text-xs text-slate-400">
                  Announcement banner is currently <strong>disabled</strong>. The Member Home page will not show this broadcast box.
                </div>
              )}
            </div>

            {/* 2. DAILY MOTIVATIONAL QUOTE */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#232B3E] pb-3">
                <div className="p-2 rounded-xl bg-[#E5A93C]/15 text-[#E5A93C]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white">Daily Member Motivation</h2>
                  <p className="text-[11px] text-slate-400">Motivational quote shown at the bottom of Member Home</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Daily Quote Message
                </label>
                <textarea
                  value={motivationalQuote}
                  onChange={(e) => setMotivationalQuote(e.target.value)}
                  rows={2}
                  placeholder="Enter motivational quote..."
                  className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Quote Presets */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-1.5 uppercase">
                  1-Tap Quote Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presetQuotes.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMotivationalQuote(q)}
                      className="text-[10px] bg-[#182030] hover:bg-[#202B40] text-slate-300 hover:text-white border border-[#2B3850] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      &quot;{q.slice(0, 36)}...&quot;
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. APP BRANDING & GREETING */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#232B3E] pb-3">
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white">App Branding & Headings</h2>
                  <p className="text-[11px] text-slate-400">Gym display name, tagline, and member greeting</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Gym Display Name
                  </label>
                  <input
                    type="text"
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white font-bold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Gym Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={gymTagline}
                    onChange={(e) => setGymTagline(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Member Greeting Subtitle
                </label>
                <input
                  type="text"
                  value={welcomeSubtitle}
                  onChange={(e) => setWelcomeSubtitle(e.target.value)}
                  placeholder="e.g. Mera Gym Dashboard, Welcome Back Lifter"
                  className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* 4. CONTACTS & GYM LOCATION */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-[#232B3E] pb-3">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white">Contact & Facility Details</h2>
                  <p className="text-[11px] text-slate-400">Helpline, address, and maps links displayed in header and footer</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Helpline Phone
                  </label>
                  <input
                    type="tel"
                    value={gymPhone}
                    onChange={(e) => setGymPhone(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white font-mono focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={gymEmail}
                    onChange={(e) => setGymEmail(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={gymInstagram}
                    onChange={(e) => setGymInstagram(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Gym Facility Physical Address
                </label>
                <input
                  type="text"
                  value={gymLocation}
                  onChange={(e) => setGymLocation(e.target.value)}
                  className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  value={gymMapsUrl}
                  onChange={(e) => setGymMapsUrl(e.target.value)}
                  className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2 px-3 text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] hover:from-[#d89e34] hover:to-[#e08f06] text-slate-950 font-black py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#E5A93C]/20 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Save className="w-5 h-5 stroke-[2.5]" />
              <span>{isSaving ? 'Saving Changes to Cloud & Store...' : 'Save & Publish Member App Look'}</span>
            </button>
          </form>

          {/* RIGHT: REAL-TIME LIVE MEMBER APP PREVIEW (5 cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Live Member App Mockup</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Updates as you type
              </span>
            </div>

            {/* Mobile Device Frame */}
            <div className="rounded-[36px] bg-[#0E121B] border-4 border-[#252F44] p-3 shadow-2xl overflow-hidden max-w-sm mx-auto">
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-[#252F44] rounded-full mx-auto mb-3"></div>

              {/* Mock Member App Screen Content */}
              <div className="space-y-3 text-left">
                {/* Mock Member Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#1E2638]">
                  <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#E5A93C]">
                      <Image
                        src="/karnataka-gym-badge.png"
                        alt="Badge"
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block leading-tight">
                        {gymName || 'Karnataka Gym'}
                      </span>
                      <span className="text-[9px] text-[#E5A93C] block leading-none">
                        {gymTagline || 'Hubballi'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono text-slate-400 bg-[#161D2B] px-1.5 py-0.5 rounded">
                    +91 {gymPhone}
                  </span>
                </div>

                {/* Live Announcement Banner Preview */}
                {bannerActive && bannerText && (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-950/80 via-[#1A2234] to-amber-950/80 border border-[#E5A93C] space-y-0.5 shadow-md animate-in fade-in">
                    <span className="text-[8px] font-black text-[#E5A93C] uppercase tracking-wider block">
                      {bannerTag || 'ANNOUNCEMENT'}
                    </span>
                    <p className="text-[10px] font-bold text-white leading-tight">
                      {bannerText}
                    </p>
                  </div>
                )}

                {/* Mock Member Greeting */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[9px] font-bold text-[#E5A93C] uppercase tracking-wider block">
                      {welcomeSubtitle || 'Mera Gym Dashboard'}
                    </span>
                    <h3 className="text-sm font-extrabold text-white">
                      Namaste, Rahul
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1F2739] border border-[#2D3950] text-[#E5A93C] font-black flex items-center justify-center text-xs">
                    R
                  </div>
                </div>

                {/* Mock Mera Active Plan */}
                <div className="p-3 rounded-xl bg-[#141A26] border border-[#243046] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">MERA ACTIVE PLAN</span>
                    <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300">
                      Active
                    </span>
                  </div>
                  <div className="text-xs font-black text-white">12-Month Iron Warrior</div>
                  <div className="text-[9px] text-slate-400">Valid Till: 2026-12-31 • 327 Din Baki</div>
                </div>

                {/* Mock QR Check-in Button */}
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] text-slate-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-xs font-black">Scan QR at Entry</span>
                  </div>
                  <span className="text-[9px] font-extrabold bg-slate-950/20 px-2 py-0.5 rounded-full">
                    Hubballi Desk
                  </span>
                </div>

                {/* Mock Streak */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-[#141A26] border border-[#243046]">
                    <span className="text-[8px] text-slate-400 block uppercase font-bold">Streak</span>
                    <span className="text-sm font-black text-white">14 Days 🔥</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#141A26] border border-[#243046]">
                    <span className="text-[8px] text-slate-400 block uppercase font-bold">Goal</span>
                    <span className="text-sm font-black text-emerald-400">5/5 Days ✓</span>
                  </div>
                </div>

                {/* Live Motivational Quote Preview */}
                <div className="p-2.5 rounded-xl bg-[#141A26] border border-[#28354A] flex items-start gap-2 text-[10px]">
                  <Sparkles className="w-4 h-4 text-[#E5A93C] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">
                      {gymName || 'Karnataka Gym'} Motivation:
                    </span>
                    <span className="text-slate-300 italic leading-snug">
                      &quot;{motivationalQuote || 'Consistency beats intensity.'}&quot;
                    </span>
                  </div>
                </div>

                {/* Mock Mini Footer */}
                <div className="pt-2 border-t border-[#1E2638] text-[8px] text-slate-500 text-center leading-snug">
                  {gymLocation} • Helpline: {gymPhone}
                </div>
              </div>

              {/* Bottom Phone Indicator */}
              <div className="w-28 h-1 bg-[#252F44] rounded-full mx-auto mt-4"></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <OwnerBottomNav />
    </div>
  );
}
