-- contracts: editable clause fields (fiche de création complète, module D)
-- and a flexible payment schedule (modalites_paiement) used to
-- auto-generate invoices when a contract is finalized.
alter table public.contracts
  add column zone_desservie text not null
    default 'Déneigement exclusif de l''entrée de stationnement.',
  add column superficie numeric(10, 2),
  add column exclusions text not null
    default 'Aucun déneigement des trottoirs, des escaliers, des balcons, ni du toit. Aucun épandage de sel ou d''abrasif n''est inclus.',
  add column seuil_declenchement_cm numeric(5, 2) not null default 5,
  add column heure_premier_passage text not null default '07:00',
  add column nettoyage_final text not null
    default 'Un passage de finition est effectué après le passage de la déneigeuse de la ville (chasse-neige) ou à la fin complète des précipitations.',
  add column distance_securite_cm numeric(5, 2) not null default 60,
  add column balises_requises boolean not null default true,
  add column obligations_client text not null
    default 'L''entrée doit être libre de tout véhicule ou obstacle (poubelles, jouets) lors du passage de l''entrepreneur. Le client accepte l''installation de balises de signalisation en bordure de son entrée pour l''hiver.',
  add column responsabilites text not null
    default 'L''entrepreneur n''est pas responsable des dommages causés aux objets laissés dans l''entrée. L''entrepreneur décline toute responsabilité pour les chutes ou accidents (glissades) survenant dans l''entrée.',
  add column modalites_paiement jsonb not null default '[]'::jsonb;

alter table public.contracts
  add constraint contracts_modalites_paiement_is_array
  check (jsonb_typeof(modalites_paiement) = 'array');
