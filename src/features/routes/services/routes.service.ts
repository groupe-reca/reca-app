import { createCrudService } from '@/lib/supabaseCrud'
import type { RouteFormValues } from '../schemas/route.schema'
import type { Route, RouteRow, RouteStatus } from '../types/route.types'

const routesCrud = createCrudService<RouteRow>('routes')

function mapRoute(row: RouteRow): Route {
  return {
    id: row.id,
    numero: row.numero,
    nom: row.nom,
    secteur: row.secteur,
    description: row.description,
    statut: row.statut,
    dureeEstimee: row.duree_estimee,
    distance: row.distance,
    couleur: row.couleur,
    traceGeojson: row.trace_geojson,
    createdAt: row.created_at,
  }
}

/**
 * `dureeEstimee`/`distance` ne sont inclus que si le formulaire les a soumis
 * (repli manuel, Mapbox non configuré — voir `RouteForm.tsx`). Quand Mapbox est
 * configuré, ces champs ne sont pas `register()`és et RHF ne les envoie pas :
 * les omettre ici (plutôt que les écraser à `null`) évite d'effacer les valeurs
 * calculées par `recalculateRouteMetrics()` à chaque "Modifier".
 */
function toRowInput(values: RouteFormValues): Partial<RouteRow> {
  return {
    nom: values.nom,
    secteur: values.secteur || null,
    description: values.description || null,
    couleur: values.couleur || null,
    ...(values.dureeEstimee !== undefined ? { duree_estimee: values.dureeEstimee || null } : {}),
    ...(values.distance !== undefined ? { distance: values.distance ? Number(values.distance) : null } : {}),
  }
}

export async function listRoutes(): Promise<Route[]> {
  const rows = await routesCrud.list()
  return rows.map(mapRoute)
}

export async function getRoute(id: string): Promise<Route> {
  const row = await routesCrud.getById(id)
  return mapRoute(row)
}

export async function createRoute(values: RouteFormValues): Promise<Route> {
  const row = await routesCrud.create(toRowInput(values))
  return mapRoute(row)
}

export async function updateRoute(id: string, values: RouteFormValues): Promise<Route> {
  const row = await routesCrud.update(id, toRowInput(values))
  return mapRoute(row)
}

export async function updateRouteStatus(id: string, statut: RouteStatus): Promise<Route> {
  const row = await routesCrud.update(id, { statut })
  return mapRoute(row)
}

export async function softDeleteRoute(id: string): Promise<void> {
  await routesCrud.softDelete(id)
}
