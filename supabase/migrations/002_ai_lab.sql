-- AI Lab Tables
-- Google DeepMind-style R&D operations

-- Lab Units
create table if not exists lab_units (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null check (type in ('research', 'tools', 'product', 'science', 'safety', 'infra')),
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Projects
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  lab_unit_id uuid references lab_units(id) on delete cascade,
  title text not null,
  status text default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  model_family text,
  domain text,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Artifacts
create table if not exists artifacts (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade,
  kind text not null check (kind in ('model', 'dataset', 'pipeline', 'tool', 'paper', 'report')),
  uri text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Experiments
create table if not exists experiments (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade,
  config jsonb default '{}',
  metrics jsonb default '{}',
  checkpoint_uri text,
  status text default 'running' check (status in ('running', 'completed', 'failed')),
  created_at timestamptz default now()
);

-- Deployments
create table if not exists deployments (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade,
  env text default 'dev' check (env in ('dev', 'staging', 'prod')),
  endpoint_url text,
  version text,
  safety_report_id uuid,
  status text default 'deploying' check (status in ('deploying', 'active', 'failed', 'rolled_back')),
  created_at timestamptz default now()
);

-- Safety Reports
create table if not exists safety_reports (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade,
  eval_results jsonb default '{}',
  redteam_notes text,
  policy_tags text[] default '{}',
  passed boolean default false,
  created_at timestamptz default now()
);

-- Add foreign key for safety_report_id
alter table deployments
  add constraint fk_safety_report
  foreign key (safety_report_id) references safety_reports(id);

-- RLS
alter table lab_units enable row level security;
alter table projects enable row level security;
alter table artifacts enable row level security;
alter table experiments enable row level security;
alter table deployments enable row level security;
alter table safety_reports enable row level security;

-- Policies (users can manage their own data)
create policy "Users manage own lab_units" on lab_units for all using (auth.uid() = created_by);
create policy "Users manage own projects" on projects for all using (auth.uid() = created_by);
create policy "Users view own artifacts" on artifacts for select using (
  project_id in (select id from projects where created_by = auth.uid())
);
create policy "Users insert own artifacts" on artifacts for insert with check (
  project_id in (select id from projects where created_by = auth.uid())
);
create policy "Users view own experiments" on experiments for select using (
  project_id in (select id from projects where created_by = auth.uid())
);
create policy "Users insert own experiments" on experiments for insert with check (
  project_id in (select id from projects where created_by = auth.uid())
);
create policy "Users view own deployments" on deployments for select using (
  project_id in (select id from projects where created_by = auth.uid())
);
create policy "Users insert own deployments" on deployments for insert with check (
  project_id in (select id from projects where created_by = auth.uid())
);
create policy "Users view own safety_reports" on safety_reports for select using (
  project_id in (select id from projects where created_by = auth.uid())
);
create policy "Users insert own safety_reports" on safety_reports for insert with check (
  project_id in (select id from projects where created_by = auth.uid())
);

-- Indexes
create index if not exists idx_projects_lab_unit on projects(lab_unit_id);
create index if not exists idx_projects_created_by on projects(created_by);
create index if not exists idx_experiments_project on experiments(project_id);
create index if not exists idx_deployments_project on deployments(project_id);
