-- settings: singleton configuration row (doc 04 "settings"). The
-- `id boolean primary key default true` + check constraint is a standard
-- Postgres trick to enforce exactly one row.
create table public.settings (
  id boolean primary key default true,
  nom text,
  logo text,
  telephone text,
  courriel text,
  taxes jsonb not null default '{}'::jsonb,
  adresse text,
  couleurs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  constraint settings_singleton check (id)
);

alter table public.settings enable row level security;

create trigger trg_settings_audit
  before insert or update on public.settings
  for each row execute function set_audit_columns();

insert into public.settings (id) values (true);
