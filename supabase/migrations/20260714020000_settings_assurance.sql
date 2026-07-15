-- Sprint 014 : numéro de police d'assurance responsabilité civile de
-- l'entreprise (section entreprise de Paramètres), affiché dans le nouveau
-- bloc de clause "Assurance et responsabilité" du Wizard Contrats.

alter table public.settings
  add column assurance_police_no text;
