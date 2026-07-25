-- Correctif : les migrations de 20260722 ont été appliquées dans le désordre en production
-- (20260722010000_drop_routes_v1.sql rejouée APRÈS que routes_v2/missions aient déjà créé
-- leurs tables), ce qui a fait tomber `public.routes` (DROP ... CASCADE) sans toucher
-- `route_contracts`/`missions` — ces deux tables ont donc perdu leur FK vers `routes`
-- (cascade-drop de la contrainte, pas de la table) et contenaient des lignes orphelines
-- (données de test uniquement, confirmé avec l'utilisateur avant suppression).
--
-- Ce script : (1) vide les données orphelines, (2) recrée `routes` à l'identique de
-- 20260722020000_routes_v2.sql (RLS incluse, avec le correctif SELECT admin déjà en place),
-- (3) rebranche les 2 FK manquantes.

delete from public.missions;   -- cascade vers mission_items/mission_events/mission_notes
delete from public.route_contracts;

create table public.routes (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  couleur text not null check (couleur ~ '^#[0-9A-Fa-f]{6}$'),
  operator_id uuid references public.employees (id) on delete set null,
  equipment_id uuid references public.equipments (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_routes_operator on public.routes (operator_id);
create index idx_routes_equipment on public.routes (equipment_id);

alter table public.routes enable row level security;

create trigger trg_routes_audit
  before insert or update on public.routes
  for each row execute function set_audit_columns();

create policy routes_select_authenticated on public.routes
  for select to authenticated
  using (deleted_at is null or public.current_user_role() = 'administrateur');

create policy routes_insert_admin on public.routes
  for insert to authenticated
  with check (public.current_user_role() = 'administrateur');

create policy routes_update_admin on public.routes
  for update to authenticated
  using (public.current_user_role() = 'administrateur')
  with check (public.current_user_role() = 'administrateur');

alter table public.route_contracts
  add constraint route_contracts_route_id_fkey
  foreign key (route_id) references public.routes (id) on delete cascade;

alter table public.missions
  add constraint missions_route_id_fkey
  foreign key (route_id) references public.routes (id) on delete restrict;
