-- Ajoute le statut 'suspendu' aux contrats (module Routes v2) : un contrat Suspendu reste
-- attaché à sa Route sans en être retiré automatiquement — voir src/features/routes.
alter table public.contracts drop constraint if exists contracts_statut_check;
alter table public.contracts add constraint contracts_statut_check
  check (statut in ('brouillon', 'a_signer', 'en_attente', 'actif', 'suspendu', 'expire', 'annule'));
