-- clients (doc 04 "clients"). "coordonnées GPS" is stored as latitude/longitude.
create sequence clients_numero_seq;

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  prenom text,
  nom text,
  entreprise text,
  telephone text,
  courriel text,
  adresse text,
  ville text,
  code_postal text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  type_client text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.clients enable row level security;

create or replace function set_numero_client()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    new.numero := 'CLI-' || lpad(nextval('clients_numero_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create trigger trg_clients_numero
  before insert on public.clients
  for each row execute function set_numero_client();

create trigger trg_clients_audit
  before insert or update on public.clients
  for each row execute function set_audit_columns();
