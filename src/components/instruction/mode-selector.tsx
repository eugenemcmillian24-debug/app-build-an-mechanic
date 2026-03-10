'use client';

import { BookOpen, Rocket, Zap } from 'lucide-react';
import type { InstructionMode } from '@/types';

interface ModeSelectorProps {
  selected: InstructionMode;
  onSelect: (mode: InstructionMode) => void;
}

export default function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        onClick={() => onSelect('guide')}
        className={`relative p-5 rounded-xl border-2 text-left transition-all ${
          selected === 'guide'
            ? 'border-blue-500 bg-blue-950/30'
            : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2 rounded-lg ${
              selected === 'guide' ? 'bg-blue-600/20' : 'bg-zinc-800'
            }`}
          >
            <BookOpen
              className={`h-5 w-5 ${
                selected === 'guide' ? 'text-blue-400' : 'text-zinc-400'
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">Guide Mode</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">100 credits</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-zinc-400">
          Step-by-step instructions with copy-paste code blocks. Perfect for learning and customization.
        </p>
      </button>

      <button
        onClick={() => onSelect('autopilot')}
        className={`relative p-5 rounded-xl border-2 text-left transition-all ${
          selected === 'autopilot'
            ? 'border-violet-500 bg-violet-950/30'
            : 'border-zinc-700 bg-zinc-900 hover:border-zinc-600'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`p-2 rounded-lg ${
              selected === 'autopilot' ? 'bg-violet-600/20' : 'bg-zinc-800'
            }`}
          >
            <Rocket
              className={`h-5 w-5 ${
                selected === 'autopilot' ? 'text-violet-400' : 'text-zinc-400'
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-white">Autopilot Mode</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-400 font-medium">800 credits</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-zinc-400">
          Fully automatic code generation. Creates tables, routes, files, and migrations automatically.
        </p>
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-bold bg-violet-600 text-white rounded-full px-2 py-0.5 uppercase">
            Pro
          </span>
        </div>
      </button>
    </div>
  );
}
