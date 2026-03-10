'use client';

import { useState } from 'react';
import { Beaker, FlaskConical, Rocket, Zap, Loader2, Plus } from 'lucide-react';
import CostPredictor from '@/components/credits/cost-predictor';
import ProgressTracker from '@/components/agents/progress-tracker';
import type { CreditActionType } from '@/types';

type Operation = 'create' | 'experiment' | 'deploy';

const operations: Array<{
  id: Operation;
  label: string;
  desc: string;
  icon: typeof Beaker;
  cost: number;
  actionType: CreditActionType;
  color: string;
}> = [
  { id: 'create', label: 'Create Lab', desc: 'Initialize a new AI research lab with domain specialization', icon: Plus, cost: 500, actionType: 'ai_lab_create', color: 'violet' },
  { id: 'experiment', label: 'Run Experiment', desc: 'Execute an experiment with metrics tracking and leaderboards', icon: FlaskConical, cost: 300, actionType: 'ai_lab_experiment', color: 'blue' },
  { id: 'deploy', label: 'Deploy Model', desc: 'Deploy to production with safety gates and endpoint management', icon: Rocket, cost: 800, actionType: 'ai_lab_deploy', color: 'emerald' },
];

export default function AILabPage() {
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null);
  const [showCost, setShowCost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<Array<{ label: string; status: 'pending' | 'active' | 'complete' | 'error' }>>([]);

  const handleExecute = async () => {
    if (!selectedOp || !task) return;
    setShowCost(false);
    setLoading(true);
    setResult(null);
    setSteps([
      { label: 'Checking credits', status: 'active' },
      { label: 'Initializing agent', status: 'pending' },
      { label: 'Processing task', status: 'pending' },
      { label: 'Generating output', status: 'pending' },
    ]);

    try {
      setSteps((s) => [{ ...s[0], status: 'complete' }, { ...s[1], status: 'active' }, s[2], s[3]]);

      const res = await fetch('/api/agents/ai-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, operation: selectedOp }),
      });

      setSteps((s) => [s[0], { ...s[1], status: 'complete' }, { ...s[2], status: 'active' }, s[3]]);

      const data = await res.json();

      if (!res.ok) {
        setResult(`Error: ${data.error}`);
        setSteps((s) => [s[0], s[1], { ...s[2], status: 'error' }, s[3]]);
        return;
      }

      setSteps((s) => [s[0], s[1], { ...s[2], status: 'complete' }, { ...s[3], status: 'complete' }]);
      setResult(data.content || JSON.stringify(data.result, null, 2));
    } catch (err) {
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
          <div className="p-2 bg-violet-600/20 rounded-lg">
            <Beaker className="h-6 w-6 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">AI Lab</h1>
        </div>
        <p className="text-zinc-400">Google DeepMind-style R&amp;D operations for research, experiments, and deployments.</p>
      </div>

      {/* Operation Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {operations.map((op) => (
          <button
            key={op.id}
            onClick={() => { setSelectedOp(op.id); setShowCost(false); setResult(null); }}
            className={`p-5 rounded-xl border-2 text-left transition-all ${
              selectedOp === op.id
                ? 'border-violet-500 bg-violet-950/30'
                : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <op.icon className={`h-5 w-5 ${selectedOp === op.id ? 'text-violet-400' : 'text-zinc-400'}`} />
              <span className="font-semibold text-white">{op.label}</span>
            </div>
            <p className="text-xs text-zinc-400 mb-2">{op.desc}</p>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">{op.cost} credits</span>
            </div>
          </button>
        ))}
      </div>

      {/* Task Input */}
      {selectedOp && (
        <div className="space-y-4">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder={`Describe your ${selectedOp === 'create' ? 'lab and domain' : selectedOp === 'experiment' ? 'experiment configuration' : 'deployment requirements'}...`}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder-zinc-600 resize-none h-32 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowCost(true)}
              disabled={!task || loading}
              className="bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Execute
            </button>
          </div>
        </div>
      )}

      {/* Cost Predictor */}
      {showCost && selectedOp && (
        <CostPredictor
          actionType={operations.find((o) => o.id === selectedOp)!.actionType}
          onConfirm={handleExecute}
          onCancel={() => setShowCost(false)}
          loading={loading}
        />
      )}

      {/* Progress */}
      {steps.length > 0 && <ProgressTracker steps={steps} title="Execution Progress" />}

      {/* Result */}
      {result && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Result</h3>
          <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-96">{result}</pre>
        </div>
      )}
    </div>
  );
}
