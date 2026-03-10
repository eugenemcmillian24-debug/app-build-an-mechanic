import { OPENROUTER_MODELS } from '@/types';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

interface OpenRouterChatOptions {
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

export async function openRouterChat(
  userMessage: string,
  options: OpenRouterChatOptions = {}
): Promise<{ content: string; usage: OpenRouterResponse['usage']; model: string }> {
  const {
    model = 'qwen/qwen3-coder:free',
    systemPrompt = 'You are a helpful AI assistant.',
    temperature = 0.7,
    maxTokens = 4096,
  } = options;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://ops-ai-dev.vercel.app',
      'X-Title': 'OPS AI DEV',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  const data: OpenRouterResponse = await response.json();

  return {
    content: data.choices[0]?.message?.content || '',
    usage: data.usage,
    model: data.model,
  };
}

export async function openRouterStream(
  userMessage: string,
  options: OpenRouterChatOptions = {}
) {
  const {
    model = 'qwen/qwen3-coder:free',
    systemPrompt = 'You are a helpful AI assistant.',
    temperature = 0.7,
    maxTokens = 4096,
  } = options;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://ops-ai-dev.vercel.app',
      'X-Title': 'OPS AI DEV',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  return response;
}

/** Select the best model based on task type */
export function selectOpenRouterModel(
  taskType: 'code' | 'reasoning' | 'vision' | 'chat' | 'fast'
): string {
  switch (taskType) {
    case 'code':
      return 'qwen/qwen3-coder:free';
    case 'reasoning':
      return 'deepseek/deepseek-r1-0528:free';
    case 'vision':
      return 'qwen/qwen3-vl-30b-a3b-thinking:free';
    case 'chat':
      return 'meta-llama/llama-3.3-70b-instruct:free';
    case 'fast':
      return 'google/gemini-2.0-flash-exp:free';
    default:
      return 'qwen/qwen3-coder:free';
  }
}

/** Get all available free models */
export function getAvailableModels() {
  return OPENROUTER_MODELS;
}
