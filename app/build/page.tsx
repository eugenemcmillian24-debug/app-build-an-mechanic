'use client';

import { useState } from 'react';
import { Zap, Code2, Sparkles, Wand2, Terminal, ChevronRight, Check, AlertTriangle, Loader2 } from 'lucide-react';
import CostPredictor from '@/components/credits/CostPredictor';
import { toast } from 'react-hot-toast';

export default function BuildPage() {
  const [goal, setGoal] = useState('');
  const [mode, setMode] = useState<'guide' | 'autopilot'>('guide');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleBuild = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/agents/instruction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_goal: goal,
          mode,
          project_files_summary: "Initial Next.js project scaffold",
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to build');
      
      setResult(data);
      toast.success('Successfully generated instructions!');
      setShowConfirm(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
          <Zap className="w-10 h-10 text-amber-400 fill-amber-400" />
          Instruction Agent
        </h1>
        <p className="text-zinc-400 text-lg font-medium">Build complex features using natural language instructions or full autopilot.</p>
      </div>

      {!showConfirm ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('guide')}
              className={`p-6 rounded-3xl border-2 text-left transition-all ${
                mode === 'guide' 
                ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${mode === 'guide' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Wand2 className="w-6 h-6" />
                </div>
                {mode === 'guide' && <Check className="w-6 h-6 text-emerald-500" />}
              </div>
              <h3 className="text-xl font-black mb-1">GUIDE MODE</h3>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">Step-by-step instructions with code blocks. 100 CR per request.</p>
            </button>

            <button
              onClick={() => setMode('autopilot')}
              className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${
                mode === 'autopilot' 
                ? 'border-amber-400 bg-amber-400/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]' 
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${mode === 'autopilot' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Zap className="w-6 h-6" />
                </div>
                {mode === 'autopilot' && <Check className="w-6 h-6 text-amber-400" />}
              </div>
              <h3 className="text-xl font-black mb-1 uppercase italic">Autopilot</h3>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">Full automatic code generation and wiring. 800 CR per request.</p>
            </button>
          </div>

          {/* Goal Input */}
          <div className="space-y-4">
            <label className="text-sm font-black text-zinc-500 uppercase tracking-widest px-1">What are we building today?</label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Add a user profile page with GitHub integration and Neon database storage..."
              className="w-full h-48 p-6 bg-zinc-900 border-2 border-zinc-800 rounded-[2rem] focus:border-emerald-500 focus:ring-0 transition-all text-lg font-medium placeholder:text-zinc-600 resize-none shadow-inner"
            />
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={!goal}
            className="w-full py-6 bg-white text-zinc-950 rounded-[2rem] font-black text-xl hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 active:scale-95"
          >
            INITIALIZE BUILD
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in zoom-in-95 duration-300">
          <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-6">
            <button 
              onClick={() => setShowConfirm(false)}
              className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
            >
              ← Back to edit
            </button>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tight">Review & Execute</h2>
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 font-mono text-sm text-zinc-400 leading-relaxed italic">
                "{goal}"
              </div>
            </div>

            <CostPredictor 
              actionType={`instructionAgent_${mode}`} 
              onConfirm={handleBuild}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">Agents are working...</h3>
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mt-2 animate-pulse">Orchestrating multi-agent workflow</p>
          </div>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-zinc-300">Instruction Output</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20">
              PROCESSED • {result.cost} CR
            </div>
          </div>
          <div className="p-8 prose prose-invert max-w-none">
            {typeof result.content === 'string' ? (
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                {result.content}
              </pre>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                {JSON.stringify(result.content, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
