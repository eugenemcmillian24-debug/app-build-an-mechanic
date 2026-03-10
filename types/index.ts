export type AgentMode = 'guide' | 'autopilot' | 'diagnose' | 'repair' | 'createLab' | 'runExperiment' | 'deployModel';

export interface CreditWallet {
  id: string;
  user_id: string;
  balance: number;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_id?: string;
  created_at: string;
}

export interface PricingRule {
  action_type: AgentMode | string;
  base_cost_credits: number;
}

export interface Project {
  id: string;
  title: string;
  status: string;
  modelFamily?: string;
  domain?: string;
  createdBy: string;
  createdAt: string;
}

export interface Experiment {
  id: string;
  projectId: string;
  config: any;
  metrics: any;
  checkpointUri?: string;
  createdAt: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  env: 'dev' | 'staging' | 'prod';
  endpointUrl: string;
  version: string;
  safetyReportId?: string;
}
