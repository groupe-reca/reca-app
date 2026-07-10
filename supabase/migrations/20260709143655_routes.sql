-- routes (doc 04 "routes"). Statuts per doc 04 "États > Route".
create sequence routes_numero_seq;

create table public.routes (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  nom text not null,
  secteur text,
  description text,
  statut text not null default 'planifiee'
    check (statut in ('planifiee', 'en_cours', 'terminee', 'suspendue')),
  duree_estimee interval,
  distance numeric(8, 2),
  couleur text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.routes enable row level security;

create or replace function set_numero_route()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    new.numero := 'RTE-' || lpad(nextval('routes_numero_seq')::text, 3, '0');
  end if;
  return new;
end;
$$;

create trigger trg_routes_numero
  before insert on public.routes
  for each row execute function set_numero_route();

create trigger trg_routes_audit
  before insert or update on public.routes
  for each row execute function set_audit_columns();
