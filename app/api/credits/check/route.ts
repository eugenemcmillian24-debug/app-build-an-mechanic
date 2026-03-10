import { NextResponse } from 'next/server';
import { checkCredits } from '@/lib/credits';

export async function POST(req: Request) {
  try {
    const { actionType } = await req.json();
    if (!actionType) {
      return NextResponse.json({ error: 'Action type is required' }, { status: 400 });
    }

    const result = await checkCredits(actionType);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Credit check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
