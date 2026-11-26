import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Admin Operations Center | Karnataka Gym Hubballi',
  description: 'Restricted Content Management & Operations Console for Karnataka Gym.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-[#E5A93C] selection:text-slate-950">
      {children}
    </div>
  );
}
