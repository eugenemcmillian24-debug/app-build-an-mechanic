import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: '1.0.0',
    name: 'OPS AI DEV',
    timestamp: new Date().toISOString(),
    features: [
      'multi-agent-architecture',
      'credit-based-billing',
      'auto-deployment',
      'github-integration',
      'neon-database-provisioning',
      'groq-ai-models',
      'openrouter-ai-models',
    ],
  });
}
