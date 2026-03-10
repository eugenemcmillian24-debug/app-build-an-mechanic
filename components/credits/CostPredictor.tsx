'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function CostPredictor({ actionType, onConfirm }: { actionType: string, onConfirm: () => void }) {
  const [data, setData] = useState<{ cost: number, balance: number, sufficient: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/credits/check', {
          method: 'POST',
          body: JSON.stringify({ actionType }),
        });
        const d = await res.json();
        setData(d);
      } catch (error) {
        console.error('Failed to predict cost:', error);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [actionType]);

  if (loading) return <div className="p-4 animate-pulse bg-zinc-900 rounded-xl border border-zinc-800">Predicting cost...</div>;
  if (!data) return null;

  return (
    <div className={cn(
      "p-4 rounded-xl border-2 transition-all flex flex-col gap-3",
      data.sufficient ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {data.sufficient ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="font-semibold text-zinc-100">Estimated Cost</span>
        </div>
        <span className="text-xl font-bold text-white">{data.cost} CR</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-zinc-400">Current Balance:</span>
        <span className="text-zinc-300 font-medium">{data.balance} CR</span>
      </div>

      {!data.sufficient && (
        <div className="text-sm text-red-400 font-medium bg-red-400/10 p-2 rounded-lg">
          Insufficient credits. Please top up to continue.
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={!data.sufficient}
        className={cn(
          "w-full py-3 px-6 rounded-xl font-bold transition-all shadow-lg",
          data.sufficient
            ? "bg-emerald-500 hover:bg-emerald-600 text-zinc-950 active:scale-95"
            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
        )}
      >
        {data.sufficient ? 'Confirm Action' : 'Insufficient Credits'}
      </button>

      <p className="text-[10px] text-center text-zinc-500 uppercase tracking-widest font-bold">
        Secure Transaction • Non-Refundable Once Started
      </p>
    </div>
  );
}
