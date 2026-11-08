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
  X,
  ExternalLink,
  Menu,
  Home,
  QrCode,
  Calendar,
  ShoppingBag,
  User,
  Shield,
  FileText,
  Mail,
  Trash2,
  Globe,
  LogOut,
  Lock,
  LogIn
} from 'lucide-react';

interface HeaderProps {
  onOpenTests?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTests }) => {
  const {
    currentUser,
    isLoggedIn,
    switchUser,
    logout,
    notifications,
    dismissNotification,
    isOnline,
    offlineQueueCount,
    syncOfflineQueue,
    settings
  } = useGym();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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


  return (
    <header className="sticky top-0 z-40 bg-[#0E121B] px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Gym Name */}
        <Link
          href={currentUser.role === 'owner' ? '/owner/dashboard' : '/member/home'}
          className="flex items-center gap-2.5 focus-visible:outline-none"
          aria-label="Karnataka Gym Hubballi Home"
        >
          <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 drop-shadow-[0_2px_8px_rgba(229,169,60,0.35)]">
            <Image
              src="/karnataka-gym-badge.png"
              alt="Karnataka Gym Hubballi"
              width={44}
              height={44}
              className="object-contain w-full h-full rounded-full"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5 leading-none">
              KARNATAKA <span className="text-[#E5A93C]">GYM</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
              Hubballi • Est. 2011
            </span>
          </div>
        </Link>

        {/* Right Action Icons & User Switcher */}
        <div className="flex items-center gap-2">
          {/* Offline / Sync Banner */}
          {!isOnline && (
            <div className="flex items-center gap-1 bg-red-950/80 border border-red-800 text-red-200 text-xs px-2 py-1 rounded-full">
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
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

          {/* Clickable Phone Quick Call */}
          <a
            href={`tel:${settings.gym_phone || '9902667407'}`}
            className="hidden md:flex items-center gap-1.5 bg-[#171D2B] border border-[#232B3E] hover:border-[#E5A93C] text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-300 transition-colors"
            title="Call Karnataka Gym Helpline"
          >
            <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>{settings.gym_phone || '9902667407'}</span>
          </a>

          {/* Clickable Email */}
          <a
            href={`mailto:${settings.gym_email || 'karnatakagymhubli@gmail.com'}`}
            className="hidden lg:flex items-center gap-1.5 bg-[#171D2B] border border-[#232B3E] hover:border-[#E5A93C] text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-300 transition-colors"
            title="Email Karnataka Gym"
          >
            <Mail className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>Email</span>
          </a>

          {/* Public Website Link */}
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 bg-[#171D2B] border border-[#232B3E] hover:border-[#E5A93C] text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-300 transition-colors"
            title="View Public Gym Website"
          >
            <Globe className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span className="hidden lg:inline">Gym Website</span>
          </Link>

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
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#121622] border border-[#232B3E] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2">
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
                      No pending notifications. All caught up.
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

          {/* User Session Action (No demo switcher) */}
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="flex items-center gap-1.5 bg-[#171D2B] hover:bg-red-950/40 border border-[#2C364C] hover:border-red-600/50 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-red-400 transition-all cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-[#E5A93C] hover:bg-[#F59E0B] px-3 py-1.5 rounded-lg text-xs font-black text-slate-950 shadow-md transition-all"
            >
              <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden p-2 bg-[#171D2B] border border-[#232B3E] hover:border-[#E5A93C] rounded-lg text-slate-300"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-72 bg-[#101420] border-l border-[#232B3E] h-full flex flex-col p-4 shadow-2xl animate-in slide-in-from-right duration-250">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/karnataka-gym-badge.png"
                    alt="Karnataka Gym"
                    width={32}
                    height={32}
                    className="object-contain w-full h-full rounded-full"
                  />
                </div>
                <span className="text-sm font-bold text-white">Karnataka Gym</span>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 overflow-y-auto py-3 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2 block mb-1">
                Member Portal
              </span>
              <Link
                href="/member/home"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-[#181F2F]"
              >
                <Home className="w-4 h-4 text-[#E5A93C]" />
                <span>Member Home</span>
              </Link>
              <Link
                href="/member/check-in"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-[#181F2F]"
              >
                <QrCode className="w-4 h-4 text-[#E5A93C]" />
                <span>QR Check-in Pass</span>
              </Link>
              <Link
                href="/member/history"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-[#181F2F]"
              >
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Attendance History</span>
              </Link>
              <Link
                href="/member/renew"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-[#181F2F]"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Renew Membership</span>
              </Link>
              <Link
                href="/member/add-ons"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-[#181F2F]"
              >
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                <span>PT & Diet Marketplace</span>
              </Link>
              <Link
                href="/member/profile"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-[#181F2F]"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Profile & Preferences</span>
              </Link>

              {currentUser.role === 'owner' && (
                <div className="pt-3 mt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2 block mb-1">
                    Management
                  </span>
                  <Link
                    href="/owner/dashboard"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-[#181F2F]"
                  >
                    <Shield className="w-4 h-4 text-red-400" />
                    <span>Owner Cockpit</span>
                  </Link>
                </div>
              )}

              <div className="pt-3 mt-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2 block mb-1">
                  Public Website & Logout
                </span>
                <Link
                  href="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-[#181F2F]"
                >
                  <Globe className="w-4 h-4 text-[#E5A93C]" />
                  <span>Public Gym Website</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                    window.location.href = '/';
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/30 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of App</span>
                </button>
              </div>

              <div className="pt-3 mt-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2 block mb-1">
                  Legal & Privacy
                </span>
                <Link
                  href="/privacy-policy"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-[#181F2F]"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Privacy Policy</span>
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-[#181F2F]"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Terms of Service</span>
                </Link>
                <Link
                  href="/data-deletion"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-300 hover:bg-[#181F2F]"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Data Deletion Request</span>
                </Link>
              </div>
            </div>

            {/* Direct Contact Bar */}
            <div className="pt-3 space-y-2 text-xs">
              <a
                href="tel:9902667407"
                className="flex items-center gap-2 p-2 rounded-xl bg-[#171D2B] text-slate-200 font-bold"
              >
                <Phone className="w-4 h-4 text-[#E5A93C]" />
                <span>Call: 9902667407</span>
              </a>
              <a
                href="mailto:karnatakagymhubli@gmail.com"
                className="flex items-center gap-2 p-2 rounded-xl bg-[#171D2B] text-slate-200 font-bold"
              >
                <Mail className="w-4 h-4 text-[#E5A93C]" />
                <span className="truncate">karnatakagymhubli@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
