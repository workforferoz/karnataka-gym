'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  });

  useEffect(() => {
    if (isInstalled) return;

    try {
      if (sessionStorage.getItem('karnataka_gym_pwa_dismissed') === 'true') {
        return;
      }
    } catch {
      // ignore
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android/.test(userAgent);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    let timer: NodeJS.Timeout | undefined;
    if (isMobile) {
      timer = setTimeout(() => {
        try {
          if (sessionStorage.getItem('karnataka_gym_pwa_dismissed') !== 'true') {
            setShowBanner(true);
          }
        } catch {
          // ignore
        }
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (timer) clearTimeout(timer);
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
      router.push('/install-prompt');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem('karnataka_gym_pwa_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in fade-in duration-200">
      <div className="bg-[#121622] border-2 border-[#E5A93C] rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3">
        {/* App Icon */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 drop-shadow-[0_2px_8px_rgba(229,169,60,0.35)]">
          <Image
            src="/karnataka-gym-badge.png"
            alt="Karnataka Gym"
            width={40}
            height={40}
            className="w-full h-full object-contain rounded-full"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-black text-white truncate block">
            Karnataka Gym App
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss app install banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
