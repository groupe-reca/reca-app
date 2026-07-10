-- employees (doc 04 "employees").
-- user_id (nullable) is a cahier-des-charges addition anticipating field
-- employees logging in (doc 06 "Application employé", module I, not yet built).
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete set null,
  prenom text not null,
  nom text not null,
  telephone text,
  courriel text,
  poste text,
  role text,
  date_embauche date,
  actif boolean not null default true,
  photo text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.employees enable row level security;

create trigger trg_employees_audit
  before insert or update on public.employees
  for each row execute function set_audit_columns();
