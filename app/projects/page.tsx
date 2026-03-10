'use client';

import { useState, useEffect } from 'react';
import { Cpu, Globe, Database, Github, ExternalLink, MoreVertical, Search, Plus, Filter, LayoutGrid, List } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('ai_lab_projects').select('*').order('created_at', { ascending: false });
      if (error) {
        toast.error('Failed to fetch projects');
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <Cpu className="w-10 h-10 text-purple-400" />
            Project Hub
          </h1>
          <p className="text-zinc-400 text-lg font-medium italic">Manage your AI-generated infrastructure.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><LayoutGrid className="w-5 h-5" /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><List className="w-5 h-5" /></button>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 rounded-xl font-black text-sm hover:bg-emerald-400 transition-all uppercase italic">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:border-purple-500 transition-all text-sm font-medium italic"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-black uppercase text-zinc-500 tracking-widest hover:border-zinc-700 transition-all">
            <Filter className="w-3.5 h-3.5" />
            Domain
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-black uppercase text-zinc-500 tracking-widest hover:border-zinc-700 transition-all">
            <Activity className="w-3.5 h-3.5" />
            Status
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 bg-zinc-900/50 animate-pulse rounded-[2.5rem] border border-zinc-800" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-zinc-900/30 rounded-[3rem] border-2 border-dashed border-zinc-800">
          <div className="p-6 bg-zinc-800/50 rounded-full border border-zinc-700">
            <Cpu className="w-12 h-12 text-zinc-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase">No projects found</h3>
            <p className="text-zinc-500 max-w-sm font-medium italic">Start building with Autopilot or AI Lab to see your infrastructure here.</p>
          </div>
          <button className="px-8 py-3 bg-zinc-800 text-white rounded-xl font-bold hover:bg-zinc-700 transition-all uppercase text-sm tracking-widest">Initial Deploy</button>
        </div>
      ) : (
        <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {projects.map((project) => (
            <div key={project.id} className="group relative bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-[2.5rem] p-8 transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">{project.title}</h3>
                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{project.domain}</p>
                  </div>
                </div>
                <button className="p-2 text-zinc-600 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-8">
                <div className="flex flex-col items-center p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <Globe className="w-4 h-4 text-emerald-400 mb-1" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase">Live</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <Database className="w-4 h-4 text-blue-400 mb-1" />
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Neon DB</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <Github className="w-4 h-4 text-zinc-400 mb-1" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Vercel</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-black uppercase tracking-widest hover:border-white transition-all">Details</button>
                <button className="flex-1 py-3 bg-purple-500 text-zinc-950 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-400 transition-all flex items-center justify-center gap-2">
                  Open App
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
