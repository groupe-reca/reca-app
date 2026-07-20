export type ContractStatus = 'brouillon' | 'a_signer' | 'en_attente' | 'actif' | 'expire' | 'annule'

export const CONTRACT_STATUSES: ContractStatus[] = [
  'brouillon',
  'a_signer',
  'en_attente',
  'actif',
  'expire',
  'annule',
]

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  brouillon: 'Brouillon',
  a_signer: 'À signer',
  en_attente: 'Signature en attente',
  actif: 'Actif',
  expire: 'Expiré',
  annule: 'Annulé',
}

export type ContractClientRef = {
  id: string
  numero: string
  prenom: string
  nom: string
  telephone: string | null
  courriel: string | null
  adresse: string | null
  ville: string | null
  codePostal: string | null
}

export type PaymentScheduleEntryType = 'pourcentage' | 'montant'

export type PaymentScheduleEntry = {
  description: string
  type: PaymentScheduleEntryType
  valeur: number
  dateEcheance: string
}

export type ServiceCode = 'deneigement' | 'epandage' | 'soufflage' | 'escaliers' | 'toiture' | 'autres'

export type ServiceEntry = {
  code: ServiceCode
  label: string
  active: boolean
  precisions: string | null
}

export type SeuilDeclenchementCm = 2 | 3 | 5

// Tâche 5 : l'étape "Modalités & Obligations" ne collecte plus de réponses
// Q&R par contrat — seuil/heure/dépôt de neige viennent désormais des
// paramètres par défaut du Wizard (`ContractWizardDefaults`, settings.contract_wizard_defaults),
// et balises/entrée libre/animaux/portail/autres particularités/accumulation
// max./plafond saisonnier sont retirés entièrement (voir generateClauses.ts).
export type ObligationsAnswers = {
  seuilDeclenchementCm: SeuilDeclenchementCm
  heurePremierPassage: string
  depotNeige: DepotNeige
  permisMunicipalObtenu: boolean
}

export const MODE_CONCLUSION = ['en_personne', 'a_distance', 'itinerant'] as const
export type ModeConclusion = (typeof MODE_CONCLUSION)[number]

export const DEPOT_NEIGE = ['sur_terrain', 'bordure_rue', 'transport_hors_site'] as const
export type DepotNeige = (typeof DEPOT_NEIGE)[number]

/**
 * Le prix saisi à l'étape "Client & Propriété" du Wizard inclut-il déjà les
 * taxes ou non — pilote le calcul Sous-total/TPS/TVQ/Total des factures
 * générées et de la prévisualisation du contrat (tâche 6, 2026-07-17).
 */
export const PRIX_TAXES_MODES = ['avant_taxes', 'apres_taxes'] as const
export type PrixTaxesMode = (typeof PRIX_TAXES_MODES)[number]

export const ZONE_TYPES = [
  'entree',
  'stationnement',
  'trottoir',
  'escaliers',
  'aire_manoeuvre',
  'terrasse',
  'autre',
] as const
export type ZoneType = (typeof ZONE_TYPES)[number]

export type ContractZoneRow = {
  id: string
  contract_id: string
  type: ZoneType
  label: string
  geojson: GeoJSON.Polygon
  surface_m2: number
  image_storage_path: string
  ordre: number
  captured_at: string
  created_at: string
  created_by: string | null
}

export type ContractZone = {
  id: string
  type: ZoneType
  label: string
  geojson: GeoJSON.Polygon
  surfaceM2: number
  imageStoragePath: string
  ordre: number
  capturedAt: string
}

export type ContractPhotoRow = {
  id: string
  contract_id: string
  storage_path: string
  ordre: number
  created_at: string
  created_by: string | null
}

export type ContractPhoto = {
  id: string
  storagePath: string
  ordre: number
}

export type ContractRow = {
  id: string
  numero: string
  client_id: string
  type: string | null
  saison: string | null
  prix: number | null
  statut: ContractStatus
  date_signature: string | null
  date_debut: string | null
  date_fin: string | null
  renouvellement: boolean
  notes: string | null
  zone_desservie: string
  superficie: number | null
  exclusions: string
  seuil_declenchement_cm: number
  heure_premier_passage: string
  nettoyage_final: string
  distance_securite_cm: number
  balises_requises: boolean
  obligations_client: string
  responsabilites: string
  modalites_paiement: PaymentScheduleEntry[]
  adresse_geocodee: string | null
  latitude: number | null
  longitude: number | null
  mode_paiement: string | null
  services: ServiceEntry[]
  obligations_reponses: ObligationsAnswers | Record<string, never>
  accumulation_maximale_cm: number | null
  mode_conclusion: ModeConclusion
  depot_neige: DepotNeige
  permis_municipal_obtenu: boolean
  clause_annulation: string | null
  clause_prix: string | null
  clause_execution: string | null
  clause_assurance: string | null
  prix_taxes: PrixTaxesMode
  obstacles_connus: string | null
  message_operateur: string | null
  consignes_speciales: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Contract = {
  id: string
  numero: string
  clientId: string
  type: string | null
  saison: string | null
  prix: number | null
  statut: ContractStatus
  dateSignature: string | null
  dateDebut: string | null
  dateFin: string | null
  renouvellement: boolean
  notes: string | null
  zoneDesservie: string
  superficie: number | null
  exclusions: string
  seuilDeclenchementCm: number
  heurePremierPassage: string
  nettoyageFinal: string
  distanceSecuriteCm: number
  balisesRequises: boolean
  obligationsClient: string
  responsabilites: string
  modalitesPaiement: PaymentScheduleEntry[]
  adresseGeocodee: string | null
  latitude: number | null
  longitude: number | null
  modePaiement: string | null
  services: ServiceEntry[]
  obligationsReponses: ObligationsAnswers | Record<string, never>
  accumulationMaximaleCm: number | null
  modeConclusion: ModeConclusion
  depotNeige: DepotNeige
  permisMunicipalObtenu: boolean
  clauseAnnulation: string | null
  clausePrix: string | null
  clauseExecution: string | null
  clauseAssurance: string | null
  prixTaxes: PrixTaxesMode
  obstaclesConnus: string | null
  messageOperateur: string | null
  consignesSpeciales: string | null
  createdAt: string
  client: ContractClientRef | null
  /** Calculé (pas une colonne) — présence d'au moins une facture liée `en_retard`, voir `listContracts`. */
  hasOverdueInvoice: boolean
}
