-- Ajoute les statuts `brouillon` et `a_signer` (Optimisation UI v3, maquette
-- page principale Contrats). `en_attente` (libellé renommé "Signature en
-- attente" côté app) et `annule` (conservé, absent des filtres chips par
-- défaut) restent inchangés.
alter table public.contracts drop constraint if exists contracts_statut_check;
alter table public.contracts add constraint contracts_statut_check
  check (statut in ('brouillon', 'a_signer', 'en_attente', 'actif', 'expire', 'annule'));
