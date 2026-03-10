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

    const { task, operation, projectContext, targetMetrics, domain } = await req.json();

    // Determine credit cost based on operation
    let actionType: keyof typeof CREDIT_COSTS = 'ai_lab_create';
    if (operation === 'experiment') actionType = 'ai_lab_experiment';
    if (operation === 'deploy') actionType = 'ai_lab_deploy';

    const cost = CREDIT_COSTS[actionType];

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

    // Execute agent
    const result = await routeToAgent('ai_lab', task, {
      userId: user.id,
      projectId: projectContext,
      mode: operation,
    });

    return NextResponse.json({
      success: true,
      result: result.structured || { raw: result.content },
      content: result.content,
      credits_used: cost,
      remaining_balance: (wallet?.balance || 0) - cost,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
