import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deployToNetlify } from '@/lib/deploy/netlify';
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

    const { siteName, files, envVars } = await req.json();
    const cost = CREDIT_COSTS.deploy_netlify;

    // Check credits
    const { data: wallet } = await supabase
      .from('credit_wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if ((wallet?.balance || 0) < cost) {
      return NextResponse.json(
        { error: 'Insufficient credits', cost },
        { status: 402 }
      );
    }

    // Deduct credits
    await supabase.from('credit_transactions').insert({
      user_id: user.id,
      amount: -cost,
      reason: 'deploy_netlify',
    });
    await supabase
      .from('credit_wallets')
      .update({ balance: (wallet?.balance || 0) - cost })
      .eq('user_id', user.id);

    // Convert files array to record
    const filesRecord: Record<string, string> = {};
    for (const f of files) {
      filesRecord[f.path] = f.content;
    }

    const result = await deployToNetlify({
      siteName,
      files: filesRecord,
      envVars,
    });

    if (!result.success) {
      // Refund on failure
      await supabase.from('credit_transactions').insert({
        user_id: user.id,
        amount: cost,
        reason: 'refund_deploy_netlify_failed',
      });
      await supabase
        .from('credit_wallets')
        .update({ balance: wallet?.balance || 0 })
        .eq('user_id', user.id);
    }

    return NextResponse.json({
      ...result,
      credits_used: result.success ? cost : 0,
      remaining_balance: result.success
        ? (wallet?.balance || 0) - cost
        : wallet?.balance || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Deployment failed' },
      { status: 500 }
    );
  }
}
