-- Tâche 5 : les paramètres du Wizard Contrats qui sont "toujours les mêmes pour
-- tout le monde" (saison, dates, services, seuil d'intervention, heure limite de
-- dégagement, dépôt de la neige, mode de conclusion) deviennent une config
-- d'organisation éditable dans un nouveau menu du module Contrats, au lieu
-- d'être saisis à chaque contrat. Même pattern que `settings.modules`.
alter table public.settings
  add column contract_wizard_defaults jsonb not null default '{}'::jsonb;

update public.settings
set contract_wizard_defaults = '{
  "saison": "2026-2027",
  "dateDebut": "2026-11-01",
  "dateFin": "2027-05-01",
  "serviceCodes": ["deneigement"],
  "seuilDeclenchementCm": 5,
  "heurePremierPassage": "07:00",
  "depotNeige": "sur_terrain",
  "modeConclusion": "en_personne"
}'::jsonb
where id = true;
