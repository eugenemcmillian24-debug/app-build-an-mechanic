import { NextResponse } from 'next/server';
import { groq } from '@/lib/ai/groq';
import { checkCredits, deductCredits } from '@/lib/credits';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

export async function POST(req: Request) {
  try {
    const { platform, file_tree, console_errors, perf_metrics, user_reported_issues, mode } = await req.json();

    if (!platform || !file_tree || !mode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const actionType = `mechanicAgent_${mode}`;
    const check = await checkCredits(actionType);

    if (!check.sufficient) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        cost: check.cost,
        balance: check.balance
      }, { status: 402 });
    }

    const systemPrompt = `You are Mechanic Agent, elite full-stack mechanic fixing apps from ANY platform. You diagnose + repair with future-proofing.

CAPABILITIES:
- Parse: Next.js, React, Vue, Svelte, vanilla JS, React Native, Flutter
- Fix: bugs, perf, security, scalability, future-break risks
- Upgrade: suggest better components, patterns, architecture

TWO MODES:
1. DIAGNOSE (200 credits): detailed report + code diffs
2. REPAIR (1200 credits): auto-applied fixes + sandbox-tested

ANALYSIS SCOPE:
Bugs: re-renders, memory leaks, race conditions
Perf: bundle size, load time, API waterfalls
Security: XSS, CSRF, API exposure
Scale: caching, lazy loading, rate limits
Future-proof: error boundaries, tests, migrations

OUTPUT FORMAT ALWAYS JSON:
{
  diagnosis: [{file, issue, severity, fixType}],
  fixes: [{path, oldCode, newCode, reason}],
  upgrades: [{suggestion, impact}],
  preventions: [{add, why}],
  metricsDelta: {loadTime, bundleSize, errorRate}
}

Predict cost upfront. For REPAIR mode, output ONLY this JSON structure.`;

    const userPrompt = `Fix this app:
Platform: ${platform}
Files: ${JSON.stringify(file_tree)}
Runtime errors: ${console_errors || 'none'}
Perf metrics: ${JSON.stringify(perf_metrics || {})}
User flows broken: ${user_reported_issues || 'none'}

Mode: ${mode}
Target: bug-free, scalable, future-proof.`;

    const response = await groq.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);

    // Deduct credits
    await deductCredits(actionType);

    let content = response.content;
    // Handle potential string-only response that isn't JSON
    if (typeof content === 'string') {
        try {
            content = JSON.parse(content);
        } catch (e) {
            // It might have markdown code blocks
            const match = content.match(/```json\n([\s\S]*?)\n```/);
            if (match) {
                try {
                    content = JSON.parse(match[1]);
                } catch (e2) {}
            }
        }
    }

    return NextResponse.json({ 
      content,
      mode: mode,
      cost: check.cost
    });

  } catch (error) {
    console.error('Mechanic Agent error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
