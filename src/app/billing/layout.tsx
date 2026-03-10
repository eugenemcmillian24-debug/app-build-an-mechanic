'use client';

import { useEffect } from 'react';
import Navbar from '@/components/layout/navbar';
import { useCreditsStore } from '@/lib/store/credits-store';

export default function BillingLayout({ children }: { children: React.ReactNode }) {
  const { fetchBalance } = useCreditsStore();
  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
