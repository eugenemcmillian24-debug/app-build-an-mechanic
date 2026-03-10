'use client';

import { useEffect } from 'react';
import { Zap, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCreditsStore } from '@/lib/store/credits-store';

export default function CreditWallet() {
  const { balance, loading, fetchBalance } = useCreditsStore();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const getBalanceColor = () => {
    if (balance >= 500) return 'text-emerald-400';
    if (balance >= 100) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-violet-600/20 rounded-lg">
            <Zap className="h-5 w-5 text-violet-400" />
          </div>
          <h3 className="font-semibold text-white">Credit Balance</h3>
        </div>
        <TrendingUp className="h-4 w-4 text-zinc-500" />
      </div>

      <div className="mb-4">
        {loading ? (
          <div className="h-10 bg-zinc-800 rounded animate-pulse" />
        ) : (
          <p className={`text-4xl font-bold ${getBalanceColor()}`}>
            {balance.toLocaleString()}
          </p>
        )}
        <p className="text-sm text-zinc-500 mt-1">
          ≈ ${(balance * 0.05).toFixed(2)} USD
        </p>
      </div>

      {balance === 0 && (
        <div className="bg-red-950/50 border border-red-900 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-400">
            No credits remaining. Purchase credits to continue using OPS AI DEV.
          </p>
        </div>
      )}

      <Link
        href="/billing"
        className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-colors"
      >
        Buy Credits
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
