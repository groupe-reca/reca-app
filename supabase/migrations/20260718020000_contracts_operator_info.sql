-- tâche 9 : informations opérateur affichées/éditables sur la fiche contrat
-- ("Notes spécifiques à la résidence") — 3 nouveaux champs texte libres, 1:1 par
-- contrat (pas une liste). "Autres détails" du mockup réutilise la colonne
-- `notes` existante (contracts.notes), volontairement pas dupliquée ici.
alter table public.contracts
  add column obstacles_connus text,
  add column message_operateur text,
  add column consignes_speciales text;
