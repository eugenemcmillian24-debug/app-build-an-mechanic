-- Initial Schema for OPS AI DEV

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Credit wallets table
create table if not exists credit_wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  balance numeric(10,4) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Credit transactions table
create table if not exists credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  amount numeric(10,4) not null,
  reason text not null,
  reference_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pricing rules table
create table if not exists pricing_rules (
  id uuid default uuid_generate_v4() primary key,
  action_type text unique not null,
  base_cost_credits numeric(8,4) default 1.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AI Lab projects
create table if not exists ai_lab_projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  lab_unit_id text not null, -- "research"|"tools"|"product"|"science"|"safety"|"infra"
  title text not null,
  status text not null,
  model_family text,
  domain text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Experiments
create table if not exists experiments (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references ai_lab_projects(id) not null,
  config jsonb not null,
  metrics jsonb not null,
  checkpoint_uri text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Deployments
create table if not exists deployments (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references ai_lab_projects(id) not null,
  env text not null, -- "dev"|"staging"|"prod"
  endpoint_url text not null,
  version text not null,
  safety_report_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safety Reports
create table if not exists safety_reports (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references ai_lab_projects(id) not null,
  eval_results jsonb not null,
  redteam_notes text,
  policy_tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies

-- For credit_wallets: Users can only see their own wallet
alter table credit_wallets enable row level security;
create policy "Users can see their own wallet" on credit_wallets
  for select using (auth.uid() = user_id);

-- For credit_transactions: Users can only see their own transactions
alter table credit_transactions enable row level security;
create policy "Users can see their own transactions" on credit_transactions
  for select using (auth.uid() = user_id);

-- For pricing_rules: All users can see pricing rules
alter table pricing_rules enable row level security;
create policy "All users can see pricing rules" on pricing_rules
  for select using (true);

-- For ai_lab_projects: Users can only see their own projects
alter table ai_lab_projects enable row level security;
create policy "Users can see their own projects" on ai_lab_projects
  for select using (auth.uid() = user_id);
create policy "Users can create their own projects" on ai_lab_projects
  for insert with check (auth.uid() = user_id);

-- Insert initial pricing rules
insert into pricing_rules (action_type, base_cost_credits) values
('ai_message', 1),
('ai_build', 20),
('deploy_vercel', 40),
('deploy_netlify', 40),
('instructionAgent_guide', 100),
('instructionAgent_autopilot', 800),
('mechanicAgent_diagnose', 200),
('mechanicAgent_repair', 1200),
('aiLab_createLab', 500),
('aiLab_runExperiment', 300),
('aiLab_deployModel', 800)
on conflict (action_type) do update set base_cost_credits = excluded.base_cost_credits;
