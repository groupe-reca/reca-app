-- Sprint 007 : Assistant de création de contrat (Wizard) — analyse cartographique
-- de la propriété (Mapbox GL JS + Draw + Turf.js), services structurés, obligations
-- en questions/réponses (clauses générées automatiquement) et mode de paiement.
-- Migration purement additive : aucune colonne existante n'est renommée/supprimée,
-- des contrats réels existent déjà en production.

-- 1. Zones tracées sur la carte satellite (une ligne par polygone).
create table public.contract_zones (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  label text not null,
  geojson jsonb not null,
  surface_m2 numeric(10, 2) not null,
  image_storage_path text not null,
  ordre int not null default 0,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

alter table public.contract_zones
  add constraint contract_zones_geojson_is_object check (jsonb_typeof(geojson) = 'object');

create index idx_contract_zones_contract on public.contract_zones (contract_id);

alter table public.contract_zones enable row level security;

create trigger trg_contract_zones_audit
  before insert or update on public.contract_zones
  for each row execute function set_audit_columns();

create policy contract_zones_select_authenticated
  on public.contract_zones for select to authenticated
  using (deleted_at is null);

create policy contract_zones_insert_admin
  on public.contract_zones for insert to authenticated
  with check (public.current_user_role() = 'administrateur');

create policy contract_zones_update_admin
  on public.contract_zones for update to authenticated
  using (public.current_user_role() = 'administrateur')
  with check (public.current_user_role() = 'administrateur');

-- 2. Nouvelles colonnes sur contracts. `superficie` (existante) est réutilisée :
-- le Wizard y écrit désormais la somme des surfaces des zones tracées (calculée
-- par Turf.js à partir des coordonnées GPS), au lieu d'une estimation manuelle.
alter table public.contracts
  add column adresse_geocodee text,
  add column latitude numeric(9, 6),
  add column longitude numeric(9, 6),
  add column mode_paiement text,
  add column services jsonb not null default '[]'::jsonb,
  add column obligations_reponses jsonb not null default '{}'::jsonb,
  add column accumulation_maximale_cm numeric(5, 2);

alter table public.contracts
  add constraint contracts_services_is_array check (jsonb_typeof(services) = 'array');

-- 3. Backfill des coordonnées client (colonnes déjà présentes, toujours nulles
-- jusqu'ici faute de géocodage implémenté) quand le Wizard géocode l'adresse.
-- Rien à faire ici — écriture applicative, pas de migration de données requise.

-- 4. Bucket Storage privé pour les captures satellite + URLs signées à l'usage.
insert into storage.buckets (id, name, public)
values ('contract-captures', 'contract-captures', false)
on conflict (id) do nothing;

create policy contract_captures_select_authenticated
  on storage.objects for select to authenticated
  using (bucket_id = 'contract-captures');

create policy contract_captures_insert_admin
  on storage.objects for insert to authenticated
  with check (bucket_id = 'contract-captures' and public.current_user_role() = 'administrateur');

create policy contract_captures_update_admin
  on storage.objects for update to authenticated
  using (bucket_id = 'contract-captures' and public.current_user_role() = 'administrateur')
  with check (bucket_id = 'contract-captures' and public.current_user_role() = 'administrateur');
