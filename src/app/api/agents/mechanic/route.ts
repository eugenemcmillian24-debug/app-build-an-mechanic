import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { routeToAgent } from '@/lib/ai/agents';
import { CREDIT_COSTS } from '@/types';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { files, platform, mode, consoleErrors, userIssues, model } = await req.json();

    // Determine credit cost
    const actionType = mode === 'repair' ? 'mechanic_repair' : 'mechanic_diagnose';
    const cost = CREDIT_COSTS[actionType as keyof typeof CREDIT_COSTS];

    // Check credits
    const { data: wallet } = await supabase
      .from('credit_wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if ((wallet?.balance || 0) < cost) {
      return NextResponse.json(
        { error: 'Insufficient credits', cost, balance: wallet?.balance || 0 },
        { status: 402 }
      );
    }

    // Deduct credits
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      amount: -cost,
      reason: actionType,
    });
    await supabase
      .from('credit_wallets')
      .update({ balance: (wallet?.balance || 0) - cost })
      .eq('user_id', user.id);

    // Build input
    const input = `Platform: ${platform || 'auto-detect'}
Console errors: ${consoleErrors?.join(', ') || 'none reported'}
User issues: ${userIssues?.join(', ') || 'none reported'}
Mode: ${mode}
Analyze and ${mode === 'repair' ? 'fix' : 'diagnose'} the provided code.`;

    // Execute agent
    const result = await routeToAgent('mechanic', input, {
      userId: user.id,
      files,
      mode,
    });

    return NextResponse.json({
      success: true,
      mode,
      result: result.structured || { raw: result.content },
      content: result.content,
      credits_used: cost,
      remaining_balance: (wallet?.balance || 0) - cost,
      upsell:
        mode === 'diagnose'
          ? 'Auto-fix all issues? Use Repair mode (1200 credits)'
          : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
