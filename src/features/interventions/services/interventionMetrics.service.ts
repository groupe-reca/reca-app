import { INTERVENTION_ITEM_STATUSES } from '../types/interventionItem.types'
import type { InterventionItem, InterventionItemStatus } from '../types/interventionItem.types'

export type InterventionItemsSummary = {
  counts: Record<InterventionItemStatus, number>
  total: number
  completed: number
}

/**
 * Fonction pure (pas un hook, pas de requête réseau) — centralise le comptage par statut,
 * réutilisée par la carte Progression, le badge de la liste ET le gate de fermeture, pour
 * ne jamais désynchroniser ces 3 endroits qui doivent toujours s'accorder.
 */
export function summarizeItems(items: InterventionItem[]): InterventionItemsSummary {
  const counts = Object.fromEntries(INTERVENTION_ITEM_STATUSES.map((status) => [status, 0])) as Record<
    InterventionItemStatus,
    number
  >

  for (const item of items) {
    counts[item.statut] += 1
  }

  return { counts, total: items.length, completed: counts.terminee }
}
