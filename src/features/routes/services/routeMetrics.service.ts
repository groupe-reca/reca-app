import type { LineString } from 'geojson'
import { supabase } from '@/lib/supabaseClient'
import { MAPBOX_DIRECTIONS_URL, MAPBOX_TOKEN, isMapboxConfigured } from '@/lib/mapboxClient'

/**
 * Limite de l'API Mapbox Directions pour une requête GET (waypoints séparés par
 * `;` dans l'URL) — au-delà, l'API répond une erreur. Pas de découpage en segments
 * géré pour l'instant, une route de plus de 25 clients reste en calcul manuel.
 */
const MAX_DIRECTIONS_WAYPOINTS = 25

type Coordinate = [number, number]

type DirectionsResponse = {
  routes?: { distance: number; duration: number; geometry: LineString }[]
}

export type RouteMetricsResult =
  | { status: 'ok'; excludedClientCount: number }
  | { status: 'skipped'; reason: 'not_configured' | 'insufficient_coordinates' | 'too_many_clients' }
  | { status: 'error'; message: string }

type ClientCoordinateRow = {
  client: { latitude: number | null; longitude: number | null } | null
}

async function fetchOrderedClientCoordinates(
  routeId: string,
): Promise<{ coords: Coordinate[]; excludedCount: number }> {
  const { data, error } = await supabase
    .from('route_clients')
    .select('client:clients(latitude, longitude)')
    .eq('route_id', routeId)
    .is('deleted_at', null)
    .order('ordre', { ascending: true })

  if (error) throw error

  const rows = (data ?? []) as unknown as ClientCoordinateRow[]
  const coords: Coordinate[] = []
  let excludedCount = 0

  for (const row of rows) {
    const { latitude, longitude } = row.client ?? {}
    if (latitude != null && longitude != null) {
      coords.push([longitude, latitude])
    } else {
      excludedCount += 1
    }
  }

  return { coords, excludedCount }
}

async function clearRouteMetrics(routeId: string): Promise<void> {
  const { error } = await supabase
    .from('routes')
    .update({ distance: null, duree_estimee: null, trace_geojson: null } as never)
    .eq('id', routeId)

  if (error) throw error
}

/**
 * Recalcule distance/durée/tracé d'une route à partir de l'ordre actuel de ses
 * clients, via l'API Mapbox Directions, et persiste le résultat sur `routes`.
 * Appelée uniquement depuis les hooks de mutation d'ajout/retrait/réordonnancement
 * de client (jamais directement depuis un composant) — un échec ici ne doit jamais
 * faire échouer l'opération sur les clients elle-même, les appelants l'entourent
 * d'un try/catch.
 */
export async function recalculateRouteMetrics(routeId: string): Promise<RouteMetricsResult> {
  if (!isMapboxConfigured) return { status: 'skipped', reason: 'not_configured' }

  const { coords, excludedCount } = await fetchOrderedClientCoordinates(routeId)

  if (coords.length < 2) {
    await clearRouteMetrics(routeId)
    return { status: 'skipped', reason: 'insufficient_coordinates' }
  }

  if (coords.length > MAX_DIRECTIONS_WAYPOINTS) {
    return { status: 'skipped', reason: 'too_many_clients' }
  }

  const coordinatesParam = coords.map(([lng, lat]) => `${lng},${lat}`).join(';')
  const url = `${MAPBOX_DIRECTIONS_URL}/${coordinatesParam}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`

  const response = await fetch(url)
  if (!response.ok) {
    return { status: 'error', message: `Mapbox Directions a répondu ${response.status}.` }
  }

  const body = (await response.json()) as DirectionsResponse
  const leg = body.routes?.[0]
  if (!leg) {
    return { status: 'error', message: 'Aucun itinéraire retourné par Mapbox Directions.' }
  }

  const distanceKm = Math.round((leg.distance / 1000) * 100) / 100
  const dureeEstimee = `${Math.round(leg.duration)} seconds`

  const { error } = await supabase
    .from('routes')
    .update({ distance: distanceKm, duree_estimee: dureeEstimee, trace_geojson: leg.geometry } as never)
    .eq('id', routeId)

  if (error) throw error

  return { status: 'ok', excludedClientCount: excludedCount }
}
