'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DEFAULT_CONTENT,
  SiteContent,
  FacilityItem,
  TransformationItem,
} from '@/data/default-content';
import { InquiryRecord } from '@/lib/content-store';
import {
  Save,
  RotateCcw,
  ExternalLink,
  LogOut,
  Building2,
  Zap,
  BookOpen,
  Camera,
  Sparkles,
  Dumbbell,
  Tag,
  Inbox,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus,
  Phone,
  Calendar,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

type TabKey =
  | 'general'
  | 'hero'
  | 'about'
  | 'facilities'
  | 'transformations'
  | 'trainer'
  | 'pricing'
  | 'inquiries';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load active content and inquiries on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [contentRes, inqRes] = await Promise.all([
          fetch('/api/admin/content'),
          fetch('/api/inquiries'),
        ]);

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setContent(contentData);
        } else if (contentRes.status === 401) {
          router.push('/admin/login');
          return;
        }

        if (inqRes.ok) {
          const inqData = await inqRes.json();
          setInquiries(inqData.inquiries || []);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setToast({ type: 'error', message: 'Failed to load existing website content.' });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save content.');
      }

      setContent(data.content);
      setToast({ type: 'success', message: 'Website content saved successfully! Live website updated.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving changes.';
      setToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setSaving(true);
      setShowResetModal(false);
      const res = await fetch('/api/admin/content', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset.');
      setContent(data.content);
      setToast({ type: 'success', message: 'Reset all content to factory defaults.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error resetting content.';
      setToast({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  // Inquiry Status Updater
  const handleUpdateInquiryStatus = async (id: string, status: InquiryRecord['status']) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
        setToast({ type: 'success', message: 'Lead status updated.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Could not update status.' });
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry record?')) return;
    try {
      const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        setToast({ type: 'success', message: 'Inquiry record deleted.' });
      }
    } catch {
      setToast({ type: 'error', message: 'Could not delete inquiry.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07090E]">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-[#E5A93C] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-400">Loading Admin Operations Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07090E]">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border animate-in slide-in-from-top-2 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/60'
              : 'bg-rose-950/90 text-rose-200 border-rose-700/60'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Operations Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-[#1C2538] px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Brand & Badge */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-[#E5A93C]/40">
                <Image
                  src="/karnataka-gym-badge.png"
                  alt="Karnataka Gym"
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white tracking-wide">
                    KARNATAKA <span className="text-[#E5A93C]">GYM</span>
                  </span>
                  <span className="text-[9px] font-black uppercase bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30 px-2 py-0.5 rounded-full">
                    Admin CMS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Full Website Content & Operations Console
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="px-3 py-1.5 bg-[#E5A93C] text-slate-950 font-black text-xs rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? '...' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons Desktop */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#141A28] hover:bg-[#1E273A] border border-[#242F46] text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Preview Live Site</span>
            </Link>

            <button
              onClick={() => setShowResetModal(true)}
              disabled={saving}
              className="px-3 py-1.5 bg-[#141A28] hover:bg-rose-950/40 border border-[#242F46] hover:border-rose-800 text-slate-300 hover:text-rose-300 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              title="Reset all content to original defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-4 py-1.5 bg-[#E5A93C] hover:bg-[#F59E0B] disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-[#E5A93C]/20 flex items-center gap-1.5 cursor-pointer"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#141A28] rounded-xl transition-colors cursor-pointer"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar Tabs */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-1">
          <div className="p-3 mb-2 rounded-2xl bg-[#0F1420] border border-[#1E273A]">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
              Website Sections
            </span>
          </div>

          {[
            { key: 'general', label: 'Branding & Contact', icon: Building2 },
            { key: 'hero', label: 'Hero Headline & Stats', icon: Zap },
            { key: 'about', label: 'About & 4 Pillars', icon: BookOpen },
            { key: 'facilities', label: 'Facility Photos', icon: Camera, count: content.facilities.length },
            { key: 'transformations', label: 'Member Transformations', icon: Sparkles, count: content.transformations.length },
            { key: 'trainer', label: 'Head Coach Riyaz', icon: Dumbbell },
            { key: 'pricing', label: 'Membership Plans', icon: Tag, count: content.pricing.length },
            { key: 'inquiries', label: 'Walkthrough Leads', icon: Inbox, count: inquiries.filter((i) => i.status === 'new').length, badgeColor: 'bg-emerald-500' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E5A93C] text-slate-950 shadow-md shadow-[#E5A93C]/20'
                    : 'bg-[#0F1420] text-slate-300 hover:bg-[#141A28] hover:text-white border border-[#1E273A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-[#E5A93C]'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-slate-950 text-[#E5A93C]'
                        : tab.badgeColor
                        ? `${tab.badgeColor} text-slate-950 font-black`
                        : 'bg-[#1E273A] text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Edit Area */}
        <main className="flex-1 min-w-0">
          <div className="p-6 rounded-3xl bg-[#0F1420] border-2 border-[#1E273A] space-y-6 shadow-xl">
            {/* 1. GENERAL & CONTACT */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="border-b border-[#1E273A] pb-4">
                  <h2 className="text-base font-black text-white">General Business & Contact Information</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Controls brand identity, public contact numbers, WhatsApp gateway, address, and operational hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Gym Name</label>
                    <input
                      type="text"
                      value={content.general.gymName}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          general: { ...content.general, gymName: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Badge Subtitle</label>
                    <input
                      type="text"
                      value={content.general.badgeText}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          general: { ...content.general, badgeText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Official Phone Number</label>
                    <input
                      type="text"
                      value={content.general.phone}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          general: { ...content.general, phone: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">WhatsApp Number</label>
                    <input
                      type="text"
                      value={content.general.whatsapp}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          general: { ...content.general, whatsapp: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Instagram Handle</label>
                    <input
                      type="text"
                      value={content.general.instagram}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          general: { ...content.general, instagram: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-bold text-slate-300">Physical Facility Address</label>
                    <input
                      type="text"
                      value={content.general.address}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          general: { ...content.general, address: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-bold text-slate-300">Google Maps URL</label>
                    <input
                      type="url"
                      value={content.general.mapsUrl}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          general: { ...content.general, mapsUrl: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Morning Shift Hours</label>
                    <input
                      type="text"
                      value={content.general.morningHours}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          general: { ...content.general, morningHours: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Evening Shift Hours</label>
                    <input
                      type="text"
                      value={content.general.eveningHours}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          general: { ...content.general, eveningHours: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Sunday Hours</label>
                    <input
                      type="text"
                      value={content.general.sundayHours}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          general: { ...content.general, sundayHours: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. HERO HEADLINE & STATS */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="border-b border-[#1E273A] pb-4">
                  <h2 className="text-base font-black text-white">Hero Section Headline, Subtitle & Stat Pills</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Edit the first impression visitors see at the top of the homepage.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Live Status Bar Pill</label>
                    <input
                      type="text"
                      value={content.hero.liveStatusText}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, liveStatusText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Headline Top</label>
                      <input
                        type="text"
                        value={content.hero.headlinePart1}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, headlinePart1: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Headline Gold Highlight</label>
                      <input
                        type="text"
                        value={content.hero.headlineHighlight}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, headlineHighlight: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Headline Suffix</label>
                      <input
                        type="text"
                        value={content.hero.headlinePart2}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, headlinePart2: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Hero Subtitle Paragraph</label>
                    <textarea
                      rows={3}
                      value={content.hero.subtitle}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  {/* 4 Stats Ticker Items */}
                  <div className="pt-4 border-t border-[#1E273A] space-y-3">
                    <span className="font-bold text-slate-300 block">
                      Trust Metric Pills (Horizontal Ticker)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {content.hero.stats.map((st, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400">Metric #{idx + 1}</span>
                            <label className="flex items-center gap-1.5 text-[10px] text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={st.highlight}
                                onChange={(e) => {
                                  const updated = [...content.hero.stats];
                                  updated[idx] = { ...st, highlight: e.target.checked };
                                  setContent({ ...content, hero: { ...content.hero, stats: updated } });
                                }}
                                className="rounded text-[#E5A93C] focus:ring-0"
                              />
                              <span>Gold Highlight</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            placeholder="Value (e.g. 14+ Years)"
                            value={st.value}
                            onChange={(e) => {
                              const updated = [...content.hero.stats];
                              updated[idx] = { ...st, value: e.target.value };
                              setContent({ ...content, hero: { ...content.hero, stats: updated } });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-white font-bold"
                          />
                          <input
                            type="text"
                            placeholder="Label (e.g. Hubballi Legacy)"
                            value={st.label}
                            onChange={(e) => {
                              const updated = [...content.hero.stats];
                              updated[idx] = { ...st, label: e.target.value };
                              setContent({ ...content, hero: { ...content.hero, stats: updated } });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ABOUT & 4 PILLARS */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="border-b border-[#1E273A] pb-4">
                  <h2 className="text-base font-black text-white">About Section & 4 Core Pillars</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Define the gym&apos;s ethos, heritage, and the 4 numbered training pillars.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Eyebrow Tag</label>
                    <input
                      type="text"
                      value={content.about.eyebrow}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, eyebrow: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Section Heading</label>
                    <input
                      type="text"
                      value={content.about.heading}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, heading: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">About Description Paragraph</label>
                    <textarea
                      rows={3}
                      value={content.about.description}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, description: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  {/* 4 Pillars */}
                  <div className="pt-4 border-t border-[#1E273A] space-y-3">
                    <span className="font-bold text-white block">
                      The 4 Architectural Pillars
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {content.about.pillars.map((pillar, idx) => (
                        <div key={pillar.id} className="p-4 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={pillar.number}
                              onChange={(e) => {
                                const updated = [...content.about.pillars];
                                updated[idx] = { ...pillar, number: e.target.value };
                                setContent({ ...content, about: { ...content.about, pillars: updated } });
                              }}
                              className="w-12 px-2 py-1 text-center bg-[#0F1420] border border-[#242F46] rounded-lg text-[#E5A93C] font-black"
                            />
                            <input
                              type="text"
                              value={pillar.title}
                              onChange={(e) => {
                                const updated = [...content.about.pillars];
                                updated[idx] = { ...pillar, title: e.target.value };
                                setContent({ ...content, about: { ...content.about, pillars: updated } });
                              }}
                              placeholder="Pillar Title"
                              className="flex-1 px-3 py-1 bg-[#0F1420] border border-[#242F46] rounded-lg text-white font-bold"
                            />
                          </div>
                          <textarea
                            rows={3}
                            value={pillar.desc}
                            onChange={(e) => {
                              const updated = [...content.about.pillars];
                              updated[idx] = { ...pillar, desc: e.target.value };
                              setContent({ ...content, about: { ...content.about, pillars: updated } });
                            }}
                            placeholder="Pillar Description"
                            className="w-full px-3 py-2 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. FACILITY TOUR PHOTOS */}
            {activeTab === 'facilities' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E273A] pb-4">
                  <div>
                    <h2 className="text-base font-black text-white">Facility Tour Equipment Cards</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Manage real photos of the gym floor, Olympic stations, and machines.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newId = `facility-${Date.now()}`;
                      const newCard: FacilityItem = {
                        id: newId,
                        src: '/facility/gym-floor-wide.webp',
                        title: 'New Equipment Station',
                        tag: 'Training Zone',
                        specs: 'Commercial Specs',
                        desc: 'Detailed description of the equipment station.',
                      };
                      setContent({ ...content, facilities: [...content.facilities, newCard] });
                    }}
                    className="px-3 py-1.5 bg-[#E5A93C] text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Facility Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {content.facilities.map((fac, idx) => (
                    <div key={fac.id} className="p-4 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#E5A93C]">Card #{idx + 1}</span>
                        <button
                          onClick={() => {
                            if (content.facilities.length <= 1) {
                              alert('You must keep at least 1 facility card.');
                              return;
                            }
                            setContent({
                              ...content,
                              facilities: content.facilities.filter((_, i) => i !== idx),
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Delete Card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Station Title</label>
                        <input
                          type="text"
                          value={fac.title}
                          onChange={(e) => {
                            const updated = [...content.facilities];
                            updated[idx] = { ...fac, title: e.target.value };
                            setContent({ ...content, facilities: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-white font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Category Tag</label>
                          <input
                            type="text"
                            value={fac.tag}
                            onChange={(e) => {
                              const updated = [...content.facilities];
                              updated[idx] = { ...fac, tag: e.target.value };
                              setContent({ ...content, facilities: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Photo URL</label>
                          <input
                            type="text"
                            value={fac.src}
                            onChange={(e) => {
                              const updated = [...content.facilities];
                              updated[idx] = { ...fac, src: e.target.value };
                              setContent({ ...content, facilities: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300 text-[10px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Equipment Specs (Bullet)</label>
                        <input
                          type="text"
                          value={fac.specs}
                          onChange={(e) => {
                            const updated = [...content.facilities];
                            updated[idx] = { ...fac, specs: e.target.value };
                            setContent({ ...content, facilities: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Description</label>
                        <textarea
                          rows={2}
                          value={fac.desc}
                          onChange={(e) => {
                            const updated = [...content.facilities];
                            updated[idx] = { ...fac, desc: e.target.value };
                            setContent({ ...content, facilities: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. MEMBER TRANSFORMATIONS */}
            {activeTab === 'transformations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E273A] pb-4">
                  <div>
                    <h2 className="text-base font-black text-white">Real Member Transformations</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Showcase before-and-after results, duration, and key member achievements.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newId = `transformation-${Date.now()}`;
                      const newTr: TransformationItem = {
                        id: newId,
                        src: '/transformations/transformation-1-male-fatloss.webp',
                        title: 'New Member Transformation',
                        badge: 'Fat Loss & Muscle • 16 Weeks',
                        story: 'Member story and fitness routine details.',
                        achievements: ['Consistent workout discipline', 'Healthy nutrition framework'],
                      };
                      setContent({ ...content, transformations: [...content.transformations, newTr] });
                    }}
                    className="px-3 py-1.5 bg-[#E5A93C] text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Transformation</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {content.transformations.map((tr, idx) => (
                    <div key={tr.id} className="p-4 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#E5A93C]">Story #{idx + 1}</span>
                        <button
                          onClick={() => {
                            if (content.transformations.length <= 1) {
                              alert('You must keep at least 1 transformation.');
                              return;
                            }
                            setContent({
                              ...content,
                              transformations: content.transformations.filter((_, i) => i !== idx),
                            });
                          }}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Delete Transformation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Title / Focus</label>
                          <input
                            type="text"
                            value={tr.title}
                            onChange={(e) => {
                              const updated = [...content.transformations];
                              updated[idx] = { ...tr, title: e.target.value };
                              setContent({ ...content, transformations: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-white font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Badge (e.g. 18kg • 20 Wks)</label>
                          <input
                            type="text"
                            value={tr.badge}
                            onChange={(e) => {
                              const updated = [...content.transformations];
                              updated[idx] = { ...tr, badge: e.target.value };
                              setContent({ ...content, transformations: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Photo URL</label>
                        <input
                          type="text"
                          value={tr.src}
                          onChange={(e) => {
                            const updated = [...content.transformations];
                            updated[idx] = { ...tr, src: e.target.value };
                            setContent({ ...content, transformations: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300 text-[10px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Story</label>
                        <textarea
                          rows={2}
                          value={tr.story}
                          onChange={(e) => {
                            const updated = [...content.transformations];
                            updated[idx] = { ...tr, story: e.target.value };
                            setContent({ ...content, transformations: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                        />
                      </div>

                      {/* Achievements */}
                      <div className="space-y-1.5 pt-2 border-t border-[#242F46]">
                        <label className="text-[11px] font-bold text-slate-300 block">
                          Achievements (comma separated)
                        </label>
                        <input
                          type="text"
                          value={tr.achievements.join(', ')}
                          onChange={(e) => {
                            const updated = [...content.transformations];
                            const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            updated[idx] = { ...tr, achievements: list };
                            setContent({ ...content, transformations: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. HEAD COACH RIYAZ */}
            {activeTab === 'trainer' && (
              <div className="space-y-6">
                <div className="border-b border-[#1E273A] pb-4">
                  <h2 className="text-base font-black text-white">Head Coach Riyaz & Gallery Photos</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update coach bio, years of competitive experience, specialties, and 4 photo poses.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Coach Name</label>
                    <input
                      type="text"
                      value={content.trainer.name}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          trainer: { ...content.trainer, name: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Coach Title</label>
                    <input
                      type="text"
                      value={content.trainer.title}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          trainer: { ...content.trainer, title: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Experience Tagline</label>
                    <input
                      type="text"
                      value={content.trainer.experience}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          trainer: { ...content.trainer, experience: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Instagram Handle</label>
                    <input
                      type="text"
                      value={content.trainer.instagramHandle}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          trainer: { ...content.trainer, instagramHandle: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-bold text-slate-300">Coach Bio</label>
                    <textarea
                      rows={3}
                      value={content.trainer.bio}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          trainer: { ...content.trainer, bio: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="font-bold text-slate-300">
                      Coaching Specialties (comma separated)
                    </label>
                    <input
                      type="text"
                      value={content.trainer.specialties.join(', ')}
                      onChange={(e) => {
                        const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        setContent({
                          ...content,
                          trainer: { ...content.trainer, specialties: list },
                        });
                      }}
                      className="w-full px-3.5 py-2.5 bg-[#141A28] border border-[#242F46] rounded-xl text-white focus:outline-none focus:border-[#E5A93C]"
                    />
                  </div>
                </div>

                {/* 4 Coach Photos */}
                <div className="pt-4 border-t border-[#1E273A] space-y-3">
                  <span className="font-bold text-white text-xs block">
                    Coach Gallery Cards (4 Photos)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {content.trainer.photos.map((photo, idx) => (
                      <div key={photo.id} className="p-3.5 rounded-2xl bg-[#141A28] border border-[#242F46] space-y-2">
                        <span className="text-[10px] font-bold text-[#E5A93C]">Photo #{idx + 1}</span>
                        <input
                          type="text"
                          value={photo.title}
                          placeholder="Photo Title"
                          onChange={(e) => {
                            const updated = [...content.trainer.photos];
                            updated[idx] = { ...photo, title: e.target.value };
                            setContent({
                              ...content,
                              trainer: { ...content.trainer, photos: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-white font-bold"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={photo.tag}
                            placeholder="Tag"
                            onChange={(e) => {
                              const updated = [...content.trainer.photos];
                              updated[idx] = { ...photo, tag: e.target.value };
                              setContent({
                                ...content,
                                trainer: { ...content.trainer, photos: updated },
                              });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                          />
                          <input
                            type="text"
                            value={photo.src}
                            placeholder="Photo URL"
                            onChange={(e) => {
                              const updated = [...content.trainer.photos];
                              updated[idx] = { ...photo, src: e.target.value };
                              setContent({
                                ...content,
                                trainer: { ...content.trainer, photos: updated },
                              });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300 text-[10px]"
                          />
                        </div>
                        <input
                          type="text"
                          value={photo.desc}
                          placeholder="Description"
                          onChange={(e) => {
                            const updated = [...content.trainer.photos];
                            updated[idx] = { ...photo, desc: e.target.value };
                            setContent({
                              ...content,
                              trainer: { ...content.trainer, photos: updated },
                            });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. MEMBERSHIP PRICING */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="border-b border-[#1E273A] pb-4">
                  <h2 className="text-base font-black text-white">Membership Plans & Pricing</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update membership fees, duration, badge highlights, and feature checklists.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {content.pricing.map((plan, idx) => (
                    <div
                      key={plan.id}
                      className={`p-4 rounded-2xl border space-y-3 ${
                        plan.highlight
                          ? 'bg-[#141A28] border-[#E5A93C]/60'
                          : 'bg-[#141A28] border-[#242F46]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#E5A93C]">Plan #{idx + 1}</span>
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={plan.highlight}
                            onChange={(e) => {
                              const updated = [...content.pricing];
                              updated[idx] = { ...plan, highlight: e.target.checked };
                              setContent({ ...content, pricing: updated });
                            }}
                            className="rounded text-[#E5A93C] focus:ring-0"
                          />
                          <span>Highlight Plan</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Plan Name</label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => {
                              const updated = [...content.pricing];
                              updated[idx] = { ...plan, name: e.target.value };
                              setContent({ ...content, pricing: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-white font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Price Display</label>
                          <input
                            type="text"
                            value={plan.price}
                            onChange={(e) => {
                              const updated = [...content.pricing];
                              updated[idx] = { ...plan, price: e.target.value };
                              setContent({ ...content, pricing: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-[#E5A93C] font-black"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Duration</label>
                          <input
                            type="text"
                            value={plan.duration}
                            onChange={(e) => {
                              const updated = [...content.pricing];
                              updated[idx] = { ...plan, duration: e.target.value };
                              setContent({ ...content, pricing: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300">Per Month Breakdown</label>
                          <input
                            type="text"
                            value={plan.perMonth}
                            onChange={(e) => {
                              const updated = [...content.pricing];
                              updated[idx] = { ...plan, perMonth: e.target.value };
                              setContent({ ...content, pricing: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">
                          Badge Tag (e.g. Most Popular, or empty)
                        </label>
                        <input
                          type="text"
                          value={plan.badge || ''}
                          onChange={(e) => {
                            const updated = [...content.pricing];
                            updated[idx] = { ...plan, badge: e.target.value || null };
                            setContent({ ...content, pricing: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300">Description</label>
                        <input
                          type="text"
                          value={plan.description}
                          onChange={(e) => {
                            const updated = [...content.pricing];
                            updated[idx] = { ...plan, description: e.target.value };
                            setContent({ ...content, pricing: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                        />
                      </div>

                      {/* Features List */}
                      <div className="space-y-1.5 pt-2 border-t border-[#242F46]">
                        <label className="text-[11px] font-bold text-slate-300 block">
                          Features (one per line)
                        </label>
                        <textarea
                          rows={4}
                          value={plan.features.join('\n')}
                          onChange={(e) => {
                            const updated = [...content.pricing];
                            const list = e.target.value.split('\n').map((s) => s.trim()).filter(Boolean);
                            updated[idx] = { ...plan, features: list };
                            setContent({ ...content, pricing: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#0F1420] border border-[#242F46] rounded-lg text-slate-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. INQUIRIES / LEADS INBOX */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E273A] pb-4">
                  <div>
                    <h2 className="text-base font-black text-white">Walkthrough Inquiries & Member Leads</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Direct visitor leads submitted through the gym walkthrough scheduler.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Total Leads: {inquiries.length}
                  </span>
                </div>

                {inquiries.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">No walkthrough inquiries received yet.</p>
                    <p className="text-[11px] text-slate-500">
                      When visitors schedule visits on the public website, they will appear here immediately.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-2xl bg-[#141A28] border border-[#242F46] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-sm text-white">{inq.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                inq.status === 'new'
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : inq.status === 'contacted'
                                  ? 'bg-blue-400/20 text-blue-300 border border-blue-400/40'
                                  : inq.status === 'completed'
                                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {inq.status}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 text-[11px]">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#E5A93C]" />
                              Visit: <strong>{inq.date}</strong> ({inq.time})
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5 text-[#E5A93C]" />
                              Goal: <strong className="capitalize">{inq.goal.replace('_', ' ')}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Quick Contact & Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                          <a
                            href={`tel:${inq.phone}`}
                            className="p-2 rounded-xl bg-[#0F1420] hover:bg-[#1E273A] border border-[#242F46] text-[#E5A93C] transition-colors"
                            title={`Call ${inq.phone}`}
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          <a
                            href={`https://wa.me/91${inq.phone}?text=Hi%20${encodeURIComponent(
                              inq.name
                            )}%2C%20Coach%20Riyaz%20from%20Karnataka%20Gym%20Hubballi%20here%20regarding%20your%20walkthrough%20request.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-[#0F1420] hover:bg-[#1E273A] border border-[#242F46] text-emerald-400 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <WhatsAppIcon className="w-4 h-4" />
                          </a>

                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleUpdateInquiryStatus(inq.id, e.target.value as InquiryRecord['status'])
                            }
                            className="bg-[#0F1420] border border-[#242F46] text-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#E5A93C]"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                          </select>

                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-2 rounded-xl bg-[#0F1420] hover:bg-rose-950/40 border border-[#242F46] hover:border-rose-800 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0F1420] border-2 border-[#1E273A] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-black text-white">Reset to Factory Defaults?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will restore all headings, contact details, facility cards, transformations, trainer info, and pricing plans to their initial defaults. Any unsaved edits will be discarded.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-[#141A28] hover:bg-[#1E273A] text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
