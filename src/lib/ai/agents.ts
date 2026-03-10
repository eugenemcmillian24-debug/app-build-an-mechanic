import { groqChat, selectGroqModel } from './groq';
import { openRouterChat, selectOpenRouterModel } from './openrouter';
import type { AgentType, InstructionMode, MechanicMode } from '@/types';

// ============================================================
// Multi-Agent Orchestration (LangGraph-style state machine)
// ============================================================

interface AgentNode {
  name: string;
  systemPrompt: string;
  execute: (input: string, context: AgentContext) => Promise<AgentResult>;
}

interface AgentContext {
  userId: string;
  projectId?: string;
  existingFeatures?: string[];
  files?: Array<{ path: string; content: string }>;
  mode?: string;
}

interface AgentResult {
  content: string;
  structured?: Record<string, unknown>;
  nextAgent?: AgentType;
  creditsUsed: number;
}

// ---- System Prompts ----
const AI_LAB_SYSTEM_PROMPT = `You are AI Lab Agent managing Google DeepMind-style R&D operations. Handle research projects, experiments, deployments, safety.

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

Output structured JSON actions only. Always include a "type" field for each action.`;

const INSTRUCTION_SYSTEM_PROMPT = `You are Instruction Agent, a senior full-stack architect. You help users build complex AI app features using two modes: GUIDE (step-by-step instructions) or AUTOPILOT (automatic code generation).

RULES:
1. ALWAYS predict cost FIRST: GUIDE=100 credits, AUTOPILOT=800 credits
2. For GUIDE: Output numbered steps with copy-paste code blocks. Ask confirmation before next major step.
3. For AUTOPILOT: Output ONLY structured JSON actions, no explanations.
4. End with upsell: 'Want full automation? Use Autopilot mode (+700 credits)'

Respond with valid JSON matching the expected output schema.`;

const MECHANIC_SYSTEM_PROMPT = `You are Mechanic Agent, elite full-stack mechanic fixing apps from ANY platform. You diagnose + repair with future-proofing.

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

OUTPUT FORMAT ALWAYS as valid JSON:
{
  "diagnosis": [{"file": "", "issue": "", "severity": "", "fixType": ""}],
  "fixes": [{"path": "", "oldCode": "", "newCode": "", "reason": ""}],
  "upgrades": [{"suggestion": "", "impact": ""}],
  "preventions": [{"add": "", "why": ""}],
  "metricsDelta": {"loadTime": "", "bundleSize": "", "errorRate": ""}
}

Predict cost upfront. For REPAIR mode, output ONLY this JSON structure.`;

// ---- Agent Nodes ----
const aiLabNode: AgentNode = {
  name: 'ai_lab',
  systemPrompt: AI_LAB_SYSTEM_PROMPT,
  async execute(input: string, context: AgentContext): Promise<AgentResult> {
    // Determine if we should delegate
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('build') || lowerInput.includes('create feature')) {
      return {
        content: 'Delegating to Instruction Agent for build task.',
        nextAgent: 'instruction',
        creditsUsed: 0,
      };
    }
    if (lowerInput.includes('fix') || lowerInput.includes('repair') || lowerInput.includes('debug')) {
      return {
        content: 'Delegating to Mechanic Agent for fix task.',
        nextAgent: 'mechanic',
        creditsUsed: 0,
      };
    }

    const result = await groqChat(input, {
      model: selectGroqModel('complex'),
      systemPrompt: AI_LAB_SYSTEM_PROMPT,
      temperature: 0.3,
    });

    let structured: Record<string, unknown> = {};
    try {
      structured = JSON.parse(result.content);
    } catch {
      structured = { raw: result.content };
    }

    return {
      content: result.content,
      structured,
      creditsUsed: 0, // Credits handled at API level
    };
  },
};

const instructionNode: AgentNode = {
  name: 'instruction',
  systemPrompt: INSTRUCTION_SYSTEM_PROMPT,
  async execute(input: string, context: AgentContext): Promise<AgentResult> {
    const mode = (context.mode || 'guide') as InstructionMode;
    const prompt = `Goal: ${input}
Mode: ${mode}
${context.existingFeatures ? `Existing features: ${context.existingFeatures.join(', ')}` : ''}
Generate: structured ${mode === 'guide' ? 'step-by-step instructions with code blocks' : 'JSON actions for auto-codegen'}`;

    // Use Groq for complex, OpenRouter for code gen
    const result = mode === 'autopilot'
      ? await openRouterChat(prompt, {
          model: selectOpenRouterModel('code'),
          systemPrompt: INSTRUCTION_SYSTEM_PROMPT,
          temperature: 0.2,
        })
      : await groqChat(prompt, {
          model: selectGroqModel('complex'),
          systemPrompt: INSTRUCTION_SYSTEM_PROMPT,
          temperature: 0.5,
        });

    let structured: Record<string, unknown> = {};
    try {
      structured = JSON.parse(result.content);
    } catch {
      structured = { raw: result.content };
    }

    return {
      content: result.content,
      structured,
      creditsUsed: 0,
    };
  },
};

const mechanicNode: AgentNode = {
  name: 'mechanic',
  systemPrompt: MECHANIC_SYSTEM_PROMPT,
  async execute(input: string, context: AgentContext): Promise<AgentResult> {
    const mode = (context.mode || 'diagnose') as MechanicMode;
    const filesContext = context.files
      ? context.files.map((f) => `--- ${f.path} ---\n${f.content}`).join('\n\n')
      : '';

    const prompt = `Fix this app:
Files:
${filesContext}

User request: ${input}
Mode: ${mode}
Target: bug-free, scalable, future-proof.

Respond with valid JSON only.`;

    // Use OpenRouter for code analysis, Groq for reasoning
    const result = mode === 'repair'
      ? await openRouterChat(prompt, {
          model: selectOpenRouterModel('code'),
          systemPrompt: MECHANIC_SYSTEM_PROMPT,
          temperature: 0.2,
          maxTokens: 8192,
        })
      : await groqChat(prompt, {
          model: selectGroqModel('reasoning'),
          systemPrompt: MECHANIC_SYSTEM_PROMPT,
          temperature: 0.3,
        });

    let structured: Record<string, unknown> = {};
    try {
      structured = JSON.parse(result.content);
    } catch {
      structured = { raw: result.content };
    }

    return {
      content: result.content,
      structured,
      creditsUsed: 0,
    };
  },
};

// ---- Agent Router ----
const agents: Record<AgentType, AgentNode> = {
  ai_lab: aiLabNode,
  instruction: instructionNode,
  mechanic: mechanicNode,
};

export async function routeToAgent(
  agentType: AgentType,
  input: string,
  context: AgentContext
): Promise<AgentResult> {
  const agent = agents[agentType];
  if (!agent) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }

  const result = await agent.execute(input, context);

  // Handle delegation
  if (result.nextAgent) {
    return routeToAgent(result.nextAgent, input, context);
  }

  return result;
}

export { AI_LAB_SYSTEM_PROMPT, INSTRUCTION_SYSTEM_PROMPT, MECHANIC_SYSTEM_PROMPT };
