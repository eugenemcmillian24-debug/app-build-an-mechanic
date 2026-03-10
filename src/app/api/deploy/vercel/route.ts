import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deployToVercel } from '@/lib/deploy/vercel';
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

    const { projectName, files, framework, envVars } = await req.json();
    const cost = CREDIT_COSTS.deploy_vercel;

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
      reason: 'deploy_vercel',
    });
    await supabase
      .from('credit_wallets')
      .update({ balance: (wallet?.balance || 0) - cost })
      .eq('user_id', user.id);

    const result = await deployToVercel({
      projectName,
      files: files.map((f: { path: string; content: string }) => ({
        file: f.path,
        data: f.content,
      })),
      framework,
      envVars,
    });

    if (!result.success) {
      // Refund on failure
      await supabase.from('credit_transactions').insert({
        user_id: user.id,
        amount: cost,
        reason: 'refund_deploy_vercel_failed',
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
