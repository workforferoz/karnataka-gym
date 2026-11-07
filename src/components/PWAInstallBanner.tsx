'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, X } from 'lucide-react';

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
    // Check if dismissed in this session
    try {
      if (sessionStorage.getItem('karnataka_gym_pwa_dismissed') === 'true') {
        return;
      }
    } catch (e) {
      // ignore
    }

    // Check if running in standalone mode (already installed)
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS mobile
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android/.test(userAgent);
    const iOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(iOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Only prompt on mobile devices, not on desktop browser
    if (isMobile) {
      const timer = setTimeout(() => {
        try {
          if (sessionStorage.getItem('karnataka_gym_pwa_dismissed') !== 'true') {
            setShowBanner(true);
          }
        } catch (e) {}
      }, 3000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        clearTimeout(timer);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      window.location.href = '/install-prompt';
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem('karnataka_gym_pwa_dismissed', 'true');
    } catch (e) {}
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in fade-in duration-200">
      <div className="bg-[#121622] border-2 border-[#E5A93C] rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3">
        {/* App Icon */}
        <div className="relative w-10 h-10 flex-shrink-0 drop-shadow-[0_2px_8px_rgba(229,169,60,0.35)]">
          <Image
            src="/karnataka-gym-logo.png"
            alt="Karnataka Gym"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white truncate">Karnataka Gym App</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#E5A93C]/20 text-[#E5A93C] rounded border border-[#E5A93C]/30">
              PWA
            </span>
          </div>
          <p className="text-[11px] text-slate-300 truncate">
            {isIOS ? 'Tap Share > "Add to Home Screen"' : 'Install for instant QR check-in'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
