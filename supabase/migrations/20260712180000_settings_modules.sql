-- Adds a per-module enable/disable toggle to the settings singleton, so an
-- administrateur can turn modules off from the Paramètres UI (hides the
-- sidebar link and blocks direct route access via RequireModule).
alter table public.settings add column modules jsonb not null default '{}'::jsonb;

update public.settings
set modules = '{"routes": false, "equipment": false, "invoices": false, "employees": false}'::jsonb
where id = true;
