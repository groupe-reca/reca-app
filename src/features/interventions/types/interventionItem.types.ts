export const INTERVENTION_ITEM_STATUSES = ['planifiee', 'en_cours', 'terminee', 'a_reprendre'] as const
export type InterventionItemStatus = (typeof INTERVENTION_ITEM_STATUSES)[number]

export const INTERVENTION_ITEM_STATUS_LABELS: Record<InterventionItemStatus, string> = {
  planifiee: 'En attente',
  en_cours: 'En cours',
  terminee: 'Terminée',
  a_reprendre: 'À reprendre',
}

/** Résolu par jointure `client_id -> clients` — jamais dupliqué en colonne propre sur intervention_items. */
export type InterventionItemClientRef = {
  id: string
  prenom: string
  nom: string
  adresse: string | null
  telephone: string | null
  latitude: number | null
  longitude: number | null
}

export type InterventionItemRow = {
  id: string
  intervention_id: string
  client_id: string
  route_client_id: string | null
  ordre: number
  statut: InterventionItemStatus
  notes: string | null
  code_probleme: string | null
  heure_debut: string | null
  heure_fin: string | null
  temps_deplacement_secondes: number | null
  temps_intervention_secondes: number | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type InterventionItem = {
  id: string
  interventionId: string
  clientId: string
  ordre: number
  statut: InterventionItemStatus
  notes: string | null
  codeProbleme: string | null
  heureDebut: string | null
  heureFin: string | null
  tempsDeplacementSecondes: number | null
  tempsInterventionSecondes: number | null
  client: InterventionItemClientRef | null
}
