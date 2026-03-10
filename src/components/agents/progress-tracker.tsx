'use client';

import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface Step {
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
}

interface ProgressTrackerProps {
  steps: Step[];
  title?: string;
}

export default function ProgressTracker({ steps, title }: ProgressTrackerProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
      {title && (
        <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          {title}
        </h4>
      )}
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            {step.status === 'complete' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : step.status === 'active' ? (
              <Loader2 className="h-5 w-5 text-violet-400 shrink-0 animate-spin" />
            ) : step.status === 'error' ? (
              <Circle className="h-5 w-5 text-red-400 shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-zinc-600 shrink-0" />
            )}
            <span
              className={`text-sm ${
                step.status === 'complete'
                  ? 'text-zinc-300'
                  : step.status === 'active'
                  ? 'text-white font-medium'
                  : step.status === 'error'
                  ? 'text-red-400'
                  : 'text-zinc-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
