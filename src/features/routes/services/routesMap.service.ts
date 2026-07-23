import type { LineString } from 'geojson'
import { supabase } from '@/lib/supabaseClient'
import type { RouteStatus } from '../types/route.types'

export type RouteMapClient = {
  id: string
  prenom: string
  nom: string
  latitude: number | null
  longitude: number | null
}

export type RouteMapData = {
  id: string
  numero: string
  nom: string
  statut: RouteStatus
  couleur: string | null
  traceGeojson: LineString | null
  clients: RouteMapClient[]
}

type RouteMapRow = {
  id: string
  numero: string
  nom: string
  statut: RouteStatus
  couleur: string | null
  trace_geojson: LineString | null
  route_clients: {
    deleted_at: string | null
    client: { id: string; prenom: string; nom: string; latitude: number | null; longitude: number | null } | null
  }[]
}

/** Routes "actives" (non terminées) + leurs clients ordonnés, pour la vue Carte. */
export async function listRoutesForMap(): Promise<RouteMapData[]> {
  const { data, error } = await supabase
    .from('routes')
    .select(
      'id, numero, nom, statut, couleur, trace_geojson, route_clients(deleted_at, client:clients(id, prenom, nom, latitude, longitude))',
    )
    .is('deleted_at', null)
    .neq('statut', 'terminee')
    .order('ordre', { foreignTable: 'route_clients', ascending: true })

  if (error) throw error

  return ((data ?? []) as unknown as RouteMapRow[]).map((row) => ({
    id: row.id,
    numero: row.numero,
    nom: row.nom,
    statut: row.statut,
    couleur: row.couleur,
    traceGeojson: row.trace_geojson,
    clients: row.route_clients
      .filter((item) => item.deleted_at === null && item.client !== null)
      .map((item) => item.client as RouteMapClient),
  }))
}
