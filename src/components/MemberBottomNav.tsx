'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, QrCode, Calendar, RefreshCcw, ShoppingBag, User } from 'lucide-react';

export const MemberBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/member/home', icon: Home },
    { label: 'Check-in', href: '/member/check-in', icon: QrCode },
    { label: 'History', href: '/member/history', icon: Calendar },
    { label: 'Renew', href: '/member/renew', icon: RefreshCcw },
    { label: 'Add-Ons', href: '/member/add-ons', icon: ShoppingBag },
    { label: 'Profile', href: '/member/profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D111A]/95 backdrop-blur-lg border-t border-[#1F2739] px-2 py-1.5 md:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === '/member/home' && pathname === '/member') ||
            (item.href !== '/member/home' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          if (isActive) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5 group"
              >
                <div className="w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-2 border-white bg-[#E5A93C] text-slate-950 shadow-[#E5A93C]/40">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-[#E5A93C]">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-1 px-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            >
              <div className="w-7 h-7 flex items-center justify-center">
                <Icon className="w-5 h-5 stroke-2" />
              </div>
              <span className="text-[10px] mt-0.5 font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
