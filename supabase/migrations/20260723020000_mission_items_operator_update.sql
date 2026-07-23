-- Autorise un opérateur à mettre à jour le statut des MissionItems de SA mission.
--
-- Contexte : RECA Operator renvoie l'avancement terrain (terminee / a_reprendre) vers
-- mission_items.statut. Les policies existantes réservent l'écriture aux administrateurs
-- (mission_items_update_admin) ; cette policy additionnelle permet à l'opérateur assigné
-- d'écrire, sans élargir l'accès aux autres missions.
--
-- Chaîne d'autorisation : auth.uid() == users.id == employees.user_id
--   → employees.id == missions.operator_id → mission_items de cette mission.
-- Les policies SELECT de missions/employees autorisent déjà l'opérateur à les lire, donc
-- le sous-select EXISTS s'évalue correctement.
--
-- Pré-requis données (hors migration) : employees.user_id doit être renseigné pour relier
-- le compte de connexion à l'employé assigné (missions.operator_id).
--
-- Pré-requis schéma : la migration 20260723000000_missions.sql (tables missions/mission_items)
-- doit être appliquée AVANT celle-ci.

drop policy if exists mission_items_update_operator on public.mission_items;

create policy mission_items_update_operator on public.mission_items
  for update to authenticated
  using (
    exists (
      select 1
      from public.missions m
      join public.employees e on e.id = m.operator_id
      where m.id = mission_items.mission_id
        and e.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.missions m
      join public.employees e on e.id = m.operator_id
      where m.id = mission_items.mission_id
        and e.user_id = auth.uid()
    )
  );
