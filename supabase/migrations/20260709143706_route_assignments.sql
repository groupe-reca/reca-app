-- route_assignments: route -> employee -> equipment -> date -> statut (doc 04
-- "route_assignments"). Statut values are a cahier-des-charges addition: the
-- doc names the "Statut" field but doesn't enumerate its values, so a set
-- mirroring routes' own status naming is used until the Routes module refines it.
create table public.route_assignments (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes (id) on delete cascade,
  employee_id uuid not null references public.employees (id) on delete cascade,
  equipment_id uuid references public.equipments (id) on delete set null,
  date date not null default current_date,
  statut text not null default 'planifiee'
    check (statut in ('planifiee', 'en_cours', 'terminee', 'annulee')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.route_assignments enable row level security;

create trigger trg_route_assignments_audit
  before insert or update on public.route_assignments
  for each row execute function set_audit_columns();
