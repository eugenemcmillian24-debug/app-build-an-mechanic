-- Seed file for OPS AI DEV
-- Inserts default pricing rules

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
