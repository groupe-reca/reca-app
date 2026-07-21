import type { LineString } from 'geojson'

export type RouteStatus = 'planifiee' | 'en_cours' | 'terminee' | 'suspendue'

export const ROUTE_STATUSES: RouteStatus[] = ['planifiee', 'en_cours', 'terminee', 'suspendue']

export const ROUTE_STATUS_LABELS: Record<RouteStatus, string> = {
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  terminee: 'Terminée',
  suspendue: 'Suspendue',
}

export type RouteRow = {
  id: string
  numero: string
  nom: string
  secteur: string | null
  description: string | null
  statut: RouteStatus
  duree_estimee: string | null
  distance: number | null
  couleur: string | null
  trace_geojson: LineString | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Route = {
  id: string
  numero: string
  nom: string
  secteur: string | null
  description: string | null
  statut: RouteStatus
  dureeEstimee: string | null
  distance: number | null
  couleur: string | null
  traceGeojson: LineString | null
  createdAt: string
}
