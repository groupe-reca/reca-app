-- routes (module Routes v2) : gabarit PERMANENT de territoire — contrats assignés, ordre de
-- visite, opérateur, équipement. Jamais de date/heure/état d'exécution/durée : ce sont les
-- futurs Sorties/RECA Operator (hors-scope). Pas de `numero` (aucune maquette ne l'affiche,
-- contrairement à Contrats/Devis/Factures qui sont des documents légaux).
create table public.routes (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  couleur text not null check (couleur ~ '^#[0-9A-Fa-f]{6}$'),
  -- operator_id/equipment_id nullable en DB (on delete set null, pour ne jamais casser une
  -- route si un employé/équipement est supprimé ailleurs) même si le formulaire de création
  -- les exige tous les deux — divergence DB/UI volontaire.
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

-- Policy élargie deleted_at is null OR admin (pas juste deleted_at is null) : un admin qui
-- soft-delete une route doit rester capable de "voir" la ligne qu'il vient de modifier,
-- sinon PostgREST rejette l'UPDATE lui-même (RLS bloque la ligne résultante) — même piège déjà
-- rencontré et corrigé sur contract_notes/intervention_notes, voir memory/memory.md.
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

-- route_contracts : association route <-> contrat, avec ordre de visite. Remplace
-- route_clients (grain client) — le grain pertinent est le CONTRAT (statut Actif/Suspendu,
-- saison, etc. vivent sur le contrat, pas sur le client). Soft-delete uniquement (aucune policy
-- DELETE ci-dessous) : "Retirer" = deleted_at renseigné, jamais une vraie suppression de ligne
-- — permet de réassigner/transférer un contrat sans jamais perdre l'historique brut.
create table public.route_contracts (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes (id) on delete cascade,
  contract_id uuid not null references public.contracts (id) on delete cascade,
  ordre integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

-- Un contrat n'est jamais assigné à plus d'une route active à la fois (règle métier "Contrats
-- non-routés" de l'onglet Contrats). L'index partiel exclut les lignes retirées (deleted_at
-- non nul), ce qui permet de réinsérer librement une nouvelle ligne active pour un contrat déjà
-- retiré par le passé, sans jamais violer cette contrainte.
create unique index route_contracts_contract_active_key
  on public.route_contracts (contract_id)
  where deleted_at is null;

create index idx_route_contracts_route_active
  on public.route_contracts (route_id, ordre)
  where deleted_at is null;

alter table public.route_contracts enable row level security;

create trigger trg_route_contracts_audit
  before insert or update on public.route_contracts
  for each row execute function set_audit_columns();

-- Même correctif que routes_select_authenticated ci-dessus (nécessaire pour que "Retirer"/
-- "Supprimer la Route" puissent soft-delete ces lignes sans être bloqués par leur propre
-- policy SELECT une fois deleted_at renseigné).
create policy route_contracts_select_authenticated on public.route_contracts
  for select to authenticated
  using (deleted_at is null or public.current_user_role() = 'administrateur');

create policy route_contracts_insert_admin on public.route_contracts
  for insert to authenticated
  with check (public.current_user_role() = 'administrateur');

create policy route_contracts_update_admin on public.route_contracts
  for update to authenticated
  using (public.current_user_role() = 'administrateur')
  with check (public.current_user_role() = 'administrateur');
