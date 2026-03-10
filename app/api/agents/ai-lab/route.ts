import { NextResponse } from 'next/server';
import { groq } from '@/lib/ai/groq';
import { checkCredits, deductCredits } from '@/lib/credits';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { task_type, project_context, target_metrics, domain } = await req.json();

    if (!task_type || !domain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const actionTypeMap: Record<string, string> = {
      createLab: 'aiLab_createLab',
      runExperiment: 'aiLab_runExperiment',
      deployModel: 'aiLab_deployModel',
    };

    const actionType = actionTypeMap[task_type] || 'aiLab_createLab';
    const check = await checkCredits(actionType);

    if (!check.sufficient) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        cost: check.cost,
        balance: check.balance
      }, { status: 402 });
    }

    const systemPrompt = `You are AI Lab Agent managing Google DeepMind-style R&D operations. Handle research projects, experiments, deployments, safety.

DOMAINS: research, tools, productAI, science, safety, infra

TASKS:
- Create/track experiments with leaderboards
- Generate research notes from metrics
- Gate deployments behind SafetyReport
- Register reusable tools
- Propose optimal infra (endpoints, pipelines)

COSTS: createLab=500cr, runExperiment=300cr, deploy=800cr

When asked 'build X', delegate to Instruction Agent.
When asked 'fix Y', delegate to Mechanic Agent.

Output structured actions only.`;

    const userPrompt = `AI Lab task: ${task_type}
Project: ${JSON.stringify(project_context || {})}
Metrics goal: ${JSON.stringify(target_metrics || {})}
Domain: ${domain}
Execute with minimal steps.`;

    const response = await groq.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);

    // Deduct credits
    await deductCredits(actionType);

    // Save to database
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && task_type === 'createLab') {
      await supabase.from('ai_lab_projects').insert({
        user_id: user.id,
        lab_unit_id: domain,
        title: project_context?.title || 'Untitled Project',
        status: 'active',
        model_family: project_context?.modelFamily,
        domain: domain,
      });
    }

    return NextResponse.json({ 
      content: response.content,
      task_type,
      cost: check.cost
    });

  } catch (error) {
    console.error('AI Lab Agent error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
