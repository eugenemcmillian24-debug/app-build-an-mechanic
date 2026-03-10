'use client';

import { useState } from 'react';
import { Wrench, Zap, Loader2, Search, Hammer } from 'lucide-react';
import Dropzone from '@/components/mechanic/dropzone';
import CostPredictor from '@/components/credits/cost-predictor';
import ProgressTracker from '@/components/agents/progress-tracker';
import IssueReport from '@/components/mechanic/issue-report';
import DiffViewer from '@/components/agents/diff-viewer';
import type { MechanicMode, CreditActionType, Platform } from '@/types';

const platforms: Array<{ id: Platform; label: string }> = [
  { id: 'nextjs', label: 'Next.js' },
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'svelte', label: 'Svelte' },
  { id: 'vanilla', label: 'Vanilla JS' },
  { id: 'react-native', label: 'React Native' },
  { id: 'flutter', label: 'Flutter' },
];

export default function FixPage() {
  const [mode, setMode] = useState<MechanicMode>('diagnose');
  const [platform, setPlatform] = useState<Platform>('nextjs');
  const [files, setFiles] = useState<Array<{ path: string; content: string }>>([]);
  const [issues, setIssues] = useState('');
  const [showCost, setShowCost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [rawContent, setRawContent] = useState<string | null>(null);
  const [steps, setSteps] = useState<Array<{ label: string; status: 'pending' | 'active' | 'complete' | 'error' }>>([]);

  const actionType: CreditActionType = mode === 'repair' ? 'mechanic_repair' : 'mechanic_diagnose';

  const handleExecute = async () => {
    setShowCost(false);
    setLoading(true);
    setResult(null);
    setRawContent(null);
    setSteps([
      { label: 'Checking credits', status: 'active' },
      { label: 'Analyzing code', status: 'pending' },
      { label: mode === 'diagnose' ? 'Generating report' : 'Applying fixes', status: 'pending' },
    ]);

    try {
      setSteps((s) => [{ ...s[0], status: 'complete' }, { ...s[1], status: 'active' }, s[2]]);

      const res = await fetch('/api/agents/mechanic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files, platform, mode, userIssues: issues ? [issues] : [] }),
      });

      const data = await res.json();
      setSteps((s) => [s[0], { ...s[1], status: 'complete' }, { ...s[2], status: res.ok ? 'complete' : 'error' }]);

      if (res.ok) {
        setResult(data.result);
        setRawContent(data.content);
      } else {
        setRawContent(`Error: ${data.error}`);
      }
    } catch {
      setRawContent('Failed to execute.');
      setSteps((s) => s.map((step) => step.status === 'active' ? { ...step, status: 'error' } : step));
    } finally {
      setLoading(false);
    }
  };

  const diagnosisIssues = result && Array.isArray((result as Record<string, unknown>).diagnosis)
    ? (result as Record<string, unknown>).diagnosis as Array<{ file: string; issue: string; severity: 'low' | 'medium' | 'high' | 'critical'; fixType: string }>
    : [];

  const fixes = result && Array.isArray((result as Record<string, unknown>).fixes)
    ? (result as Record<string, unknown>).fixes as Array<{ path: string; oldCode: string; newCode: string; reason: string }>
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-600/20 rounded-lg">
            <Wrench className="h-6 w-6 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Fix</h1>
        </div>
        <p className="text-zinc-400">Mechanic Agent - diagnose and repair apps from any platform.</p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => setMode('diagnose')} className={`p-5 rounded-xl border-2 text-left transition-all ${mode === 'diagnose' ? 'border-emerald-500 bg-emerald-950/30' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'}`}>
          <div className="flex items-center gap-3 mb-2">
            <Search className={`h-5 w-5 ${mode === 'diagnose' ? 'text-emerald-400' : 'text-zinc-400'}`} />
            <span className="font-semibold text-white">Diagnose</span>
          </div>
          <p className="text-xs text-zinc-400 mb-2">Detailed report with code diffs and upgrade suggestions</p>
          <div className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-400" /><span className="text-xs text-amber-400 font-medium">200 credits</span></div>
        </button>
        <button onClick={() => setMode('repair')} className={`p-5 rounded-xl border-2 text-left transition-all ${mode === 'repair' ? 'border-orange-500 bg-orange-950/30' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'}`}>
          <div className="flex items-center gap-3 mb-2">
            <Hammer className={`h-5 w-5 ${mode === 'repair' ? 'text-orange-400' : 'text-zinc-400'}`} />
            <span className="font-semibold text-white">Repair</span>
          </div>
          <p className="text-xs text-zinc-400 mb-2">Auto-applied fixes with sandbox testing and metrics</p>
          <div className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-400" /><span className="text-xs text-amber-400 font-medium">1,200 credits</span></div>
        </button>
      </div>

      {/* Platform */}
      <div>
        <label className="text-sm font-medium text-zinc-400 block mb-2">Platform</label>
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button key={p.id} onClick={() => setPlatform(p.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${platform === p.id ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <Dropzone onFilesLoaded={setFiles} />

      {/* Issues */}
      <textarea value={issues} onChange={(e) => setIssues(e.target.value)} placeholder="Describe any specific issues, errors, or broken user flows..." className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-white placeholder-zinc-600 resize-none h-24 focus:outline-none focus:border-emerald-500 transition-colors" />

      <button onClick={() => setShowCost(true)} disabled={files.length === 0 || loading} className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors flex items-center gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
        {mode === 'diagnose' ? 'Run Diagnosis' : 'Start Repair'}
      </button>

      {showCost && <CostPredictor actionType={actionType} onConfirm={handleExecute} onCancel={() => setShowCost(false)} loading={loading} />}
      {steps.length > 0 && <ProgressTracker steps={steps} title={`${mode === 'diagnose' ? 'Diagnosis' : 'Repair'} Progress`} />}
      {diagnosisIssues.length > 0 && <IssueReport issues={diagnosisIssues} />}
      {fixes.length > 0 && <DiffViewer diffs={fixes} />}
      {rawContent && !diagnosisIssues.length && !fixes.length && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Result</h3>
          <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-96">{rawContent}</pre>
        </div>
      )}
    </div>
  );
}
