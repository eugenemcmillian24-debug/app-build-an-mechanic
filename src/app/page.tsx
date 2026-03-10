import Link from 'next/link';
import { Zap, Beaker, Bot, Wrench, ArrowRight, Github, Globe, Database, Cpu, Shield, Layers } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Zap className="h-7 w-7 text-violet-500" />
              <span className="font-bold text-xl text-white tracking-tight">
                OPS AI <span className="text-violet-400">DEV</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">Sign In</Link>
              <Link href="/login" className="bg-violet-600 hover:bg-violet-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-600/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6">
            <Cpu className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-medium text-violet-400">Multi-Agent AI Architecture</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
            Build Full-Stack Apps<br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">With AI Agents</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Production-ready AI app builder with multi-agent architecture. Build, deploy, and fix apps with credit-based pay-per-use. Auto-deploy to Vercel &amp; Netlify.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-8 py-3.5 text-base font-semibold transition-colors animate-pulse-glow">
              Start Building <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="#features" className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl px-8 py-3.5 text-base font-medium transition-colors">See Features</Link>
          </div>
          <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16">
            {[{ value: '50+', label: 'AI Models' }, { value: '3', label: 'Agents' }, { value: '2', label: 'Deploy Targets' }, { value: '100', label: 'Free DBs' }].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Three Powerful Agents</h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">Each agent specializes in different aspects of app development and maintenance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-violet-500/30 transition-colors">
              <div className="p-3 bg-violet-600/10 rounded-xl w-fit mb-5"><Beaker className="h-7 w-7 text-violet-400" /></div>
              <h3 className="text-xl font-bold text-white mb-3">AI Lab Agent</h3>
              <p className="text-sm text-zinc-400 mb-5">Google DeepMind-style R&amp;D operations. Create labs, run experiments, track metrics, and deploy with safety gates.</p>
              <div className="space-y-2">
                {[{ action: 'Create Lab', cost: 500 }, { action: 'Run Experiment', cost: 300 }, { action: 'Deploy', cost: 800 }].map((item) => (
                  <div key={item.action} className="flex items-center justify-between text-sm"><span className="text-zinc-500">{item.action}</span><span className="text-amber-400 font-medium">{item.cost} cr</span></div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-blue-500/30 transition-colors">
              <div className="p-3 bg-blue-600/10 rounded-xl w-fit mb-5"><Bot className="h-7 w-7 text-blue-400" /></div>
              <h3 className="text-xl font-bold text-white mb-3">Instruction Agent</h3>
              <p className="text-sm text-zinc-400 mb-5">Two modes: Guide (step-by-step) and Autopilot (auto-codegen). Build complex features with AI-powered code generation.</p>
              <div className="space-y-2">
                {[{ action: 'Guide Mode', cost: 100 }, { action: 'Autopilot Mode', cost: 800 }].map((item) => (
                  <div key={item.action} className="flex items-center justify-between text-sm"><span className="text-zinc-500">{item.action}</span><span className="text-amber-400 font-medium">{item.cost} cr</span></div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-colors">
              <div className="p-3 bg-emerald-600/10 rounded-xl w-fit mb-5"><Wrench className="h-7 w-7 text-emerald-400" /></div>
              <h3 className="text-xl font-bold text-white mb-3">Mechanic Agent</h3>
              <p className="text-sm text-zinc-400 mb-5">Elite full-stack mechanic. Diagnose bugs, security issues, performance problems. Auto-repair with future-proofing.</p>
              <div className="space-y-2">
                {[{ action: 'Diagnose', cost: 200 }, { action: 'Repair', cost: 1200 }].map((item) => (
                  <div key={item.action} className="flex items-center justify-between text-sm"><span className="text-zinc-500">{item.action}</span><span className="text-amber-400 font-medium">{item.cost} cr</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Integrations</h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">Everything you need to build, deploy, and scale production apps.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[{ icon: Globe, label: 'Vercel', desc: 'Auto-deploy' }, { icon: Globe, label: 'Netlify', desc: 'Auto-deploy' }, { icon: Database, label: 'Neon', desc: '100 free DBs' }, { icon: Github, label: 'GitHub', desc: 'Auto-repo' }, { icon: Cpu, label: 'Groq', desc: 'Fast AI' }, { icon: Layers, label: 'OpenRouter', desc: '50+ models' }].map((item) => (
              <div key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-zinc-700 transition-colors">
                <item.icon className="h-6 w-6 text-zinc-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Credit Packs</h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">Pay only for what you use. No subscriptions, no hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[{ name: 'Starter', credits: 100, price: 5, popular: false }, { name: 'Pro', credits: 300, price: 15, popular: true }, { name: 'Premium', credits: 500, price: 25, popular: false }, { name: 'Custom', credits: 900, price: 45, popular: false }].map((pack) => (
              <div key={pack.name} className={`relative bg-zinc-900 border rounded-2xl p-6 text-center ${pack.popular ? 'border-violet-500 ring-1 ring-violet-500/20' : 'border-zinc-800'}`}>
                {pack.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-violet-600 text-white text-xs font-bold rounded-full px-3 py-1">Popular</span></div>}
                <h3 className="text-lg font-bold text-white mb-1">{pack.name}</h3>
                <p className="text-3xl font-bold text-white mb-1">${pack.price}</p>
                <p className="text-sm text-zinc-500 mb-4">{pack.credits} credits</p>
                <p className="text-xs text-zinc-600">${(pack.price / pack.credits).toFixed(3)}/credit</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-zinc-800/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Build?</h2>
          <p className="text-lg text-zinc-400 mb-8">Start building production-ready apps with AI-powered multi-agent architecture.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-8 py-3.5 text-base font-semibold transition-colors">
            <Github className="h-5 w-5" /> Sign in with GitHub
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Zap className="h-5 w-5 text-violet-500" /><span className="font-bold text-sm text-zinc-400">OPS AI DEV</span></div>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-zinc-600" /><p className="text-xs text-zinc-600">Production-ready. Credit-based. No free tier.</p></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
