'use client';

import { useState } from 'react';
import { CreditCard, Zap, Check, Loader2 } from 'lucide-react';
import CreditWallet from '@/components/credits/credit-wallet';
import { CREDIT_PACKS, CREDIT_COSTS } from '@/types';

export default function BillingPage() {
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const handlePurchase = async (packId: string) => {
    setPurchasing(packId);
    try {
      const res = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Failed to create checkout session');
    } finally {
      setPurchasing(null);
    }
  };

  const costEntries = Object.entries(CREDIT_COSTS) as Array<[string, number]>;

  const actionLabels: Record<string, string> = {
    ai_message: 'AI Message',
    ai_build: 'AI Build',
    deploy_vercel: 'Deploy to Vercel',
    deploy_netlify: 'Deploy to Netlify',
    ai_lab_create: 'AI Lab - Create Lab',
    ai_lab_experiment: 'AI Lab - Run Experiment',
    ai_lab_deploy: 'AI Lab - Deploy Model',
    instruction_guide: 'Build - Guide Mode',
    instruction_autopilot: 'Build - Autopilot Mode',
    mechanic_diagnose: 'Fix - Diagnose',
    mechanic_repair: 'Fix - Repair',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-600/20 rounded-lg">
            <CreditCard className="h-6 w-6 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Billing</h1>
        </div>
        <p className="text-zinc-400">Purchase credits and manage your balance. $0.05 per credit.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CreditWallet />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-4">Credit Packs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CREDIT_PACKS.map((pack) => (
              <div key={pack.id} className={`relative bg-zinc-900 border rounded-xl p-5 ${pack.popular ? 'border-violet-500 ring-1 ring-violet-500/20' : 'border-zinc-800'}`}>
                {pack.popular && (
                  <div className="absolute -top-2.5 right-4">
                    <span className="bg-violet-600 text-white text-[10px] font-bold rounded-full px-2.5 py-0.5 uppercase">Popular</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{pack.name}</h3>
                  <span className="text-2xl font-bold text-white">${pack.price_usd}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-4">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-amber-400 font-semibold">{pack.credits} credits</span>
                </div>
                <button onClick={() => handlePurchase(pack.id)} disabled={purchasing !== null} className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  {purchasing === pack.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Purchase
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Credit Costs</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 gap-px bg-zinc-800">
            <div className="bg-zinc-900 px-4 py-3">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Action</span>
            </div>
            <div className="bg-zinc-900 px-4 py-3 text-right">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Cost</span>
            </div>
          </div>
          {costEntries.map(([action, cost]) => (
            <div key={action} className="grid grid-cols-2 gap-px bg-zinc-800">
              <div className="bg-zinc-900 px-4 py-3">
                <span className="text-sm text-zinc-300">{actionLabels[action] || action}</span>
              </div>
              <div className="bg-zinc-900 px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">{cost}</span>
                  <span className="text-xs text-zinc-600">cr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
