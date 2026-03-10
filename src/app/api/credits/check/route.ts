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

    const { actionType } = (await req.json()) as { actionType: CreditActionType };

    const { data: wallet } = await supabase
      .from('credit_wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    const balance = wallet?.balance || 0;
    const cost = CREDIT_COSTS[actionType] ?? 1;

    return NextResponse.json({
      balance,
      cost,
      sufficient: balance >= cost,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
