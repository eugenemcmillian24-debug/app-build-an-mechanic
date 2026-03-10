import { NextResponse } from 'next/server';
import { deductCredits } from '@/lib/credits';

export async function POST(req: Request) {
  try {
    const { actionType, referenceId } = await req.json();
    if (!actionType) {
      return NextResponse.json({ error: 'Action type is required' }, { status: 400 });
    }

    const result = await deductCredits(actionType, referenceId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 402 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Credit usage error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
