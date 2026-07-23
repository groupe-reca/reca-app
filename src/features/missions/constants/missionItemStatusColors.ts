import type { BadgeColor } from '@/components/ui/Badge'
import type { MissionItemStatus } from '../types/missionItem.types'

/**
 * Source unique pour les 5 couleurs de statut d'un MissionItem — utilisée à la fois par
 * `MissionItemStatusBadge.tsx` (classes Tailwind via `BadgeColor`) et par les marqueurs de
 * `MissionMapView.tsx` (couleur hex directe pour `mapboxgl.Marker`), pour que badge et carte ne
 * puissent jamais diverger. Correspondance exacte avec la légende du brief : Gris/Bleu/Vert/Orange/Rouge.
 */
export const MISSION_ITEM_STATUS_COLORS: Record<MissionItemStatus, BadgeColor> = {
  en_attente: 'gray',
  en_cours: 'blue',
  terminee: 'green',
  a_reprendre: 'orange',
  impossible: 'red',
}

export const MISSION_ITEM_STATUS_HEX: Record<MissionItemStatus, string> = {
  en_attente: '#94A3B8',
  en_cours: '#3B82F6',
  terminee: '#22C55E',
  a_reprendre: '#F97316',
  impossible: '#EF4444',
}
