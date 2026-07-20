-- tâche 6 : le prix saisi par contrat est-il avant ou après taxes ? Piloté par
-- settings.contract_wizard_defaults.prixTaxes, gravé sur chaque contrat à la
-- création (même pattern que type/saison/services : jamais relu en live depuis
-- settings pour un contrat déjà créé).
alter table public.contracts
  add column prix_taxes text not null default 'avant_taxes'
  check (prix_taxes in ('avant_taxes', 'apres_taxes'));
