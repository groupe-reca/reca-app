export const INTERVENTION_STATUSES = [
  'planifiee',
  'en_cours',
  'terminee',
  'terminee_avec_anomalies',
  'annulee',
] as const
export type InterventionStatus = (typeof INTERVENTION_STATUSES)[number]

export const INTERVENTION_STATUS_LABELS: Record<InterventionStatus, string> = {
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  terminee: 'Terminée',
  terminee_avec_anomalies: 'Terminée avec anomalies',
  annulee: 'Annulée',
}

export type InterventionRouteRef = {
  id: string
  numero: string
  nom: string
  couleur: string | null
}

export type InterventionEmployeeRef = {
  id: string
  prenom: string
  nom: string
}

export type InterventionEquipmentRef = {
  id: string
  numero: string
  nom: string
}

export type InterventionRow = {
  id: string
  numero: string
  route_id: string
  employee_id: string | null
  equipment_id: string | null
  date: string
  heure_prevue: string | null
  heure_debut: string | null
  heure_fin: string | null
  statut: InterventionStatus
  commentaires: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Intervention = {
  id: string
  numero: string
  routeId: string
  employeeId: string | null
  equipmentId: string | null
  date: string
  heurePrevue: string | null
  heureDebut: string | null
  heureFin: string | null
  statut: InterventionStatus
  commentaires: string | null
  createdAt: string
  route: InterventionRouteRef | null
  employee: InterventionEmployeeRef | null
  equipment: InterventionEquipmentRef | null
  /**
   * Calculés (jointure `intervention_items`, pas des colonnes) — seul `listInterventions()`
   * les recalcule réellement pour la carte "Résidences"/"Progression" de la liste, comme
   * `hasOverdueInvoice` sur `Contract`. Valent 0/0 partout ailleurs (détail/création/mise à
   * jour) : la fiche détail lit les items réels via `useInterventionItems`, pas ces champs.
   */
  residencesTotal: number
  residencesCompleted: number
}
