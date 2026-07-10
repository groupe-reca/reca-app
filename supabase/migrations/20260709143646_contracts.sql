-- contracts (doc 04 "contracts"). Statuts per doc 04 "États > Contrat".
create sequence contracts_numero_seq;

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  client_id uuid not null references public.clients (id) on delete cascade,
  type text,
  saison text,
  prix numeric(12, 2),
  statut text not null default 'en_attente'
    check (statut in ('actif', 'en_attente', 'expire', 'annule')),
  date_signature date,
  date_debut date,
  date_fin date,
  renouvellement boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.contracts enable row level security;

create or replace function set_numero_contract()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    new.numero := 'CTR-' || lpad(nextval('contracts_numero_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create trigger trg_contracts_numero
  before insert on public.contracts
  for each row execute function set_numero_contract();

create trigger trg_contracts_audit
  before insert or update on public.contracts
  for each row execute function set_audit_columns();
