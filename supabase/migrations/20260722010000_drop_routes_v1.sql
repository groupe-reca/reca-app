-- Reconstruction complète du module Routes (v2, voir memory/ pour le contexte). L'ancien
-- modèle organisait des CLIENTS dans des routes datées avec assignation employé/équipement/date
-- et un statut d'exécution (planifiee/en_cours/terminee/suspendue), confondant "gabarit
-- permanent de territoire" et "sortie réelle" — hors-scope du nouveau module Routes.
--
-- CASCADE requis pour route_assignments : intervention_logs.route_assignment_id la référence
-- (FK on delete cascade). CASCADE ici ne supprime QUE cette contrainte FK sur intervention_logs,
-- jamais la table ni ses lignes (0 usage frontend actuel, reste intacte, hors-scope).
drop table if exists public.route_assignments cascade;
drop table if exists public.route_clients cascade;
drop table if exists public.routes cascade;
