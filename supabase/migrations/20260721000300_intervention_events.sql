-- intervention_events : journal d'événements réel de l'intervention ("Historique" :
-- Créée/Début/Pause/Reprise/Terminée/Fermée). pause/reprise sont des valeurs d'enum
-- réservées pour la future app terrain RECA Operator — aucun déclencheur/bouton ne les
-- écrit ce sprint. FK vers users déclarée dès cette migration (contrairement à
-- contract_notes, où l'oubli initial avait causé un PGRST200 — voir
-- 20260718040000_contract_notes_author_fk.sql).
create table public.intervention_events (
  id uuid primary key default gen_random_uuid(),
  intervention_id uuid not null references public.interventions (id) on delete cascade,
  type text not null check (type in ('creee', 'debut', 'pause', 'reprise', 'terminee', 'fermee')),
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users (id),
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_intervention_events_intervention on public.intervention_events (intervention_id, created_at desc);

alter table public.intervention_events enable row level security;

create trigger trg_intervention_events_audit
  before insert or update on public.intervention_events
  for each row execute function set_audit_columns();

create policy intervention_events_select_authenticated
  on public.intervention_events for select to authenticated
  using (deleted_at is null);

create policy intervention_events_insert_authenticated
  on public.intervention_events for insert to authenticated
  with check (created_by = auth.uid());

-- Pas de policy update/delete : journal immuable, une ligne est écrite une seule fois.
