-- Durées réelles mesurées sur le terrain par RECA Operator, écrites au moment où
-- une résidence atteint un état terminal (terminee / a_reprendre). Affichées côté
-- RECA App sur les cartes de résidence de la fiche Mission.
--
-- Deux durées distinctes, en SECONDES entières, nullable (les items anciens et ceux
-- pas encore finalisés restent null) :
--   duree_trajet_secondes       : déplacement jusqu'à l'arrivée sur la résidence
--   duree_intervention_secondes : temps réel d'intervention sur place
--
-- Aucune nouvelle policy RLS : ces colonnes s'ajoutent à mission_items, déjà
-- updatable par l'opérateur assigné (policy mission_items_update_admin_or_operator).
-- Le RLS est row-level ; les GRANT de table couvrent automatiquement les nouvelles
-- colonnes, donc l'opérateur peut les écrire dans le même UPDATE que le statut.

alter table public.mission_items
  add column if not exists duree_trajet_secondes integer,
  add column if not exists duree_intervention_secondes integer;
