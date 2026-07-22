export const INTERVENTION_EVENT_TYPES = ['creee', 'debut', 'pause', 'reprise', 'terminee', 'fermee'] as const
export type InterventionEventType = (typeof INTERVENTION_EVENT_TYPES)[number]

export const INTERVENTION_EVENT_TYPE_LABELS: Record<InterventionEventType, string> = {
  creee: 'Créée',
  debut: 'Début',
  pause: 'Pause',
  reprise: 'Reprise',
  terminee: 'Terminée',
  fermee: 'Fermeture forcée',
}

/** `itemsRestants` renseigné uniquement pour l'événement `fermee` (fermeture forcée admin). */
export type InterventionEventPayload = { itemsRestants?: number } | null

export type InterventionEventActorRef = {
  id: string
  nom: string | null
}

export type InterventionEventRow = {
  id: string
  intervention_id: string
  type: InterventionEventType
  payload: InterventionEventPayload
  created_at: string
  created_by: string | null
  author: InterventionEventActorRef | null
}

export type InterventionEvent = {
  id: string
  interventionId: string
  type: InterventionEventType
  payload: InterventionEventPayload
  createdAt: string
  author: InterventionEventActorRef | null
}
