export type MissionStatus = 'planifiee' | 'en_cours' | 'terminee' | 'terminee_avec_anomalies' | 'annulee'

export const MISSION_STATUSES: MissionStatus[] = [
  'planifiee',
  'en_cours',
  'terminee',
  'terminee_avec_anomalies',
  'annulee',
]

export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  terminee: 'Terminée',
  terminee_avec_anomalies: 'Terminée avec anomalies',
  annulee: 'Annulée',
}

export type MissionRow = {
  id: string
  numero: number
  route_id: string
  date: string
  heure_prevue: string
  heure_debut: string | null
  heure_fin: string | null
  operator_id: string | null
  equipment_id: string | null
  notes: string | null
  statut: MissionStatus
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Mission = {
  id: string
  numero: number
  routeId: string
  date: string
  heurePrevue: string
  heureDebut: string | null
  heureFin: string | null
  operatorId: string | null
  equipmentId: string | null
  notes: string | null
  statut: MissionStatus
  createdAt: string
}

export type MissionSummary = Mission & {
  routeName: string
  routeColor: string
  operatorName: string | null
  equipmentName: string | null
  itemCount: number
  itemsEnAttente: number
  itemsEnCours: number
  itemsTerminee: number
  itemsAReprendre: number
  itemsImpossible: number
}
