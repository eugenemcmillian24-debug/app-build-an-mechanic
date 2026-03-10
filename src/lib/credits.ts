import { CREDIT_COSTS, type CreditActionType, type CreditCheckResponse } from '@/types';

export async function checkCredits(actionType: CreditActionType): Promise<CreditCheckResponse> {
  const res = await fetch('/api/credits/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionType }),
  });
  return res.json();
}

export async function deductCredits(
  actionType: CreditActionType,
  referenceId?: string
): Promise<{ success: boolean; remaining_balance: number; error?: string }> {
  const res = await fetch('/api/credits/usage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionType, referenceId }),
  });

  if (res.status === 402) {
    return { success: false, remaining_balance: 0, error: 'Insufficient credits' };
  }

  return res.json();
}

export function getCreditCost(actionType: CreditActionType): number {
  return CREDIT_COSTS[actionType] ?? 1;
}

export function formatCredits(credits: number): string {
  return credits.toLocaleString();
}

export function creditsToDollars(credits: number): string {
  return `$${(credits * 0.05).toFixed(2)}`;
}
