'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGym } from '@/lib/store';

export default function OwnerRootPage() {
  const router = useRouter();
  const { currentUser, isLoggedIn, isHydrated } = useGym();

  useEffect(() => {
    if (!isHydrated) return;
    const isOwnerOrStaff =
      currentUser.role === 'owner' ||
      currentUser.role === 'front_desk' ||
      currentUser.role === 'trainer';

    if (isLoggedIn && isOwnerOrStaff) {
      router.replace('/owner/dashboard');
    } else {
      router.replace('/owner/login');
    }
  }, [isHydrated, isLoggedIn, currentUser, router]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center text-xs">
      Loading Owner Cockpit...
    </div>
  );
}

