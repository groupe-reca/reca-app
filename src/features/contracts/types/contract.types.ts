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
  createdAt: string
  client: ContractClientRef | null
}
