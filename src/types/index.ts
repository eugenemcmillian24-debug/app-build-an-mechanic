// ============================================================
// OPS AI DEV - TypeScript Types & Interfaces
// ============================================================

// ---- Credit System ----
export interface CreditWallet {
  id: string;
  user_id: string;
  balance: number;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_id: string | null;
  created_at: string;
}

export interface PricingRule {
  id: string;
  action_type: string;
  base_cost_credits: number;
}

export interface CreditCheckResponse {
  balance: number;
  cost: number;
  sufficient: boolean;
}

export interface CreditUsageResponse {
  success: boolean;
  remaining_balance: number;
}

export type CreditActionType =
  | 'ai_message'
  | 'ai_build'
  | 'deploy_vercel'
  | 'deploy_netlify'
  | 'ai_lab_create'
  | 'ai_lab_experiment'
  | 'ai_lab_deploy'
  | 'instruction_guide'
  | 'instruction_autopilot'
  | 'mechanic_diagnose'
  | 'mechanic_repair';

export const CREDIT_COSTS: Record<CreditActionType, number> = {
  ai_message: 1,
  ai_build: 20,
  deploy_vercel: 40,
  deploy_netlify: 40,
  ai_lab_create: 500,
  ai_lab_experiment: 300,
  ai_lab_deploy: 800,
  instruction_guide: 100,
  instruction_autopilot: 800,
  mechanic_diagnose: 200,
  mechanic_repair: 1200,
};

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price_usd: number;
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'starter', name: 'Starter', credits: 100, price_usd: 5 },
  { id: 'pro', name: 'Pro', credits: 300, price_usd: 15, popular: true },
  { id: 'premium', name: 'Premium', credits: 500, price_usd: 25 },
  { id: 'custom', name: 'Custom', credits: 900, price_usd: 45 },
];

// ---- AI Lab ----
export type LabUnitType = 'research' | 'tools' | 'product' | 'science' | 'safety' | 'infra';

export interface LabUnit {
  id: string;
  name: string;
  type: LabUnitType;
  created_by: string;
  created_at: string;
}

export interface Project {
  id: string;
  lab_unit_id: string;
  title: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  model_family: string;
  domain: string;
  created_by: string;
  created_at: string;
}

export type ArtifactKind = 'model' | 'dataset' | 'pipeline' | 'tool' | 'paper' | 'report';

