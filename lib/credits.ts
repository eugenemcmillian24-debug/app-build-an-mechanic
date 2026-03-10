import { createServerSupabaseClient } from './supabase';

export const COST_TABLE: Record<string, number> = {
  ai_message: 1,
  ai_build: 20,
  deploy_vercel: 40,
  deploy_netlify: 40,
  instructionAgent_guide: 100,
  instructionAgent_autopilot: 800,
  mechanicAgent_diagnose: 200,
  mechanicAgent_repair: 1200,
  aiLab_createLab: 500,
  aiLab_runExperiment: 300,
  aiLab_deployModel: 800,
};

export async function checkCredits(actionType: string) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { sufficient: false, error: 'Unauthorized' };
  }

  const { data: wallet, error: walletError } = await supabase
    .from('credit_wallets')
    .select('balance')
    .eq('user_id', user.id)
    .single();

  if (walletError || !wallet) {
    return { sufficient: false, error: 'Wallet not found' };
  }

  const cost = COST_TABLE[actionType] || 1;
  return {
    sufficient: wallet.balance >= cost,
    balance: wallet.balance,
    cost,
  };
}

export async function deductCredits(actionType: string, referenceId?: string) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  const cost = COST_TABLE[actionType] || 1;

  // We use a RPC or a transaction for atomic deduction
  // For simplicity, we'll do it manually here, but in production, use a database function
  const { data: wallet, error: walletError } = await supabase
    .from('credit_wallets')
    .select('balance')
    .eq('user_id', user.id)
    .single();

  if (walletError || !wallet) {
    return { success: false, error: 'Wallet not found' };
  }

  if (wallet.balance < cost) {
    return { success: false, error: 'Insufficient credits' };
  }

  const { error: transactionError } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: user.id,
      amount: -cost,
      reason: actionType,
      reference_id: referenceId,
    });

  if (transactionError) {
    return { success: false, error: 'Transaction failed' };
  }

  const { error: updateError } = await supabase
    .from('credit_wallets')
    .update({ balance: wallet.balance - cost })
    .eq('user_id', user.id);

  if (updateError) {
    return { success: false, error: 'Update failed' };
  }

  return { success: true };
}
