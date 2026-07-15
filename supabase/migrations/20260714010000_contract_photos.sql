-- Sprint 014 : photos de la propriété (complément optionnel à la capture
-- satellite) — une ligne par photo uploadée, réutilise le bucket Storage privé
-- `contract-captures` existant (chemin `contracts/{contractId}/photos/{photoId}.jpg`),
-- pas de nouveau bucket. Suit exactement le patron de `contract_zones` : colonne
-- `deleted_at` + policies select/insert/update-admin, **aucune policy delete**
-- (suppression physique bloquée structurellement dans tout le projet, voir
-- 20260709143718_rls_policies.sql) — la resynchronisation applicative doit
-- passer par un soft-delete (`update deleted_at`), jamais un `.delete()`.

create table public.contract_photos (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  storage_path text not null,
  ordre int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  deleted_at timestamptz
);

create index idx_contract_photos_contract on public.contract_photos (contract_id);

alter table public.contract_photos enable row level security;

create trigger trg_contract_photos_audit
  before insert or update on public.contract_photos
  for each row execute function set_audit_columns();

create policy contract_photos_select_authenticated
  on public.contract_photos for select to authenticated
  using (deleted_at is null);

create policy contract_photos_insert_admin
  on public.contract_photos for insert to authenticated
  with check (public.current_user_role() = 'administrateur');

create policy contract_photos_update_admin
  on public.contract_photos for update to authenticated
  using (public.current_user_role() = 'administrateur')
  with check (public.current_user_role() = 'administrateur');
