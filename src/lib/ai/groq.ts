import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export type GroqModel =
  | 'llama-3.1-70b-versatile'
  | 'llama-3.1-8b-instant'
  | 'deepseek-r1-distill-llama-70b'
  | 'distil-whisper-large-v3-en';

interface GroqChatOptions {
  model?: GroqModel;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function groqChat(
  userMessage: string,
  options: GroqChatOptions = {}
) {
  const {
    model = 'llama-3.1-70b-versatile',
    systemPrompt = 'You are a helpful AI assistant.',
    temperature = 0.7,
    maxTokens = 4096,
  } = options;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    model,
    temperature,
    max_tokens: maxTokens,
  });

  return {
    content: completion.choices[0]?.message?.content || '',
    usage: completion.usage,
    model: completion.model,
  };
}

export async function groqChatStream(
  userMessage: string,
  options: GroqChatOptions = {}
) {
  const {
    model = 'llama-3.1-70b-versatile',
    systemPrompt = 'You are a helpful AI assistant.',
    temperature = 0.7,
    maxTokens = 4096,
  } = options;

  const stream = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    model,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });

  return stream;
}

/** Route to the right model based on task complexity */
export function selectGroqModel(taskComplexity: 'simple' | 'complex' | 'reasoning'): GroqModel {
  switch (taskComplexity) {
    case 'simple':
      return 'llama-3.1-8b-instant';
    case 'complex':
      return 'llama-3.1-70b-versatile';
    case 'reasoning':
      return 'deepseek-r1-distill-llama-70b';
    default:
      return 'llama-3.1-70b-versatile';
  }
}

export async function transcribeAudio(audioBuffer: Buffer, fileName: string) {
  const blob = new Blob([new Uint8Array(audioBuffer)], { type: 'audio/wav' });
  const file = new File([blob], fileName, { type: 'audio/wav' });

  const transcription = await groq.audio.transcriptions.create({
    file,
    model: 'distil-whisper-large-v3-en',
    response_format: 'json',
  });

  return transcription;
}

export { groq };
