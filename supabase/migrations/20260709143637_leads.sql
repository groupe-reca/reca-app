-- leads (doc 04 "leads"). Statuts per doc 04 "États > Lead".
-- rappel_le/rappel_note are a cahier-des-charges addition: the "Planifier un
-- rappel" action (doc 06, module A) has no dedicated table in doc 04, so a
-- lightweight reminder pair of columns is used instead of a new table.
create sequence leads_numero_seq;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  numero text unique,
  prenom text not null,
  nom text not null,
  telephone text,
  courriel text,
  adresse text,
  ville text,
  code_postal text,
  type_service text,
  message text,
  source text,
  statut text not null default 'nouveau'
    check (statut in ('nouveau', 'contacte', 'soumission_envoyee', 'converti', 'perdu')),
  assigne_a uuid references public.employees (id) on delete set null,
  rappel_le timestamptz,
  rappel_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.leads enable row level security;

create or replace function set_numero_lead()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    new.numero := 'LEAD-' || lpad(nextval('leads_numero_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

create trigger trg_leads_numero
  before insert on public.leads
  for each row execute function set_numero_lead();

create trigger trg_leads_audit
  before insert or update on public.leads
  for each row execute function set_audit_columns();
