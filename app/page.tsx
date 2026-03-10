'use client';

import { Microscope, Zap, Activity, Cpu, ArrowRight, ExternalLink, Code2, Globe, Database, Terminal } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Lab Operations",
    description: "Google DeepMind-style R&D ops. Research, experiments, and model deployments.",
    icon: Microscope,
    href: "/ai-lab",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    credits: "500-800",
  },
  {
    title: "Instruction Agent",
    description: "Build full-stack apps from natural language. Guide and Autopilot modes available.",
    icon: Zap,
    href: "/build",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    credits: "100-800",
  },
  {
    title: "Mechanic Agent",
    description: "Diagnose and repair any web app. Fix bugs, optimize performance and security.",
    icon: Activity,
    href: "/fix",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    credits: "200-1200",
  },
];

const integrations = [
  { name: "Vercel", icon: Globe },
  { name: "Netlify", icon: Globe },
  { name: "Neon", icon: Database },
  { name: "GitHub", icon: Code2 },
  { name: "OpenRouter", icon: Terminal },
  { name: "Groq", icon: Zap },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-20 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 uppercase tracking-widest"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Production-Ready Agentic AI Platform
        </motion.div>
        
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-black tracking-tighter"
          >
            OPS <span className="text-emerald-500">AI</span> DEV
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto font-medium"
          >
            The next generation of AI-driven software engineering. Build, diagnose, 
            and repair production applications with a multi-agent orchestration.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link 
            href="/build" 
            className="px-8 py-4 bg-emerald-500 text-zinc-950 font-black rounded-2xl hover:scale-105 transition-all shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] active:scale-95"
          >
            START BUILDING NOW
          </Link>
          <Link 
            href="/ai-lab" 
            className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all active:scale-95"
          >
            EXPLORE AI LAB
          </Link>
        </motion.div>
      </section>

      {/* Agents Section */}
      <section className="grid lg:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="group relative"
          >
            <Link href={feature.href} className={`block p-8 h-full rounded-3xl border ${feature.border} ${feature.bg} backdrop-blur-sm transition-all hover:-translate-y-2 hover:shadow-2xl`}>
              <div className="space-y-6">
                <div className={`p-4 rounded-2xl w-fit ${feature.color} bg-white/5`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/20">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Starts at {feature.credits} credits</span>
                  <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Stats/Integrations */}
      <section className="py-12 px-8 rounded-[3rem] bg-zinc-900/50 border border-zinc-800 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-sm font-black text-emerald-500 uppercase tracking-[0.2em]">Ecosystem</h2>
          <p className="text-3xl font-black">Powered by Industry Leaders</p>
        </div>

        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          {integrations.map((item) => (
            <div key={item.name} className="flex items-center gap-2 font-bold text-lg">
              <item.icon className="w-6 h-6" />
              {item.name}
            </div>
          ))}
        </div>
      </section>

      {/* Footer-ish */}
      <footer className="flex flex-col lg:flex-row justify-between items-center gap-8 py-12 border-t border-zinc-900">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-emerald-500" />
          <span className="font-black text-xl italic tracking-tighter uppercase">OPS AI DEV</span>
        </div>
        <div className="flex gap-8 text-sm font-bold text-zinc-500 uppercase tracking-widest">
          <a href="#" className="hover:text-emerald-400">Documentation</a>
          <a href="#" className="hover:text-emerald-400">API Status</a>
          <a href="#" className="hover:text-emerald-400">Twitter</a>
          <a href="#" className="hover:text-emerald-400">Discord</a>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <Cpu className="w-4 h-4" />
          <span className="text-xs font-medium">Build: 25.03.10-PROD</span>
        </div>
      </footer>
    </div>
  );
}
