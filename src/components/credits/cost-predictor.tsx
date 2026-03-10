'use client';

import { Zap, AlertTriangle } from 'lucide-react';
import { useCreditsStore } from '@/lib/store/credits-store';
import { CREDIT_COSTS, type CreditActionType } from '@/types';

interface CostPredictorProps {
  actionType: CreditActionType;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CostPredictor({
  actionType,
  onConfirm,
  onCancel,
  loading = false,
}: CostPredictorProps) {
  const { balance } = useCreditsStore();
  const cost = CREDIT_COSTS[actionType] ?? 1;
  const sufficient = balance >= cost;
  const remaining = balance - cost;

  const actionLabels: Record<string, string> = {
    ai_message: 'AI Message',
    ai_build: 'AI Build',
    deploy_vercel: 'Deploy to Vercel',
    deploy_netlify: 'Deploy to Netlify',
    ai_lab_create: 'Create AI Lab',
    ai_lab_experiment: 'Run Experiment',
    ai_lab_deploy: 'Deploy Model',
    instruction_guide: 'Guide Mode',
    instruction_autopilot: 'Autopilot Mode',
    mechanic_diagnose: 'Diagnose',
    mechanic_repair: 'Repair',
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5">
      <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
        Cost Prediction
      </h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">Action</span>
          <span className="text-sm font-medium text-white">
            {actionLabels[actionType] || actionType}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-300">Cost</span>
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">{cost}</span>
            <span className="text-xs text-zinc-500">credits</span>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">Current Balance</span>
            <span className="text-sm font-medium text-white">
              {balance.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-zinc-300">After Action</span>
            <span
              className={`text-sm font-medium ${
                sufficient ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {sufficient ? remaining.toLocaleString() : 'Insufficient'}
            </span>
          </div>
        </div>

        {!sufficient && (
          <div className="flex items-start gap-2 bg-red-950/50 border border-red-900 rounded-lg p-3">
            <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-red-400 font-medium">
                Insufficient credits
              </p>
              <p className="text-xs text-red-400/70 mt-0.5">
                You need {cost - balance} more credits. Purchase a credit pack to continue.
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!sufficient || loading}
            className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                Confirm ({cost} cr)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
