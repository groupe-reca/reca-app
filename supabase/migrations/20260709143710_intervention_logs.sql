-- intervention_logs: history of operations (doc 04 "intervention_logs").
-- employee_id is kept alongside route_assignments.employee_id since a helper
-- other than the assignment's primary employee may log the intervention.
create table public.intervention_logs (
  id uuid primary key default gen_random_uuid(),
  route_assignment_id uuid not null references public.route_assignments (id) on delete cascade,
  employee_id uuid references public.employees (id) on delete set null,
  debut timestamptz,
  fin timestamptz,
  duree interval generated always as (fin - debut) stored,
  commentaire text,
  photos text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.intervention_logs enable row level security;

create trigger trg_intervention_logs_audit
  before insert or update on public.intervention_logs
  for each row execute function set_audit_columns();
