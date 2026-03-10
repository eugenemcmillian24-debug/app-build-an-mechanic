'use client';

import { useState } from 'react';
import { Activity, AlertTriangle, Bug, Zap, CheckCircle2, Loader2, RefreshCw, Terminal, Search, ShieldCheck } from 'lucide-react';
import CostPredictor from '@/components/credits/CostPredictor';
import { toast } from 'react-hot-toast';

export default function FixPage() {
  const [platform, setPlatform] = useState('Next.js');
  const [files, setFiles] = useState('');
  const [mode, setMode] = useState<'diagnose' | 'repair'>('diagnose');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFix = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/agents/mechanic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          file_tree: files,
          mode,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fix');
      
      setResult(data.content);
      toast.success('Successfully completed analysis!');
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
          <Activity className="w-10 h-10 text-blue-400" />
          Mechanic Agent
        </h1>
        <p className="text-zinc-400 text-lg font-medium italic">Diagnose and repair production apps from any platform.</p>
      </div>

      {!showConfirm ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('diagnose')}
              className={`p-6 rounded-3xl border-2 text-left transition-all ${
                mode === 'diagnose' 
                ? 'border-blue-400 bg-blue-400/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${mode === 'diagnose' ? 'bg-blue-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Search className="w-6 h-6" />
                </div>
                {mode === 'diagnose' && <CheckCircle2 className="w-6 h-6 text-blue-400" />}
              </div>
              <h3 className="text-xl font-black mb-1">DIAGNOSE</h3>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed italic">Detailed report + code diffs. 200 CR per request.</p>
            </button>

            <button
              onClick={() => setMode('repair')}
              className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${
                mode === 'repair' 
                ? 'border-indigo-400 bg-indigo-400/5 shadow-[0_0_20px_rgba(129,140,248,0.1)]' 
                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${mode === 'repair' ? 'bg-indigo-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                {mode === 'repair' && <CheckCircle2 className="w-6 h-6 text-indigo-400" />}
              </div>
              <h3 className="text-xl font-black mb-1 uppercase italic tracking-tighter">Repair</h3>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed italic">Auto-applied fixes + sandbox tested. 1200 CR per request.</p>
            </button>
          </div>

          <div className="space-y-6 bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest px-1">Platform</label>
                <select 
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl focus:border-blue-500 transition-all font-bold italic"
                >
                  <option>Next.js</option>
                  <option>React</option>
                  <option>Vue</option>
                  <option>Svelte</option>
                  <option>React Native</option>
                  <option>Flutter</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest px-1 italic">Input Code / File Tree</label>
              <textarea
                value={files}
                onChange={(e) => setFiles(e.target.value)}
                placeholder="Paste code or describe project structure..."
                className="w-full h-48 p-6 bg-zinc-950 border border-zinc-800 rounded-3xl focus:border-blue-500 transition-all font-mono text-sm placeholder:text-zinc-700 resize-none shadow-inner"
              />
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={!files}
            className="w-full py-6 bg-blue-500 text-zinc-950 rounded-[2rem] font-black text-xl hover:bg-blue-400 transition-all disabled:opacity-50 disabled:grayscale active:scale-95 italic"
          >
            EXECUTE MECHANIC WORKFLOW
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in zoom-in-95 duration-300">
          <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-6">
            <button 
              onClick={() => setShowConfirm(false)}
              className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2 italic"
            >
              ← Back to edit
            </button>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Review Fix Order</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] font-black uppercase text-zinc-400 tracking-widest">{platform}</span>
                <span className="px-3 py-1 bg-blue-500/10 rounded-full text-[10px] font-black uppercase text-blue-400 tracking-widest">{mode}</span>
              </div>
            </div>

            <CostPredictor 
              actionType={`mechanicAgent_${mode}`} 
              onConfirm={handleFix}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <RefreshCw className="w-16 h-16 text-blue-400 animate-spin" />
            <ShieldCheck className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">Mechanic is working...</h3>
            <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mt-2 animate-pulse">Running static linting, performance analysis & security scans</p>
          </div>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 space-y-6">
          {/* Diagnosis */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <Bug className="w-5 h-5 text-red-400" />
                <span className="font-bold text-zinc-300 uppercase tracking-tighter italic">Diagnosis Report</span>
              </div>
            </div>
            <div className="p-8 space-y-4">
              {result.diagnosis?.map((issue: any, i: number) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    issue.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-zinc-500">{issue.file}</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-black uppercase text-zinc-400">{issue.severity}</span>
                    </div>
                    <p className="font-bold text-zinc-200">{issue.issue}</p>
                    <p className="text-sm text-zinc-500 mt-1 italic">Type: {issue.fixType}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixes */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-zinc-300 uppercase tracking-tighter italic">Recommended Fixes</span>
              </div>
              <button className="px-4 py-2 bg-indigo-500 text-zinc-950 text-xs font-black rounded-xl hover:bg-indigo-400 transition-all uppercase italic">Apply All Fixes</button>
            </div>
            <div className="p-8 space-y-6">
              {result.fixes?.map((fix: any, i: number) => (
                <div key={i} className="space-y-3">
                   <div className="flex items-center gap-2 px-2">
                    <Terminal className="w-4 h-4 text-zinc-600" />
                    <span className="text-xs font-mono text-zinc-400 italic">{fix.path}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 bg-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-tighter">OLD</div>
                      <pre className="text-xs font-mono text-red-400 opacity-60 line-through truncate">{fix.oldCode || '// previous code'}</pre>
                    </div>
                    <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 bg-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-tighter">NEW</div>
                      <pre className="text-xs font-mono text-emerald-400 font-bold">{fix.newCode}</pre>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 px-2 font-medium italic">Reason: {fix.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
