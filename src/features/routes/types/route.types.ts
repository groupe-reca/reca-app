export type RouteRow = {
  id: string
  nom: string
  couleur: string
  operator_id: string | null
  equipment_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Route = {
  id: string
  nom: string
  couleur: string
  operatorId: string | null
  equipmentId: string | null
  createdAt: string
}

export type RouteSummary = Route & {
  contractCount: number
  operatorName: string | null
  equipmentName: string | null
}

export const ROUTE_COLOR_PRESETS: string[] = [
  '#DA291C',
  '#1D4ED8',
  '#16A34A',
  '#EA580C',
  '#7C3AED',
  '#0891B2',
  '#CA8A04',
  '#DB2777',
]
