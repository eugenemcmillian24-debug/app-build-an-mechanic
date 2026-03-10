import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CREDIT_COSTS, type CreditActionType } from '@/types';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { actionType, referenceId } = (await req.json()) as {
      actionType: CreditActionType;
      referenceId?: string;
    };

    const cost = CREDIT_COSTS[actionType] ?? 1;

    // Get current balance
    const { data: wallet } = await supabase
      .from('credit_wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    const balance = wallet?.balance || 0;

    if (balance < cost) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          balance,
          cost,
          needed: cost - balance,
        },
        { status: 402 }
      );
    }

    // Atomic deduction - create transaction
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      amount: -cost,
      reason: actionType,
      reference_id: referenceId || null,
    });

    // Update wallet balance
    const newBalance = balance - cost;
    await supabase
      .from('credit_wallets')
      .update({ balance: newBalance })
      .eq('user_id', user.id);

    return NextResponse.json({
      success: true,
      remaining_balance: newBalance,
      cost,
      action: actionType,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
