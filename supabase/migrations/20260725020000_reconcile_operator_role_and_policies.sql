-- Réconcilie 2 changements appliqués en direct via l'éditeur SQL Supabase le
-- 2026-07-24 (côté reca-operator, branche "Intégration RECA App"), jamais
-- committés dans ce repo — dérive de schéma du même type que celle documentée
-- dans 20260725000000_repair_routes_v2_after_partial_apply.sql. Ce fichier les
-- rend idempotents et les capture enfin dans l'historique de migrations.

-- 1) Rôle `operateur` : élargit le CHECK inline posé par 20260709143631_users.sql
--    (`role text ... check (role in ('administrateur', 'employe'))`). Nom de
--    contrainte par défaut Postgres pour un CHECK inline non nommé :
--    users_role_check.
alter table public.users drop constraint if exists users_role_check;
alter table public.users add constraint users_role_check
  check (role in ('administrateur', 'operateur', 'employe'));

-- 2) L'ancienne policy ad hoc mission_items_update_operator (posée à la main le
--    2026-07-24 pour permettre à l'opérateur d'écrire le statut de ses
--    MissionItems) fait doublon avec mission_items_update_admin_or_operator
--    (20260725010000_missions_operator_write_access.sql), qui couvre déjà
--    administrateur + opérateur assigné. On la retire pour n'avoir qu'une
--    seule policy UPDATE permissive sur cette table.
drop policy if exists mission_items_update_operator on public.mission_items;
