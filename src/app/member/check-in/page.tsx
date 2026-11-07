'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MemberBottomNav } from '@/components/MemberBottomNav';
import {
  QrCode,
  Camera,
  CheckCircle,
  AlertTriangle,
  XCircle,
  WifiOff,
  RefreshCw,
  Flame,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export default function MemberCheckInPage() {
  const { currentUser, recordCheckin, isOnline, memberships, streaks } = useGym();

  const [activeTab, setActiveTab] = useState<'my_qr' | 'scanner'>('my_qr');
  const [sessionToken, setSessionToken] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'success' | 'duplicate' | 'expired' | 'offline';
    message: string;
    streak?: number;
  }>({ status: 'idle', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCameraPermissionModal, setShowCameraPermissionModal] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const membership = memberships.find((m) => m.user_id === currentUser.id);
  const streak = streaks.find((s) => s.user_id === currentUser.id);

  // Generate dynamic session-bound token (changes every 60s for anti-screenshot security)
  useEffect(() => {
    const generateToken = () => {
      const now = new Date();
      const timeSlot = Math.floor(now.getTime() / 60000);
      return `KG-PASS-${currentUser.id.substring(0, 8)}-${timeSlot}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    };

    setSessionToken(generateToken());
    const interval = setInterval(() => {
      setSessionToken(generateToken());
    }, 30000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  // Handle Scan Action
  const handleSimulateScan = async () => {
    setIsProcessing(true);
    setScanResult({ status: 'idle', message: '' });

    try {
      const res = await recordCheckin(currentUser.id, 'qr');

      if (res.code === 'VALID') {
        setScanResult({
          status: 'success',
          message: res.message,
          streak: res.streak?.current_streak
        });
      } else if (res.code === 'DUPLICATE') {
        setScanResult({
          status: 'duplicate',
          message: res.message
        });
      } else if (res.code === 'EXPIRED') {
        setScanResult({
          status: 'expired',
          message: res.message
        });
      } else if (res.code === 'OFFLINE_QUEUED') {
        setScanResult({
          status: 'offline',
          message: res.message
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const requestCameraAccess = () => {
    setShowCameraPermissionModal(true);
  };

  const handleGrantPermission = async () => {
    setShowCameraPermissionModal(false);
    setCameraActive(true);
    // Auto-simulate scan after camera turns on for a seamless experience
    setTimeout(() => {
      handleSimulateScan();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-5 space-y-5">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/member/home"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mera Home</span>
          </Link>

          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/30 px-2 py-0.5 rounded-full">
            Session Bound QR Pass
          </span>
        </div>

        {/* Tab Switcher: Show My QR vs Camera Scanner */}
        <div className="flex rounded-2xl bg-[#121622] p-1.5 border border-[#232B3E]">
          <button
            onClick={() => setActiveTab('my_qr')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'my_qr'
                ? 'bg-[#E5A93C] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 stroke-[2.5]" />
            <span>Mera Entry QR</span>
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-[#E5A93C] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
            <span>Scan Gym Counter</span>
          </button>
        </div>

        {/* Scan Status Toast / Banner */}
        {scanResult.status === 'success' && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 shadow-xl flex items-start gap-3 animate-in zoom-in-95 duration-200">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-emerald-300 block">
                ENTRY APPROVED! ✓
              </span>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                {scanResult.message}
              </p>
              {scanResult.streak && (
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 pt-1">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>Workout Streak: {scanResult.streak} Din</span>
                </div>
              )}
            </div>
          </div>
        )}

        {scanResult.status === 'duplicate' && (
          <div className="p-4 rounded-2xl bg-amber-950/80 border-2 border-amber-600 shadow-xl flex items-start gap-3 animate-in zoom-in-95 duration-200">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-amber-300 block">
                DUPLICATE SCAN REJECTED
              </span>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                {scanResult.message}
              </p>
            </div>
          </div>
        )}

        {scanResult.status === 'expired' && (
          <div className="p-4 rounded-2xl bg-red-950/80 border-2 border-red-600 shadow-xl flex items-start gap-3 animate-in zoom-in-95 duration-200">
            <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-red-300 block">
                ENTRY BLOCKED - EXPIRED
              </span>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                {scanResult.message}
              </p>
              <Link
                href="/member/renew"
                className="inline-block bg-[#E5A93C] text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg shadow"
              >
                Renew Plan Online
              </Link>
            </div>
          </div>
        )}

        {scanResult.status === 'offline' && (
          <div className="p-4 rounded-2xl bg-blue-950/80 border-2 border-blue-500 shadow-xl flex items-start gap-3 animate-in zoom-in-95 duration-200">
            <WifiOff className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-blue-300 block">
                OFFLINE SYNC QUEUED
              </span>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                {scanResult.message}
              </p>
            </div>
          </div>
        )}

        {/* Tab 1: Member's Dynamic QR Pass */}
        {activeTab === 'my_qr' && (
          <div className="rounded-3xl bg-[#121622] border-2 border-[#232B3E] p-6 text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5A93C]/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E5A93C] block mb-1">
                KARNATAKA GYM • DIGITAL ENTRY PASS
              </span>
              <h2 className="text-xl font-black text-white">{currentUser.name}</h2>
              <span className="text-xs text-slate-400 font-mono">+91 {currentUser.phone}</span>
            </div>

            {/* QR Visual Canvas */}
            <div className="relative mx-auto w-64 h-64 bg-white rounded-3xl p-4 flex flex-col items-center justify-between shadow-2xl border-4 border-[#E5A93C]">
              {/* Corner markers */}
              <div className="w-full flex justify-between">
                <div className="w-10 h-10 border-4 border-slate-950 rounded-lg flex items-center justify-center p-1">
                  <div className="w-4 h-4 bg-slate-950 rounded" />
                </div>
                <div className="w-10 h-10 border-4 border-slate-950 rounded-lg flex items-center justify-center p-1">
                  <div className="w-4 h-4 bg-slate-950 rounded" />
                </div>
              </div>

              {/* Center gym logo & QR grid illustration */}
              <div className="relative flex flex-col items-center justify-center space-y-1">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#E5A93C] shadow-md">
                  <img
                    src="/karnataka-gym-logo.png"
                    alt="Karnataka Gym"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[9px] font-black font-mono text-slate-900 bg-amber-100 px-2 py-0.5 rounded">
                  {sessionToken.substring(0, 16)}...
                </div>
              </div>

              {/* Bottom markers */}
              <div className="w-full flex justify-between items-end">
                <div className="w-10 h-10 border-4 border-slate-950 rounded-lg flex items-center justify-center p-1">
                  <div className="w-4 h-4 bg-slate-950 rounded" />
                </div>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                  Dynamic • Hubballi
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-300 font-medium block">
                Show this QR pass at the entrance scanner or front desk turnstile.
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Auto-refreshes every 30s • Prevents proxy check-in
              </span>
            </div>

            {/* 1-Tap Check-in Simulator Button */}
            <button
              onClick={handleSimulateScan}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] hover:from-[#d89e34] hover:to-[#e08f06] text-slate-950 font-black py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#E5A93C]/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 stroke-[2.5] ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Verifying Entry...' : 'Simulate Counter Check-in Scan'}</span>
            </button>
          </div>
        )}

        {/* Tab 2: Camera Scanner Simulator */}
        {activeTab === 'scanner' && (
          <div className="rounded-3xl bg-[#121622] border-2 border-[#232B3E] p-6 text-center space-y-5 shadow-2xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E5A93C] block mb-1">
                CAMERA QR SCANNER
              </span>
              <h2 className="text-lg font-extrabold text-white">Scan Gym Counter Code</h2>
              <p className="text-xs text-slate-400">
                Point your mobile camera at Karnataka Gym counter entrance QR.
              </p>
            </div>

            {/* Viewfinder simulation */}
            <div className="relative mx-auto w-64 h-64 bg-slate-950 rounded-3xl border-2 border-dashed border-[#E5A93C] flex flex-col items-center justify-center p-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#E5A93C]/10 via-transparent to-[#E5A93C]/10 pointer-events-none" />

              {/* Animated scanning laser line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E5A93C] to-transparent animate-pulse" />

              <Camera className="w-12 h-12 text-slate-600 mb-2" />
              <span className="text-xs font-bold text-slate-300">Align QR inside box</span>
              <span className="text-[10px] text-slate-500 mt-1">Automatic high-speed detection</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {!cameraActive ? (
                <button
                  onClick={requestCameraAccess}
                  className="w-full bg-[#1F2739] hover:bg-[#28324A] border border-[#354360] text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#E5A93C]" />
                  <span>Request Live Camera Permission</span>
                </button>
              ) : (
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-semibold">
                  Camera feed active. Aligning...
                </div>
              )}

              <button
                onClick={handleSimulateScan}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] text-slate-950 font-black py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <QrCode className="w-4 h-4 stroke-[2.5]" />
                <span>Simulate Scan Gym Code</span>
              </button>
            </div>
          </div>
        )}

        {/* Explanatory Camera Permission Modal */}
        {showCameraPermissionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-[#121622] border-2 border-[#E5A93C] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/20 text-[#E5A93C] flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-extrabold text-white">Camera Access Required</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Karnataka Gym PWA uses your smartphone camera strictly to scan the gym counter QR code for rapid contactless entry. No photos or videos are stored.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCameraPermissionModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#2B354B] text-slate-400 font-semibold text-xs hover:bg-[#1A202E]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGrantPermission}
                  className="flex-1 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-extrabold text-xs shadow-lg shadow-[#E5A93C]/20"
                >
                  Allow Camera
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rules note */}
        <div className="p-3.5 rounded-2xl bg-[#121622] border border-[#1F2739] text-slate-400 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-slate-200 font-bold">
            <Info className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Anti-Duplicate Security Policy:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Ek scan ke baad 5 minute ka cooldown rehta hai taaki duplicate entry na ho. Internet disconnected hone par check-in offline queue ho jayega.
          </p>
        </div>
      </main>

      <Footer />
      <MemberBottomNav />
    </div>
  );
}
