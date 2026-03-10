'use client';

import { FileCode } from 'lucide-react';

interface DiffItem {
  path: string;
  oldCode: string;
  newCode: string;
  reason: string;
}

interface DiffViewerProps {
  diffs: DiffItem[];
}

export default function DiffViewer({ diffs }: DiffViewerProps) {
  if (!diffs || diffs.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 text-center">
        <p className="text-zinc-500 text-sm">No changes to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {diffs.map((diff, i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
            <FileCode className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-mono text-zinc-300">{diff.path}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800">
            {/* Old Code */}
            <div>
              <div className="px-4 py-2 bg-red-950/30 border-b border-zinc-800">
                <span className="text-xs font-semibold text-red-400 uppercase">
                  Before
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-red-300/80 overflow-x-auto max-h-64">
                <code>{diff.oldCode}</code>
              </pre>
            </div>

            {/* New Code */}
            <div>
              <div className="px-4 py-2 bg-emerald-950/30 border-b border-zinc-800">
                <span className="text-xs font-semibold text-emerald-400 uppercase">
                  After
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-300/80 overflow-x-auto max-h-64">
                <code>{diff.newCode}</code>
              </pre>
            </div>
          </div>

          {diff.reason && (
            <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-900/50">
              <p className="text-xs text-zinc-400">
                <span className="font-semibold text-zinc-300">Reason:</span>{' '}
                {diff.reason}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
