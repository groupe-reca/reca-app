-- tâche 9 : "Notes au dossier" — fil de notes libres par contrat, écrit par
-- n'importe quel employé authentifié (pas seulement administrateur), contrairement
-- au reste du module Contrats. Auteur = created_by (colonne d'audit standard,
-- posée par set_audit_columns()), pas de colonne auteur_id dédiée.
create table public.contract_notes (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_contract_notes_contract on public.contract_notes (contract_id);

alter table public.contract_notes enable row level security;

create trigger trg_contract_notes_audit
  before insert or update on public.contract_notes
  for each row execute function set_audit_columns();

create policy contract_notes_select_authenticated
  on public.contract_notes for select to authenticated
  using (deleted_at is null);

create policy contract_notes_insert_authenticated
  on public.contract_notes for insert to authenticated
  with check (created_by = auth.uid());

create policy contract_notes_update_author_or_admin
  on public.contract_notes for update to authenticated
  using (created_by = auth.uid() or public.current_user_role() = 'administrateur')
  with check (created_by = auth.uid() or public.current_user_role() = 'administrateur');

-- Pas de policy delete : soft-delete uniquement (deleted_at), convention du projet.
