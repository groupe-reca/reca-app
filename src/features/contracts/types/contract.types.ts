export type ContractStatus = 'actif' | 'en_attente' | 'expire' | 'annule'

export const CONTRACT_STATUSES: ContractStatus[] = ['actif', 'en_attente', 'expire', 'annule']

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  actif: 'Actif',
  en_attente: 'En attente',
  expire: 'Expiré',
  annule: 'Annulé',
}

export type ContractClientRef = {
  id: string
  numero: string
  prenom: string
  nom: string
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

export type ObligationsAnswers = {
  balisesRequises: boolean
  seuilDeclenchementCm: SeuilDeclenchementCm
  accumulationMaximaleCm: number | null
  entreeLibreObligatoire: boolean
  animaux: boolean
  portail: boolean
  autresParticularites: string
}

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
  createdAt: string
  client: ContractClientRef | null
}
