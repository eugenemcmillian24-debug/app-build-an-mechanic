import { create } from 'zustand';
import type { AgentType, AgentMessage } from '@/types';

interface AgentState {
  currentAgent: AgentType | null;
  status: 'idle' | 'thinking' | 'executing' | 'complete' | 'error';
  messages: AgentMessage[];
  result: unknown;
  error: string | null;

  setAgent: (agent: AgentType) => void;
  setStatus: (status: AgentState['status']) => void;
  addMessage: (message: AgentMessage) => void;
  setResult: (result: unknown) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  currentAgent: null,
  status: 'idle',
  messages: [],
  result: null,
  error: null,

  setAgent: (agent) => set({ currentAgent: agent, status: 'idle', messages: [], result: null, error: null }),
  setStatus: (status) => set({ status }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setResult: (result) => set({ result, status: 'complete' }),
  setError: (error) => set({ error, status: 'error' }),
  reset: () =>
    set({ currentAgent: null, status: 'idle', messages: [], result: null, error: null }),
}));
