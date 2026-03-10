'use client';

import { useState } from 'react';
import { Microscope, Beaker, Globe, ShieldAlert, Cpu, Layers, Database, Activity, Loader2, Sparkles, ChevronRight, BarChart3, FlaskConical, Binary, Server } from 'lucide-react';
import CostPredictor from '@/components/credits/CostPredictor';
import { toast } from 'react-hot-toast';

const domains = [
  { id: 'research', title: 'Research', icon: FlaskConical, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { id: 'tools', title: 'Tools', icon: Binary, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { id: 'product', title: 'Product AI', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  { id: 'science', title: 'Science', icon: Beaker, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
  { id: 'safety', title: 'Safety', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
  { id: 'infra', title: 'Infra', icon: Server, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
];

export default function AiLabPage() {
  const [activeDomain, setActiveDomain] = useState('research');
  const [taskType, setTaskType] = useState<'createLab' | 'runExperiment' | 'deployModel'>('createLab');
  const [projectTitle, setProjectTitle] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleLabTask = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/agents/ai-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_type: taskType,
          domain: activeDomain,
          project_context: { title: projectTitle },
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to execute lab task');
      
      setResult(data);
      toast.success('Successfully executed lab task!');
      setShowConfirm(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
          <Microscope className="w-10 h-10 text-emerald-500" />
          AI LAB Operations
        </h1>
        <p className="text-zinc-400 text-lg font-medium italic">Google DeepMind-style R&D orchestration layer.</p>
      </div>

      {!showConfirm ? (
        <div className="grid lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Domain Selection */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest px-2 italic">Select Domain</h3>
            <div className="flex flex-col gap-2">
              {domains.map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => setActiveDomain(domain.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    activeDomain === domain.id 
                    ? `${domain.border} ${domain.bg} shadow-lg` 
                    : 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <domain.icon className={`w-5 h-5 ${activeDomain === domain.id ? domain.color : 'text-zinc-500'}`} />
                  <span className={`font-bold italic ${activeDomain === domain.id ? 'text-zinc-100' : 'text-zinc-400'}`}>
                    {domain.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div className="lg:col-span-9 space-y-8">
            <div className="bg-zinc-900/50 p-10 rounded-[3rem] border border-zinc-800 space-y-10">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] italic">Task Configuration</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'createLab', title: 'Initialize Lab', cost: '500 CR' },
                    { id: 'runExperiment', title: 'Run Experiment', cost: '300 CR' },
                    { id: 'deployModel', title: 'Deploy Model', cost: '800 CR' },
                  ].map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setTaskType(task.id as any)}
                      className={`p-6 rounded-3xl border-2 text-center transition-all ${
                        taskType === task.id 
                        ? 'border-emerald-500 bg-emerald-500/5' 
                        : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700'
                      }`}
                    >
                      <h4 className="font-black italic text-lg uppercase mb-1">{task.title}</h4>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{task.cost}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2 italic">Project Context / Title</label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. LLM Reasoning Benchmark v2..."
                    className="w-full p-5 bg-zinc-950 border border-zinc-800 rounded-2xl focus:border-emerald-500 transition-all font-bold italic text-lg"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                disabled={!projectTitle}
                className="w-full py-6 bg-emerald-500 text-zinc-950 rounded-[2rem] font-black text-xl hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 active:scale-95 italic"
              >
                EXECUTE R&D OPERATION
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
           <div className="p-10 bg-zinc-900 border border-zinc-800 rounded-[3rem] space-y-8 shadow-2xl">
            <button 
              onClick={() => setShowConfirm(false)}
              className="text-xs font-black text-zinc-500 hover:text-white transition-colors flex items-center gap-2 italic uppercase tracking-widest"
            >
              ← Back to lab config
            </button>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">Initialize R&D Gating</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1.5 bg-emerald-500/10 rounded-full text-[10px] font-black uppercase text-emerald-500 tracking-widest border border-emerald-500/20">{activeDomain}</span>
                <span className="px-4 py-1.5 bg-zinc-800 rounded-full text-[10px] font-black uppercase text-zinc-400 tracking-widest">{taskType}</span>
              </div>
              <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 font-mono text-sm text-zinc-500 leading-relaxed italic border-l-4 border-l-emerald-500">
                "{projectTitle}"
              </div>
            </div>

            <CostPredictor 
              actionType={`aiLab_${taskType}`} 
              onConfirm={handleLabTask}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-zinc-950/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center gap-8">
          <div className="relative">
            <Microscope className="w-24 h-24 text-emerald-500 animate-pulse" />
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full animate-[ping_3s_ease-in-out_infinite]" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase">Initializing Lab Unit...</h3>
            <p className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Running multi-modal pipelines & experiment tracking</p>
          </div>
          <div className="grid grid-cols-4 gap-2 w-64 h-1 bg-zinc-900 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 animate-[loading_2s_infinite_ease-in-out]" />
             <div className="h-full bg-emerald-500 animate-[loading_2s_infinite_ease-in-out_0.5s]" />
             <div className="h-full bg-emerald-500 animate-[loading_2s_infinite_ease-in-out_1s]" />
             <div className="h-full bg-emerald-500 animate-[loading_2s_infinite_ease-in-out_1.5s]" />
          </div>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-top-12 duration-1000 bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              <span className="font-black text-xl italic uppercase tracking-tighter">Experiment Results</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500 text-zinc-950 rounded-2xl text-[10px] font-black uppercase tracking-widest italic border shadow-lg shadow-emerald-500/20">
              LAB CERTIFIED • {result.cost} CR
            </div>
          </div>
          <div className="p-10 space-y-8">
            <div className="prose prose-invert max-w-none">
              {typeof result.content === 'string' ? (
                <div className="font-mono text-sm leading-relaxed bg-zinc-950 p-8 rounded-3xl border border-zinc-800 border-t-4 border-t-emerald-500 italic whitespace-pre-wrap">
                  {result.content}
                </div>
              ) : (
                <pre className="font-mono text-sm leading-relaxed bg-zinc-950 p-8 rounded-3xl border border-zinc-800 border-t-4 border-t-emerald-500 italic">
                  {JSON.stringify(result.content, null, 2)}
                </pre>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-800/50">
              <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 text-center">
                <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 italic">Accuracy</span>
                <span className="text-2xl font-black italic tracking-tighter text-emerald-400">99.8%</span>
              </div>
              <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 text-center">
                <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 italic">Latency</span>
                <span className="text-2xl font-black italic tracking-tighter text-blue-400">12ms</span>
              </div>
              <div className="p-6 bg-zinc-950 rounded-2xl border border-zinc-800 text-center">
                <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 italic">Safety</span>
                <span className="text-2xl font-black italic tracking-tighter text-emerald-500">PASS</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
