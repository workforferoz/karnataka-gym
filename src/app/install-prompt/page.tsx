'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Download, Smartphone, Share, PlusSquare, ArrowLeft, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

export default function InstallPromptPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('Mobile browser menu (three dots ⋮ ya Share icon) par tap karke "Add to Home Screen" select karein!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Hero Card */}
        <div className="text-center p-6 rounded-3xl bg-gradient-to-b from-[#171D2B] to-[#101420] border-2 border-[#E5A93C]/40 space-y-4 shadow-2xl">
          <div className="relative w-20 h-20 mx-auto flex-shrink-0 drop-shadow-[0_4px_16px_rgba(229,169,60,0.35)]">
            <Image
              src="/karnataka-gym-logo.png"
              alt="Karnataka Gym"
              width={80}
              height={80}
              className="object-contain w-full h-full"
            />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Install Karnataka Gym App
            </h1>
            <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
              Add Karnataka Gym directly to your phone&apos;s home screen for fast 1-tap QR entry and offline streak tracking.
            </p>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] hover:from-[#d89e34] hover:to-[#e08f06] text-slate-950 font-black px-6 py-3 rounded-2xl text-sm shadow-xl shadow-[#E5A93C]/30 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>{installed ? 'App Already Installed! ✓' : 'Install App / Add to Home Screen'}</span>
          </button>
        </div>

        {/* Platform Step-by-Step Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Android Chrome */}
          <div className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <span>Android (Chrome / Edge)</span>
            </div>
            <ol className="text-xs text-slate-300 space-y-2.5 list-decimal list-inside leading-relaxed">
              <li>Open this website in <strong>Google Chrome</strong>.</li>
              <li>Tap the <strong>three dots menu (⋮)</strong> in the top-right corner.</li>
              <li>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>.</li>
              <li>Tap <strong>Add/Install</strong> to complete setup.</li>
            </ol>
          </div>

          {/* Apple iOS Safari */}
          <div className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-sm">
              <Share className="w-5 h-5 text-blue-400" />
              <span>Apple iPhone (iOS Safari)</span>
            </div>
            <ol className="text-xs text-slate-300 space-y-2.5 list-decimal list-inside leading-relaxed">
              <li>Open this website in <strong>Safari</strong>.</li>
              <li>Tap the <strong>Share button</strong> (square with arrow up) at the bottom.</li>
              <li>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.</li>
              <li>Tap <strong>Add</strong> in the top right corner.</li>
            </ol>
          </div>
        </div>

        {/* PWA Benefits */}
        <div className="p-5 rounded-2xl bg-[#121622] border border-[#232B3E] space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Why Karnataka Gym PWA?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-start gap-2 text-slate-300">
              <Zap className="w-4 h-4 text-[#E5A93C] flex-shrink-0 mt-0.5" />
              <span>Instant loading with 0-second launch time.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Works offline if Hubballi internet drops.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>Takes less than 1MB space on your smartphone.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

