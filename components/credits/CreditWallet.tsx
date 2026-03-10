'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Wallet } from 'lucide-react';

export default function CreditWallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const res = await fetch('/api/credits/check', {
        method: 'POST',
        body: JSON.stringify({ actionType: 'ai_message' }), // Use a cheap one just to get balance
      });
      const data = await res.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full shadow-lg">
      <Wallet className="w-4 h-4 text-emerald-400" />
      <div className="flex flex-col">
        <span className="text-xs text-zinc-400 font-medium leading-none">Credits</span>
        <span className="text-sm font-bold text-white tabular-nums">
          {loading ? '...' : balance?.toLocaleString()}
        </span>
      </div>
      <button className="ml-2 p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-full transition-colors">
        <CreditCard className="w-4 h-4" />
      </button>
    </div>
  );
}
