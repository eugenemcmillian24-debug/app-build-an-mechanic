'use client';

import { useState } from 'react';
import { Bot, Zap, Loader2 } from 'lucide-react';
import ModeSelector from '@/components/instruction/mode-selector';
import CostPredictor from '@/components/credits/cost-predictor';
import ProgressTracker from '@/components/agents/progress-tracker';
import type { InstructionMode, CreditActionType } from '@/types';

export default function BuildPage() {
  const [mode, setMode] = useState<InstructionMode>('guide');
  const [goal, setGoal] = useState('');
  const [showCost, setShowCost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<Array<{ label: string; status: 'pending' | 'active' | 'complete' | 'error' }>>([]);

  const actionType: CreditActionType = mode === 'autopilot' ? 'instruction_autopilot' : 'instruction_guide';

  const handleExecute = async () => {
    setShowCost(false);
    setLoading(true);
    setResult(null);
    setSteps([
      { label: 'Checking credits', status: 'active' },
      { label: `Running ${mode} mode`, status: 'pending' },
      { label: 'Generating output', status: 'pending' },
    ]);

    try {
      setSteps((s) => [{ ...s[0], status: 'complete' }, { ...s[1], status: 'active' }, s[2]]);

      const res = await fetch('/api/agents/instruction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, mode }),
      });

      const data = await res.json();
      setSteps((s) => [s[0], { ...s[1], status: 'complete' }, { ...s[2], status: res.ok ? 'complete' : 'error' }]);
      setResult(res.ok ? (data.content || JSON.stringify(data.result, null, 2)) : `Error: ${data.error}`);

      if (data.upsell) {
        setResult((prev) => `${prev}\n\n---\n${data.upsell}`);
      }
    } catch {
      setResult('Failed to execute. Check your connection and try again.');
      setSteps((s) => s.map((step) => step.status === 'active' ? { ...step, status: 'error' } : step));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Bot className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Build</h1>
        </div>
        <p className="text-zinc-400">Instruction Agent - build features with guide mode or autopilot code generation.</p>
      </div>

      <ModeSelector selected={mode} onSelect={setMode} />

      <div className="space-y-4">
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Describe what you want to build... (e.g., 'Create a user authentication system with email/password and OAuth')"
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder-zinc-600 resize-none h-32 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          onClick={() => setShowCost(true)}
          disabled={!goal || loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {mode === 'guide' ? 'Get Instructions' : 'Run Autopilot'}
        </button>
      </div>

      {showCost && (
        <CostPredictor actionType={actionType} onConfirm={handleExecute} onCancel={() => setShowCost(false)} loading={loading} />
      )}

      {steps.length > 0 && <ProgressTracker steps={steps} title="Build Progress" />}

      {result && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            {mode === 'guide' ? 'Instructions' : 'Generated Code'}
          </h3>
          <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-96">{result}</pre>
        </div>
      )}
    </div>
  );
}
