'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, X, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show banner after short delay on mobile if not installed
    const timer = setTimeout(() => {
      if (!isInstalled) {
        setShowBanner(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Redirect to detailed PWA guide
      window.location.href = '/install-prompt';
    }
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-40 px-3 py-2 animate-in slide-in-from-top duration-300">
      <div className="max-w-md mx-auto bg-gradient-to-r from-[#171D2C] via-[#1E2538] to-[#171D2C] border-2 border-[#E5A93C]/80 rounded-2xl p-3 shadow-2xl shadow-black/80 flex items-center justify-between gap-3">
        {/* App Icon */}
        <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#E5A93C] flex-shrink-0 shadow-md">
          <Image
            src="/karnataka-gym-logo.png"
            alt="Karnataka Gym"
            width={44}
            height={44}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-white truncate">Karnataka Gym App</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#E5A93C]/20 text-[#E5A93C] rounded border border-[#E5A93C]/30">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-slate-300 truncate">
            {isIOS
              ? 'Safari me "Add to Home Screen" karein'
              : 'Install App for 1-tap QR check-in & offline pass'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg shadow-[#E5A93C]/30 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install</span>
          </button>

          <button
            onClick={() => setShowBanner(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

