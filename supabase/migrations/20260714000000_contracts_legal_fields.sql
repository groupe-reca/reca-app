-- Sprint 014 : Wizard Contrats V2 — champs légaux (mode de conclusion, plafond
-- saisonnier, dépôt de neige) + colonnes de clauses générées additionnelles
-- (Annulation/résolution, Prix, Exécution, Assurance). Migration purement
-- additive : aucune colonne existante n'est renommée/supprimée, des contrats
-- réels existent déjà en production.

alter table public.contracts
  add column mode_conclusion text not null default 'en_personne',
  add column depot_neige text not null default 'sur_terrain',
  add column permis_municipal_obtenu boolean not null default false,
  add column clause_annulation text,
  add column clause_prix text,
  add column clause_execution text,
  add column clause_assurance text;

alter table public.contracts
  add constraint contracts_mode_conclusion_check
    check (mode_conclusion in ('en_personne', 'a_distance', 'itinerant'));

alter table public.contracts
  add constraint contracts_depot_neige_check
    check (depot_neige in ('sur_terrain', 'bordure_rue', 'transport_hors_site'));
