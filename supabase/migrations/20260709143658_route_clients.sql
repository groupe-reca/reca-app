-- route_clients: association table, a route has many clients in a given order
-- (doc 04 "route_clients").
create table public.route_clients (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  ordre integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz,
  unique (route_id, client_id)
);

alter table public.route_clients enable row level security;

create trigger trg_route_clients_audit
  before insert or update on public.route_clients
  for each row execute function set_audit_columns();
