-- Credit System Tables
-- Purpose: Credit-based billing. $0.05/credit. No free tier.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Credit Wallets
create table if not exists credit_wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  balance numeric(10,4) default 0 not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- Credit Transactions (audit trail)
create table if not exists credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  amount numeric(10,4) not null,
  reason text not null,
  reference_id uuid,
  created_at timestamptz default now()
);

-- Pricing Rules
create table if not exists pricing_rules (
  id uuid default uuid_generate_v4() primary key,
  action_type text unique not null,
  base_cost_credits numeric(8,4) default 1.0 not null,
  description text,
  created_at timestamptz default now()
);

-- Default pricing rules
insert into pricing_rules (action_type, base_cost_credits, description) values
  ('ai_message', 1, 'Single AI message'),
  ('ai_build', 20, 'AI-powered build operation'),
  ('deploy_vercel', 40, 'Deploy to Vercel'),
  ('deploy_netlify', 40, 'Deploy to Netlify'),
  ('ai_lab_create', 500, 'Create AI Lab'),
  ('ai_lab_experiment', 300, 'Run AI Lab Experiment'),
  ('ai_lab_deploy', 800, 'Deploy from AI Lab'),
  ('instruction_guide', 100, 'Instruction Agent - Guide Mode'),
  ('instruction_autopilot', 800, 'Instruction Agent - Autopilot Mode'),
  ('mechanic_diagnose', 200, 'Mechanic Agent - Diagnose'),
  ('mechanic_repair', 1200, 'Mechanic Agent - Repair')
on conflict (action_type) do nothing;

-- RLS Policies
alter table credit_wallets enable row level security;
alter table credit_transactions enable row level security;

-- Users can only see their own wallet
create policy "Users can view own wallet" on credit_wallets
  for select using (auth.uid() = user_id);

create policy "Users can update own wallet" on credit_wallets
  for update using (auth.uid() = user_id);

create policy "Users can insert own wallet" on credit_wallets
  for insert with check (auth.uid() = user_id);

-- Users can only see their own transactions
create policy "Users can view own transactions" on credit_transactions
  for select using (auth.uid() = user_id);

create policy "Users can insert own transactions" on credit_transactions
  for insert with check (auth.uid() = user_id);

-- Indexes
create index if not exists idx_credit_wallets_user_id on credit_wallets(user_id);
create index if not exists idx_credit_transactions_user_id on credit_transactions(user_id);
create index if not exists idx_credit_transactions_created_at on credit_transactions(created_at);
