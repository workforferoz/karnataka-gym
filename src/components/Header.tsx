'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGym } from '@/lib/store';
import {
  Phone,
  Bell,
  WifiOff,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Flame,
  X,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  onOpenTests?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTests }) => {
  const {
    currentUser,
    switchUser,
    users,
    notifications,
    dismissNotification,
    isOnline,
    offlineQueueCount,
    syncOfflineQueue
  } = useGym();

  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const userNotifications = notifications.filter(
    (n) => n.user_id === currentUser.id || currentUser.role === 'owner'
  );
  const unreadCount = userNotifications.filter((n) => !n.read_status).length;

  const handleSync = async () => {
    setIsSyncing(true);
    await syncOfflineQueue();
    setIsSyncing(false);
  };

  const keyUsers = [
    { id: 'member_rahul_desai', label: 'Rahul Desai (Active Streak 🔥)', badge: 'Member' },
    { id: 'member_priya_patil', label: 'Priya Patil (Expires in 4 Days)', badge: 'Expiring' },
    { id: 'member_prakash_hubli', label: 'Prakash Hubli (Absent 18 Days)', badge: 'Churn Risk' },
    { id: 'member_sneha_joshi', label: 'Sneha Joshi (Marketing Opt-out)', badge: 'Opted-Out' },
    { id: 'user_staff_suresh', label: 'Suresh (Front Desk)', badge: 'Staff' },
    { id: 'user_owner_manjunath', label: 'Manjunath (Owner - 9902667407)', badge: 'Owner' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0E121B]/95 backdrop-blur-md border-b border-[#232B3E] px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Gym Name */}
        <Link href={currentUser.role === 'owner' ? '/owner/dashboard' : '/member/home'} className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#E5A93C] shadow-lg shadow-[#E5A93C]/20 flex-shrink-0">
            <Image
              src="/karnataka-gym-logo.png"
              alt="Karnataka Gym Logo"
              width={40}
              height={40}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5 leading-none">
              KARNATAKA <span className="text-[#E5A93C]">GYM</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Hubballi • Retention PWA
            </span>
          </div>
        </Link>

        {/* Right Action Icons & User Switcher */}
        <div className="flex items-center gap-2">
          {/* Offline / Sync Banner */}
          {!isOnline && (
            <div className="flex items-center gap-1 bg-red-950/80 border border-red-800 text-red-200 text-xs px-2 py-1 rounded-full">
              <WifiOff className="w-3.5 h-3.5 animate-pulse text-red-400" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}

          {offlineQueueCount > 0 && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-1 bg-amber-950/80 border border-amber-700 text-amber-200 text-xs px-2.5 py-1 rounded-full hover:bg-amber-900 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#E5A93C] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync ({offlineQueueCount})</span>
            </button>
          )}

          {/* Phone Quick Call */}
          <a
            href="tel:9902667407"
            className="hidden md:flex items-center gap-1.5 bg-[#171D2B] border border-[#232B3E] hover:border-[#E5A93C] text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-300 transition-colors"
            title="Karnataka Gym Helpline"
          >
            <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>9902667407</span>
          </a>

          {/* Test Checklist Trigger */}
          {onOpenTests && (
            <button
              onClick={onOpenTests}
              className="flex items-center gap-1 bg-[#1C2436] hover:bg-[#253047] border border-[#354360] text-emerald-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Run 12-Item Test Checklist"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Test Checklist</span>
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-[#171D2B] border border-[#232B3E] hover:border-[#E5A93C] rounded-lg text-slate-300 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#121622] border border-[#232B3E] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-[#232B3E] pb-2 mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#E5A93C]" />
                    Gym Updates & Reminders
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
                  {userNotifications.length === 0 ? (
                    <div className="text-center py-4 text-slate-400">
                      Koi naya alert nahi hai. Sab mast hai! 💪
                    </div>
                  ) : (
                    userNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-2.5 bg-[#171D2B] rounded-lg border border-[#283248] flex flex-col gap-1 relative group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[11px] font-medium text-slate-200 leading-snug">
                            {notif.message}
                          </span>
                          <button
                            onClick={() => dismissNotification(notif.id)}
                            className="text-slate-500 hover:text-slate-300 ml-1"
                            title="Dismiss"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[9px] text-slate-400">
                          {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowSwitchMenu(!showSwitchMenu)}
              className="flex items-center gap-1.5 bg-[#171D2B] hover:bg-[#1E2538] border border-[#2C364C] px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-[#E5A93C] text-slate-950 font-bold flex items-center justify-center text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <span className="max-w-[85px] sm:max-w-[120px] truncate text-left">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#232B3E] text-[#E5A93C] font-bold">
                {currentUser.role}
              </span>
            </button>

            {/* Quick Switch Menu Dropdown */}
            {showSwitchMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-[#121622] border border-[#232B3E] rounded-xl shadow-2xl p-2.5 z-50">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
                  Switch Demo Account (Quick Test):
                </div>
                <div className="space-y-1">
                  {keyUsers.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        switchUser(item.id);
                        setShowSwitchMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        currentUser.id === item.id
                          ? 'bg-[#E5A93C]/15 border border-[#E5A93C]/40 text-[#E5A93C] font-semibold'
                          : 'text-slate-300 hover:bg-[#1A2130]'
                      }`}
                    >
                      <span className="truncate pr-2">{item.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1F2738] text-slate-300 font-bold flex-shrink-0">
                        {item.badge}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-[#232B3E] flex items-center justify-between px-1">
                  <Link
                    href="/login"
                    onClick={() => setShowSwitchMenu(false)}
                    className="text-[11px] text-[#E5A93C] hover:underline flex items-center gap-1"
                  >
                    All 30 Members List / Login
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

