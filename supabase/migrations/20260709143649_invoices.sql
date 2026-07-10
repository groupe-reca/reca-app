-- invoices / factures (doc 04 "invoices"). Statuts per doc 04 "États > Facture".
create sequence invoices_numero_seq;

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  client_id uuid not null references public.clients (id) on delete cascade,
  contrat_id uuid references public.contracts (id) on delete set null,
  date date not null default current_date,
  sous_total numeric(12, 2) not null default 0,
  tps numeric(12, 2) not null default 0,
  tvq numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  solde numeric(12, 2) not null default 0,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'envoyee', 'payee', 'partiellement_payee', 'en_retard', 'annulee')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.invoices enable row level security;

create or replace function set_numero_invoice()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    new.numero := 'FAC-' || lpad(nextval('invoices_numero_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create trigger trg_invoices_numero
  before insert on public.invoices
  for each row execute function set_numero_invoice();

create trigger trg_invoices_audit
  before insert or update on public.invoices
  for each row execute function set_audit_columns();
