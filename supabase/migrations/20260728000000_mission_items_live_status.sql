-- Synchronisation LIVE de l'avancement terrain (RECA Operator) vers mission_items.
-- Jusqu'ici, seul le statut TERMINAL (terminee / a_reprendre) + les durées étaient
-- écrits, une seule fois par résidence. RECA Operator écrit désormais à CHAQUE
-- changement d'état, pour que la base reflète l'avancement en direct — socle des
-- futurs écrans de statut des routes.
--
-- Trois nouvelles colonnes, toutes nullable (items anciens / non encore touchés = null) :
--   statut_operateur : état GRANULAIRE de la machine à états de l'opérateur, plus fin
--                      que la colonne `statut` (qui reste le rollup grossier consommé par
--                      l'admin : en_cours pour tout état "engagé"). Permet aux écrans de
--                      route de montrer la position réelle (en route / à l'approche /
--                      intervention / départ).
--   heure_arrivee    : instant d'arrivée sur la résidence (entrée dans le rayon).
--   heure_fin        : instant de finalisation (terminee ou a_reprendre).
--
-- Aucune nouvelle policy RLS : ces colonnes s'ajoutent à mission_items, déjà updatable
-- par l'opérateur assigné (policy mission_items_update_operator). Le RLS est row-level ;
-- les GRANT de table couvrent automatiquement les nouvelles colonnes, donc l'opérateur
-- les écrit dans le même UPDATE que le statut.
--
-- Le CHECK reprend les 7 états de la machine à états de RECA Operator (les intermédiaires
-- en_route/en_approche/depart n'ont pas d'équivalent dans le CHECK de `statut`).

alter table public.mission_items
  add column if not exists statut_operateur text
    check (statut_operateur in (
      'en_attente', 'en_route', 'en_approche', 'en_cours', 'depart', 'terminee', 'a_reprendre'
    )),
  add column if not exists heure_arrivee timestamptz,
  add column if not exists heure_fin timestamptz;