export interface Artifact {
  id: string;
  project_id: string;
  kind: ArtifactKind;
  uri: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Experiment {
  id: string;
  project_id: string;
  config: Record<string, unknown>;
  metrics: Record<string, number>;
  checkpoint_uri: string | null;
  status: 'running' | 'completed' | 'failed';
  created_at: string;
}

export type DeploymentEnv = 'dev' | 'staging' | 'prod';

export interface Deployment {
  id: string;
  project_id: string;
  env: DeploymentEnv;
  endpoint_url: string;
  version: string;
  safety_report_id: string | null;
  status: 'deploying' | 'active' | 'failed' | 'rolled_back';
  created_at: string;
}

export interface SafetyReport {
  id: string;
  project_id: string;
  eval_results: Record<string, unknown>;
  redteam_notes: string;
  policy_tags: string[];
  passed: boolean;
  created_at: string;
}

// ---- Instruction Agent ----
export type InstructionMode = 'guide' | 'autopilot';

export interface GuideStep {
  step_number: number;
  title: string;
  description: string;
  code_block: string | null;
  language: string | null;
}

export interface GuideOutput {
  steps: GuideStep[];
  next_confirmation: boolean;
  total_steps: number;
}

export interface AutopilotAction {
  type: 'create_tables' | 'write_files' | 'update_routes' | 'run_migrations' | 'register_feature';
  payload: Record<string, unknown>;
}

export interface AutopilotOutput {
  actions: AutopilotAction[];
  summary: string;
  files_created: number;
  routes_updated: number;
}

export interface InstructionRequest {
  goal: string;
  mode: InstructionMode;
  project_context?: string;
  existing_features?: string[];
  model?: string;
}

// ---- Mechanic Agent ----
export type MechanicMode = 'diagnose' | 'repair';
export type Platform = 'nextjs' | 'react' | 'vue' | 'svelte' | 'vanilla' | 'react-native' | 'flutter';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface DiagnosisIssue {
  file: string;
  line: number | null;
  issue: string;
  severity: Severity;
  fix_type: string;
}

export interface DiagnosisOutput {
  issues: DiagnosisIssue[];
  summary: string;
  priority_order: string[];
}

export interface FileChange {
  path: string;
  old_code: string;
  new_code: string;
  reason: string;
}

export interface RepairOutput {
  file_changes: FileChange[];
  component_swaps: Array<{ old_comp: string; new_comp: string; reason: string }>;
  metrics_improvement: {
    before: Record<string, number>;
    after: Record<string, number>;
    delta: Record<string, number>;
  };
}

export interface MechanicRequest {
  files: Array<{ path: string; content: string }>;
  platform: Platform;
  mode: MechanicMode;
  console_errors?: string[];
  user_issues?: string[];
  model?: string;
}

// ---- Deployment ----
export interface DeployRequest {
  project_name: string;
  files: Array<{ path: string; content: string }>;
  framework: string;
  env_vars?: Record<string, string>;
}

export interface DeployResponse {
  success: boolean;
  url: string;
  deployment_id: string;
  status: string;
}

// ---- Neon Database ----
export interface NeonDatabaseRequest {
  project_name: string;
  database_name?: string;
}

export interface NeonDatabaseResponse {
  connection_string: string;
  host: string;
  database: string;
  user: string;
  password: string;
  project_id: string;
}

// ---- GitHub ----
export interface GitHubRepoRequest {
  name: string;
  description?: string;
  is_private?: boolean;
}

export interface GitHubRepoResponse {
  repo_url: string;
  clone_url: string;
  full_name: string;
}

// ---- AI Models ----
export interface AIModel {
  id: string;
  name: string;
  provider: 'groq' | 'openrouter';
  purpose: string;
  free: boolean;
}

export const GROQ_MODELS: AIModel[] = [
  { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B', provider: 'groq', purpose: 'Complex multi-agent workflows', free: false },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', provider: 'groq', purpose: 'Quick tasks, speed chain', free: false },
  { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 70B', provider: 'groq', purpose: 'Deep reasoning tasks', free: false },
  { id: 'distil-whisper-large-v3-en', name: 'Whisper Large V3', provider: 'groq', purpose: 'Audio transcription', free: false },
];

export const OPENROUTER_MODELS: AIModel[] = [
  { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder', provider: 'openrouter', purpose: 'Code generation', free: true },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash', provider: 'openrouter', purpose: 'Fast multimodal', free: true },
  { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1', provider: 'openrouter', purpose: 'Reasoning', free: true },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', provider: 'openrouter', purpose: 'General purpose', free: true },
  { id: 'meta-llama/llama-3.1-405b-instruct:free', name: 'Llama 3.1 405B', provider: 'openrouter', purpose: 'Most capable', free: true },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 405B', provider: 'openrouter', purpose: 'Creative tasks', free: true },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1', provider: 'openrouter', purpose: 'Efficient tasks', free: true },
  { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'Mistral Small 3.2', provider: 'openrouter', purpose: 'Latest Mistral', free: true },
  { id: 'mistralai/devstral-2512:free', name: 'Devstral', provider: 'openrouter', purpose: 'Dev assistance', free: true },
  { id: 'mistralai/devstral-small-2505:free', name: 'Devstral Small', provider: 'openrouter', purpose: 'Quick dev tasks', free: true },
  { id: 'google/gemma-3n-e2b-it:free', name: 'Gemma 3n E2B', provider: 'openrouter', purpose: 'Efficient inference', free: true },
  { id: 'google/gemma-3n-e4b-it:free', name: 'Gemma 3n E4B', provider: 'openrouter', purpose: 'Balanced inference', free: true },
  { id: 'google/gemma-3-4b-it:free', name: 'Gemma 3 4B', provider: 'openrouter', purpose: 'Lightweight tasks', free: true },
  { id: 'google/gemma-3-12b-it:free', name: 'Gemma 3 12B', provider: 'openrouter', purpose: 'Medium tasks', free: true },
  { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B', provider: 'openrouter', purpose: 'Heavy tasks', free: true },
  { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'Nemotron Nano 30B', provider: 'openrouter', purpose: 'NVIDIA optimized', free: true },
  { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron Nano 12B VL', provider: 'openrouter', purpose: 'Vision-language', free: true },
  { id: 'nvidia/nemotron-nano-9b-v2:free', name: 'Nemotron Nano 9B', provider: 'openrouter', purpose: 'Fast NVIDIA', free: true },
  { id: 'qwen/qwen3-4b:free', name: 'Qwen3 4B', provider: 'openrouter', purpose: 'Small tasks', free: true },
  { id: 'qwen/qwen3-30b-a3b:free', name: 'Qwen3 30B', provider: 'openrouter', purpose: 'Mid-range Qwen', free: true },
  { id: 'qwen/qwen-2.5-vl-7b-instruct:free', name: 'Qwen 2.5 VL 7B', provider: 'openrouter', purpose: 'Vision tasks', free: true },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B', provider: 'openrouter', purpose: 'Ultra fast', free: true },
  { id: 'meta-llama/llama-3.3-8b-instruct:free', name: 'Llama 3.3 8B', provider: 'openrouter', purpose: 'Fast inference', free: true },
  { id: 'openai/gpt-oss-120b:free', name: 'GPT OSS 120B', provider: 'openrouter', purpose: 'Large GPT tasks', free: true },
  { id: 'openai/gpt-oss-20b:free', name: 'GPT OSS 20B', provider: 'openrouter', purpose: 'Efficient GPT', free: true },
  { id: 'allenai/molmo-2-8b:free', name: 'Molmo 2 8B', provider: 'openrouter', purpose: 'Multimodal', free: true },
  { id: 'xiaomi/mimo-v2-flash:free', name: 'MiMo V2 Flash', provider: 'openrouter', purpose: 'Speed tasks', free: true },
  { id: 'arcee-ai/trinity-mini:free', name: 'Trinity Mini', provider: 'openrouter', purpose: 'Compact reasoning', free: true },
  { id: 'tngtech/tng-r1t-chimera:free', name: 'TNG R1T Chimera', provider: 'openrouter', purpose: 'Hybrid reasoning', free: true },
  { id: 'tngtech/deepseek-r1t2-chimera:free', name: 'DeepSeek R1T2 Chimera', provider: 'openrouter', purpose: 'Deep reasoning hybrid', free: true },
  { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air', provider: 'openrouter', purpose: 'General AI', free: true },
  { id: 'meituan/longcat-flash-chat:free', name: 'LongCat Flash', provider: 'openrouter', purpose: 'Long context chat', free: true },
  { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2', provider: 'openrouter', purpose: 'Advanced chat', free: true },
  { id: 'moonshotai/kimi-dev-72b:free', name: 'Kimi Dev 72B', provider: 'openrouter', purpose: 'Dev agent', free: true },
  { id: 'tencent/hunyuan-a13b-instruct:free', name: 'Hunyuan A13B', provider: 'openrouter', purpose: 'Instruction following', free: true },
  { id: 'deepseek/deepseek-chat-v3.1:free', name: 'DeepSeek Chat V3.1', provider: 'openrouter', purpose: 'Conversational', free: true },
  { id: 'minimax/minimax-m2:free', name: 'MiniMax M2', provider: 'openrouter', purpose: 'General tasks', free: true },
  { id: 'qwen/qwen3-next-80b-a3b-instruct:free', name: 'Qwen3 Next 80B', provider: 'openrouter', purpose: 'Next-gen Qwen', free: true },
  { id: 'stepfun/step-3.5-flash:free', name: 'Step 3.5 Flash', provider: 'openrouter', purpose: 'Fast step reasoning', free: true },
  { id: 'arcee-ai/trinity-large-preview:free', name: 'Trinity Large', provider: 'openrouter', purpose: 'Large reasoning', free: true },
  { id: 'qwen/qwen3-vl-30b-a3b-thinking:free', name: 'Qwen3 VL 30B', provider: 'openrouter', purpose: 'Vision thinking', free: true },
  { id: 'qwen/qwen3-vl-235b-a22b-thinking:free', name: 'Qwen3 VL 235B', provider: 'openrouter', purpose: 'Large vision model', free: true },
  { id: 'qwen/qwen3-235b-a22b-thinking-2507:free', name: 'Qwen3 235B Thinking', provider: 'openrouter', purpose: 'Deep thinking', free: true },
  { id: 'upstage/solar-pro-3:free', name: 'Solar Pro 3', provider: 'openrouter', purpose: 'Professional tasks', free: true },
  { id: 'liquid/lfm-2.5-1.2b-thinking:free', name: 'LFM 2.5 Thinking', provider: 'openrouter', purpose: 'Compact thinking', free: true },
  { id: 'liquid/lfm-2.5-1.2b-instruct:free', name: 'LFM 2.5 Instruct', provider: 'openrouter', purpose: 'Compact instruct', free: true },
  { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Dolphin Mistral 24B', provider: 'openrouter', purpose: 'Uncensored tasks', free: true },
];

export const ALL_MODELS = [...GROQ_MODELS, ...OPENROUTER_MODELS];

// ---- User / Auth ----
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  github_username: string | null;
  created_at: string;
}

// ---- Agent Orchestration ----
export type AgentType = 'ai_lab' | 'instruction' | 'mechanic';

export interface AgentState {
  agent: AgentType;
  status: 'idle' | 'thinking' | 'executing' | 'complete' | 'error';
  messages: AgentMessage[];
  credits_used: number;
  result: unknown;
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  credits_cost?: number;
}
