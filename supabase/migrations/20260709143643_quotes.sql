-- quotes / soumissions (doc 04 "quotes"). Statuts per doc 04 "États > Soumission".
-- lead_id and client_id are both nullable: a quote is normally created from a
-- lead (client_id filled in once it converts) but may later be created
-- directly for an existing client (repeat customer, no lead involved).
create sequence quotes_numero_seq;

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  lead_id uuid references public.leads (id) on delete set null,
  client_id uuid references public.clients (id) on delete set null,
  montant numeric(12, 2) not null default 0,
  taxes numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  statut text not null default 'brouillon'
    check (statut in ('brouillon', 'envoyee', 'acceptee', 'refusee', 'expiree')),
  expiration date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.quotes enable row level security;

create or replace function set_numero_quote()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    new.numero := 'SOUM-' || lpad(nextval('quotes_numero_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create trigger trg_quotes_numero
  before insert on public.quotes
  for each row execute function set_numero_quote();

create trigger trg_quotes_audit
  before insert or update on public.quotes
  for each row execute function set_audit_columns();
