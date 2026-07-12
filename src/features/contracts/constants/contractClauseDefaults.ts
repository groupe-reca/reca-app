// Mêmes valeurs par défaut que la migration
// `supabase/migrations/20260712000000_contracts_clauses_and_schedule.sql` —
// RHF a besoin de defaultValues explicites côté JS, donc ces deux sources
// doivent être maintenues manuellement en synchronisation.
export const CONTRACT_CLAUSE_DEFAULTS = {
  zoneDesservie: "Déneigement exclusif de l'entrée de stationnement.",
  exclusions:
    "Aucun déneigement des trottoirs, des escaliers, des balcons, ni du toit. Aucun épandage de sel ou d'abrasif n'est inclus.",
  seuilDeclenchementCm: '5',
  heurePremierPassage: '07:00',
  nettoyageFinal:
    'Un passage de finition est effectué après le passage de la déneigeuse de la ville (chasse-neige) ou à la fin complète des précipitations.',
  distanceSecuriteCm: '60',
  balisesRequises: true,
  obligationsClient:
    "L'entrée doit être libre de tout véhicule ou obstacle (poubelles, jouets) lors du passage de l'entrepreneur. Le client accepte l'installation de balises de signalisation en bordure de son entrée pour l'hiver.",
  responsabilites:
    "L'entrepreneur n'est pas responsable des dommages causés aux objets laissés dans l'entrée. L'entrepreneur décline toute responsabilité pour les chutes ou accidents (glissades) survenant dans l'entrée.",
} as const

export const DEFAULT_PAYMENT_SCHEDULE = [
  { description: 'À la signature du contrat', type: 'pourcentage' as const, valeur: '50', dateEcheance: '' },
  { description: 'Solde', type: 'pourcentage' as const, valeur: '50', dateEcheance: '' },
]
