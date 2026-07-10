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
    createdAt: row.created_at,
  }
}

function toRowInput(values: RouteFormValues): Partial<RouteRow> {
  return {
    nom: values.nom,
    secteur: values.secteur || null,
    description: values.description || null,
    duree_estimee: values.dureeEstimee || null,
    distance: values.distance ? Number(values.distance) : null,
    couleur: values.couleur || null,
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
