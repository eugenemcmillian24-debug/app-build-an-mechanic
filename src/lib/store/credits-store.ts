import { create } from 'zustand';
import type { CreditActionType } from '@/types';

interface CreditsState {
  balance: number;
  loading: boolean;
  setBalance: (balance: number) => void;
  setLoading: (loading: boolean) => void;
  fetchBalance: () => Promise<void>;
  checkCredits: (actionType: CreditActionType) => Promise<{ sufficient: boolean; cost: number }>;
  deductCredits: (actionType: CreditActionType, referenceId?: string) => Promise<boolean>;
}

export const useCreditsStore = create<CreditsState>((set, get) => ({
  balance: 0,
  loading: false,

  setBalance: (balance) => set({ balance }),
  setLoading: (loading) => set({ loading }),

  fetchBalance: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/credits/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'ai_message' }),
      });
      const data = await res.json();
      set({ balance: data.balance || 0 });
    } catch {
      console.error('Failed to fetch credit balance');
    } finally {
      set({ loading: false });
    }
  },

  checkCredits: async (actionType) => {
    const res = await fetch('/api/credits/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionType }),
    });
    const data = await res.json();
    set({ balance: data.balance || 0 });
    return { sufficient: data.sufficient, cost: data.cost };
  },

  deductCredits: async (actionType, referenceId) => {
    const res = await fetch('/api/credits/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionType, referenceId }),
    });

    if (res.status === 402) {
      return false;
    }

    const data = await res.json();
    if (data.success) {
      set({ balance: data.remaining_balance });
    }
    return data.success;
  },
}));
