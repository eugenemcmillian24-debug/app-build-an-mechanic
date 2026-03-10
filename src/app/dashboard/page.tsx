'use client';

import Link from 'next/link';
import { Beaker, Bot, Wrench, Zap, ArrowRight, Activity, Database, Globe } from 'lucide-react';
import CreditWallet from '@/components/credits/credit-wallet';

const agents = [
  {
    name: 'AI Lab',
    description: 'R&D operations - create labs, run experiments, deploy models',
    icon: Beaker,
    color: 'violet',
    href: '/ai-lab',
    actions: ['Create Lab (500 cr)', 'Run Experiment (300 cr)', 'Deploy (800 cr)'],
  },
  {
    name: 'Build',
    description: 'Instruction Agent - guide mode or autopilot code generation',
    icon: Bot,
    color: 'blue',
    href: '/build',
    actions: ['Guide Mode (100 cr)', 'Autopilot Mode (800 cr)'],
  },
  {
    name: 'Fix',
    description: 'Mechanic Agent - diagnose and repair apps from any platform',
    icon: Wrench,
    color: 'emerald',
    href: '/fix',
    actions: ['Diagnose (200 cr)', 'Repair (1200 cr)'],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  violet: { bg: 'bg-violet-600/10', text: 'text-violet-400', border: 'hover:border-violet-500/30' },
  blue: { bg: 'bg-blue-600/10', text: 'text-blue-400', border: 'hover:border-blue-500/30' },
  emerald: { bg: 'bg-emerald-600/10', text: 'text-emerald-400', border: 'hover:border-emerald-500/30' },
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-zinc-400">Select an agent to start building, or manage your credits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Credit Wallet */}
        <div className="lg:col-span-1">
          <CreditWallet />
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Activity, label: 'AI Models', value: '50+', desc: 'Groq + OpenRouter' },
            { icon: Database, label: 'Free Databases', value: '100', desc: 'Neon PostgreSQL' },
            { icon: Globe, label: 'Deploy Targets', value: '2', desc: 'Vercel + Netlify' },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <stat.icon className="h-4 w-4 text-zinc-500" />
                <span className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-zinc-500 mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Cards */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">AI Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const colors = colorMap[agent.color];
            return (
              <Link
                key={agent.name}
                href={agent.href}
                className={`group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-colors ${colors.border}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colors.bg}`}>
                    <agent.icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{agent.name}</h3>
                <p className="text-sm text-zinc-400 mb-4">{agent.description}</p>
                <div className="space-y-1.5">
                  {agent.actions.map((action) => (
                    <div key={action} className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-amber-400" />
                      <span className="text-xs text-zinc-500">{action}</span>
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
