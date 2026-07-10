-- employee_equipment: which employee uses which equipment (doc 04 "employee_equipment").
create table public.employee_equipment (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  equipment_id uuid not null references public.equipments (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  unique (employee_id, equipment_id)
);

alter table public.employee_equipment enable row level security;

create trigger trg_employee_equipment_audit
  before insert or update on public.employee_equipment
  for each row execute function set_audit_columns();
