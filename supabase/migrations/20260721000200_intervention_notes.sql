-- intervention_notes : notes libres au dossier d'une intervention, même convention que
-- client_notes/contract_notes (tâche 9). FK vers users déclarée dès cette création
-- (nécessaire pour l'embed PostgREST author:users(id, nom) — voir
-- 20260718040000_contract_notes_author_fk.sql, jamais reproduire l'oubli initial).
create table public.intervention_notes (
  id uuid primary key default gen_random_uuid(),
  intervention_id uuid not null references public.interventions (id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users (id),
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_intervention_notes_intervention on public.intervention_notes (intervention_id);

alter table public.intervention_notes enable row level security;

create trigger trg_intervention_notes_audit
  before insert or update on public.intervention_notes
  for each row execute function set_audit_columns();

-- Policy SELECT élargie dès le départ (deleted_at is null OR auteur OR admin) — une policy
-- stricte bloquerait le soft-delete lui-même — voir 20260719030000_notes_select_policy_fix.sql,
-- corrigé une fois pour toutes ici dès la création.
create policy intervention_notes_select_authenticated
  on public.intervention_notes for select to authenticated
  using (deleted_at is null or created_by = auth.uid() or public.current_user_role() = 'administrateur');

create policy intervention_notes_insert_authenticated
  on public.intervention_notes for insert to authenticated
  with check (created_by = auth.uid());

create policy intervention_notes_update_author_or_admin
  on public.intervention_notes for update to authenticated
  using (created_by = auth.uid() or public.current_user_role() = 'administrateur')
  with check (created_by = auth.uid() or public.current_user_role() = 'administrateur');

-- Pas de policy delete : soft-delete uniquement (deleted_at), convention du projet.
