-- Fiche client : "Notes du client" — fil de notes libres par client, écrit par
-- n'importe quel utilisateur authentifié (pas seulement administrateur), même
-- convention que contract_notes (tâche 9). Auteur = created_by (colonne
-- d'audit standard), avec la FK vers users posée dès la création cette fois
-- (contract_notes avait dû la rajouter en correctif séparé après coup).
create table public.client_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users (id),
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_client_notes_client on public.client_notes (client_id);

alter table public.client_notes enable row level security;

create trigger trg_client_notes_audit
  before insert or update on public.client_notes
  for each row execute function set_audit_columns();

create policy client_notes_select_authenticated
  on public.client_notes for select to authenticated
  using (deleted_at is null);

create policy client_notes_insert_authenticated
  on public.client_notes for insert to authenticated
  with check (created_by = auth.uid());

create policy client_notes_update_author_or_admin
  on public.client_notes for update to authenticated
  using (created_by = auth.uid() or public.current_user_role() = 'administrateur')
  with check (created_by = auth.uid() or public.current_user_role() = 'administrateur');

-- Pas de policy delete : soft-delete uniquement (deleted_at), convention du projet.
