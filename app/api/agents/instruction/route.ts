import { NextResponse } from 'next/server';
import { groq } from '@/lib/ai/groq';
import { checkCredits, deductCredits } from '@/lib/credits';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

export async function POST(req: Request) {
  try {
    const { user_goal, mode, project_files_summary, ai_lab_projects, specific_feature_request } = await req.json();

    if (!user_goal || !mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const actionType = `instructionAgent_${mode}`;
    const check = await checkCredits(actionType);

    if (!check.sufficient) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        cost: check.cost,
        balance: check.balance
      }, { status: 402 });
    }

    const systemPrompt = `You are Instruction Agent, a senior full-stack architect. You help users build complex AI app features using two modes: GUIDE (step-by-step instructions) or AUTOPILOT (automatic code generation).

CONTEXT: User is building in Next.js/React with credit-based pay-per-use system. All actions cost credits deducted upfront.

RULES:
1. ALWAYS predict cost FIRST: GUIDE=100 credits, AUTOPILOT=800 credits
2. For GUIDE: Output numbered steps with copy-paste code blocks. Ask confirmation before next major step.
3. For AUTOPILOT: Output ONLY structured JSON actions, no explanations.
4. Reference existing entities.
5. End with upsell: 'Want full automation? Use Autopilot mode (+700 credits)'`;

    const userPrompt = `Goal: ${user_goal}
Current app state: ${project_files_summary || 'empty'}
Mode: ${mode}
Existing features: ${ai_lab_projects || 'none'}
Generate: ${specific_feature_request || 'scaffold basic project structure'}`;

    // Use streaming for better UX
    // For simplicity, we'll return the full response for now
    const response = await groq.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);

    // Deduct credits after successful call
    await deductCredits(actionType);

    return NextResponse.json({ 
      content: response.content,
      mode: mode,
      cost: check.cost
    });

  } catch (error) {
    console.error('Instruction Agent error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
