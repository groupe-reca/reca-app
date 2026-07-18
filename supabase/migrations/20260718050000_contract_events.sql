-- Modernisation fiche contrat v2 : "Historique du contrat" — vrai journal
-- d'événements léger, pas une maquette statique. Chaque ligne correspond à une
-- action réelle (création, changement de statut, clic "Envoyer par
-- courriel"/"Télécharger PDF", changement de date de signature) — jamais de
-- donnée fabriquée. FK vers users déclarée dès cette migration (contrairement
-- à contract_notes, où l'oubli initial avait causé un PGRST200 — voir
-- 20260718040000_contract_notes_author_fk.sql).
create table public.contract_events (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  type text not null check (type in ('contrat_cree', 'contrat_signe', 'statut_modifie', 'pdf_genere', 'courriel_envoye')),
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users (id),
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_contract_events_contract on public.contract_events (contract_id, created_at desc);

alter table public.contract_events enable row level security;

create trigger trg_contract_events_audit
  before insert or update on public.contract_events
  for each row execute function set_audit_columns();

create policy contract_events_select_authenticated
  on public.contract_events for select to authenticated
  using (deleted_at is null);

create policy contract_events_insert_authenticated
  on public.contract_events for insert to authenticated
  with check (created_by = auth.uid());

-- Pas de policy update/delete : journal immuable, une ligne est écrite une seule fois.
