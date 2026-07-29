-- Permet à l'employé assigné comme opérateur d'une Mission (missions.operator_id ->
-- employees.id -> employees.user_id -> auth.uid()) de démarrer/mettre à jour sa propre
-- Mission et le statut de ses MissionItems (résidences), sans devenir administrateur.
-- Avant cette migration, missions_update_admin/mission_items_update_admin (20260723000000_missions.sql)
-- réservaient toute écriture aux administrateurs, alors que l'UI (bouton "Débuter",
-- <select> de statut MissionItem) n'a aucune garde de rôle.
-- INSERT/DELETE restent admin-only : aucune UI ne permet à un employé de créer une Mission
-- ou de copier des MissionItems.

drop policy if exists missions_update_admin on public.missions;

create policy missions_update_admin_or_operator on public.missions
  for update to authenticated
  using (
    public.current_user_role() = 'administrateur'
    or operator_id in (select id from public.employees where user_id = auth.uid())
  )
  with check (
    public.current_user_role() = 'administrateur'
    or operator_id in (select id from public.employees where user_id = auth.uid())
  );

drop policy if exists mission_items_update_admin on public.mission_items;

create policy mission_items_update_admin_or_operator on public.mission_items
  for update to authenticated
  using (
    public.current_user_role() = 'administrateur'
    or mission_id in (
      select m.id from public.missions m
      join public.employees e on e.id = m.operator_id
      where e.user_id = auth.uid()
    )
  )
  with check (
    public.current_user_role() = 'administrateur'
    or mission_id in (
      select m.id from public.missions m
      join public.employees e on e.id = m.operator_id
      where e.user_id = auth.uid()
    )
  );
