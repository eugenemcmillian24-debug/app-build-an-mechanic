'use client';

import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import type { Severity } from '@/types';

interface Issue {
  file: string;
  issue: string;
  severity: Severity;
  fixType: string;
  line?: number | null;
}

interface IssueReportProps {
  issues: Issue[];
  summary?: string;
}

const severityConfig: Record<
  Severity,
  { icon: typeof AlertTriangle; color: string; bg: string; label: string }
> = {
  critical: {
    icon: ShieldAlert,
    color: 'text-red-400',
    bg: 'bg-red-950/30 border-red-900',
    label: 'Critical',
  },
  high: {
    icon: AlertTriangle,
    color: 'text-orange-400',
    bg: 'bg-orange-950/30 border-orange-900',
    label: 'High',
  },
  medium: {
    icon: AlertCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-950/30 border-amber-900',
    label: 'Medium',
  },
  low: {
    icon: Info,
    color: 'text-blue-400',
    bg: 'bg-blue-950/30 border-blue-900',
    label: 'Low',
  },
};

export default function IssueReport({ issues, summary }: IssueReportProps) {
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const highCount = issues.filter((i) => i.severity === 'high').length;
  const mediumCount = issues.filter((i) => i.severity === 'medium').length;
  const lowCount = issues.filter((i) => i.severity === 'low').length;

  return (
    <div className="space-y-4">
      {summary && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
          <p className="text-sm text-zinc-300">{summary}</p>
        </div>
      )}

      {/* Severity Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Critical', count: criticalCount, color: 'text-red-400' },
          { label: 'High', count: highCount, color: 'text-orange-400' },
          { label: 'Medium', count: mediumCount, color: 'text-amber-400' },
          { label: 'Low', count: lowCount, color: 'text-blue-400' },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center"
          >
            <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
            <p className="text-xs text-zinc-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-2">
        {issues.map((issue, i) => {
          const config = severityConfig[issue.severity];
          const Icon = config.icon;
          return (
            <div
              key={i}
              className={`border rounded-lg p-4 ${config.bg}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 ${config.color} shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      {issue.file}
                      {issue.line ? `:${issue.line}` : ''}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300">{issue.issue}</p>
                  <p className="text-xs text-zinc-500 mt-1">Fix: {issue.fixType}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
