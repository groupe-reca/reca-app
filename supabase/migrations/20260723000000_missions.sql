-- Module Missions : une Mission représente une sortie réelle de déneigement,
-- créée à partir d'une Route (territoire permanent, module-routes-v2) sans
-- jamais la modifier. MissionItems = grain du travail réel (1 ligne par
-- contrat copié depuis route_contracts au moment de la création). Conventions
-- identiques à 20260722020000_routes_v2.sql (trigger set_audit_columns, RLS
-- via current_user_role(), soft-delete uniquement) et à contract_events.sql /
-- client_notes.sql pour les tables journal/notes.

create sequence missions_numero_seq;

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  numero integer unique,
  route_id uuid not null references public.routes (id) on delete restrict,
  date date not null,
  heure_prevue time not null,
  heure_debut timestamptz,
  heure_fin timestamptz,
  operator_id uuid references public.employees (id) on delete set null,
  equipment_id uuid references public.equipments (id) on delete set null,
  notes text,
  statut text not null default 'planifiee'
    check (statut in ('planifiee', 'en_cours', 'terminee', 'terminee_avec_anomalies', 'annulee')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users (id),
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_missions_route on public.missions (route_id);
create index idx_missions_operator on public.missions (operator_id);
create index idx_missions_equipment on public.missions (equipment_id);
create index idx_missions_date on public.missions (date);

alter table public.missions enable row level security;

-- Numéro affiché "Mission #128" (brief) : simple entier séquentiel, pas un code préfixé
-- comme "CTR-000001" (contrats) -- le "#" du libellé est ajouté côté affichage.
create or replace function set_numero_mission()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    new.numero := nextval('missions_numero_seq');
  end if;
  return new;
end;
$$;

create trigger trg_missions_numero
  before insert on public.missions
  for each row execute function set_numero_mission();

create trigger trg_missions_audit
  before insert or update on public.missions
  for each row execute function set_audit_columns();

create policy missions_select_authenticated on public.missions
  for select to authenticated
  using (deleted_at is null or public.current_user_role() = 'administrateur');

create policy missions_insert_admin on public.missions
  for insert to authenticated
  with check (public.current_user_role() = 'administrateur');

create policy missions_update_admin on public.missions
  for update to authenticated
  using (public.current_user_role() = 'administrateur')
  with check (public.current_user_role() = 'administrateur');

-- mission_items : jonction Mission<->Contrat, copiée depuis route_contracts à
-- la création (contrats "actif" seulement). Pas d'unicité sur contract_id
-- (contrairement à route_contracts) : une Mission est un événement transitoire,
-- un même contrat peut légitimement réapparaître dans une nouvelle Mission le
-- même jour (ex. donné dans le brief). Pas de colonne "ordre" : aucun
-- réordonnancement demandé pour les MissionItems.
create table public.mission_items (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions (id) on delete cascade,
  contract_id uuid not null references public.contracts (id) on delete cascade,
  statut text not null default 'en_attente'
    check (statut in ('en_attente', 'en_cours', 'terminee', 'a_reprendre', 'impossible')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users (id),
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_mission_items_mission on public.mission_items (mission_id) where deleted_at is null;
create index idx_mission_items_contract on public.mission_items (contract_id);

alter table public.mission_items enable row level security;

create trigger trg_mission_items_audit
  before insert or update on public.mission_items
  for each row execute function set_audit_columns();

create policy mission_items_select_authenticated on public.mission_items
  for select to authenticated
  using (deleted_at is null or public.current_user_role() = 'administrateur');

create policy mission_items_insert_admin on public.mission_items
  for insert to authenticated
  with check (public.current_user_role() = 'administrateur');

create policy mission_items_update_admin on public.mission_items
  for update to authenticated
  using (public.current_user_role() = 'administrateur')
  with check (public.current_user_role() = 'administrateur');

-- mission_events : journal immuable (mirror exact de contract_events).
create table public.mission_events (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions (id) on delete cascade,
  type text not null check (type in (
    'mission_creee', 'mission_debutee', 'mission_pausee', 'mission_reprise',
    'mission_terminee', 'mission_terminee_avec_anomalies', 'mission_fermee_de_force', 'mission_annulee'
  )),
  payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users (id),
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_mission_events_mission on public.mission_events (mission_id, created_at desc);

alter table public.mission_events enable row level security;

create trigger trg_mission_events_audit
  before insert or update on public.mission_events
  for each row execute function set_audit_columns();

create policy mission_events_select_authenticated on public.mission_events
  for select to authenticated
  using (deleted_at is null);

create policy mission_events_insert_authenticated on public.mission_events
  for insert to authenticated
  with check (created_by = auth.uid());

-- Pas de policy update/delete : journal immuable (mirror exact de contract_events).

-- mission_notes : fil de notes multi-auteurs (mirror exact de client_notes,
-- CRUD complet -- pas la variante Contrats "ajout seul").
create table public.mission_notes (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions (id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users (id),
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_mission_notes_mission on public.mission_notes (mission_id);

alter table public.mission_notes enable row level security;

create trigger trg_mission_notes_audit
  before insert or update on public.mission_notes
  for each row execute function set_audit_columns();

create policy mission_notes_select_authenticated on public.mission_notes
  for select to authenticated
  using (deleted_at is null);

create policy mission_notes_insert_authenticated on public.mission_notes
  for insert to authenticated
  with check (created_by = auth.uid());

create policy mission_notes_update_author_or_admin on public.mission_notes
  for update to authenticated
  using (created_by = auth.uid() or public.current_user_role() = 'administrateur')
  with check (created_by = auth.uid() or public.current_user_role() = 'administrateur');

-- Pas de policy delete : soft-delete uniquement (deleted_at), convention du projet.
