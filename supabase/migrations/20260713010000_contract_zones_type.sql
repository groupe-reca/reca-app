-- Sprint 009 : type de zone (vocabulaire fixe, piloté par couleur) sur contract_zones.
-- `label` continue de porter le nom affiché ("nom") — désormais toujours dérivé du type
-- choisi (le libellé français du type), sauf pour le type "autre" où il reste la saisie
-- libre existante ("Précisez le nom"). Additive uniquement : aucune colonne renommée,
-- des contrats réels existent déjà en production.

alter table public.contract_zones
  add column type text not null default 'autre';

alter table public.contract_zones
  add constraint contract_zones_type_check
    check (type in ('entree', 'stationnement', 'trottoir', 'escaliers', 'aire_manoeuvre', 'terrasse', 'autre'));
