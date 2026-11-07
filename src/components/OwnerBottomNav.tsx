'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, AlertCircle, Users, UserCheck, FileText } from 'lucide-react';
import { useGym } from '@/lib/store';

export const OwnerBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { noShowCases } = useGym();

  const openCasesCount = noShowCases.filter((c) => c.status === 'open').length;

  const navItems = [
    { label: 'Cockpit', href: '/owner/dashboard', icon: LayoutDashboard },
    {
      label: 'Churn Risk',
      href: '/owner/churn-risk',
      icon: AlertCircle,
      badge: openCasesCount > 0 ? openCasesCount : undefined,
      badgeColor: 'bg-red-500'
    },
    { label: 'Members', href: '/owner/manage/members', icon: Users },
    { label: 'Assisted', href: '/owner/assisted-checkin', icon: UserCheck, highlight: true },
    { label: 'Summary', href: '/owner/summary', icon: FileText }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D111A]/95 backdrop-blur-lg border-t border-[#1F2739] px-2 py-1.5 md:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5 group"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-2 ${
                    isActive
                      ? 'bg-[#E5A93C] text-slate-950 border-white shadow-[#E5A93C]/40'
                      : 'bg-gradient-to-tr from-[#E5A93C] to-[#F59E0B] text-slate-950 border-[#121622] shadow-[#E5A93C]/20'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 ${
                    isActive ? 'text-[#E5A93C]' : 'text-slate-300'
                  }`}
                >
                  Assisted
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                isActive ? 'text-[#E5A93C]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && (
                  <span
                    className={`absolute -top-1 -right-2 text-[9px] font-bold text-white px-1 rounded-full ${item.badgeColor} animate-pulse`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

