import { supabase } from '@/lib/supabaseClient'
import { createCrudService } from '@/lib/supabaseCrud'
import type { Route, RouteRow, RouteSummary } from '../types/route.types'
import type { RouteFormValues } from '../schemas/route.schema'
import type { RouteRenameFormValues } from '../schemas/routeRename.schema'

const routesCrud = createCrudService<RouteRow>('routes')

const SELECT_SUMMARY = `
  *,
  operator:employees(id, prenom, nom),
  equipment:equipments(id, nom),
  route_contracts(id, deleted_at)
`

type RouteSummaryJoinRow = RouteRow & {
  operator: { id: string; prenom: string; nom: string } | null
  equipment: { id: string; nom: string } | null
  route_contracts: { id: string; deleted_at: string | null }[]
}

function mapRoute(row: RouteRow): Route {
  return {
    id: row.id,
    nom: row.nom,
    couleur: row.couleur,
    operatorId: row.operator_id,
    equipmentId: row.equipment_id,
    createdAt: row.created_at,
  }
}

function mapRouteSummary(row: RouteSummaryJoinRow): RouteSummary {
  return {
    ...mapRoute(row),
    contractCount: row.route_contracts.filter((rc) => rc.deleted_at === null).length,
    operatorName: row.operator ? `${row.operator.prenom} ${row.operator.nom}` : null,
    equipmentName: row.equipment ? row.equipment.nom : null,
  }
}

function toRowInput(values: RouteFormValues): Partial<RouteRow> {
  return {
    nom: values.nom,
    couleur: values.couleur,
    operator_id: values.operatorId,
    equipment_id: values.equipmentId,
  }
}

export async function listRoutesSummary(): Promise<RouteSummary[]> {
  const { data, error } = await supabase
    .from('routes')
    .select(SELECT_SUMMARY)
    .is('deleted_at', null)
    .order('nom', { ascending: true })
  if (error) throw error
  return ((data ?? []) as unknown as RouteSummaryJoinRow[]).map(mapRouteSummary)
}

export async function getRoute(id: string): Promise<RouteSummary> {
  const { data, error } = await supabase.from('routes').select(SELECT_SUMMARY).eq('id', id).single()
  if (error) throw error
  return mapRouteSummary(data as unknown as RouteSummaryJoinRow)
}

export async function createRoute(values: RouteFormValues): Promise<Route> {
  const row = await routesCrud.create(toRowInput(values))
  return mapRoute(row)
}

export async function updateRoute(id: string, values: RouteFormValues): Promise<Route> {
  const row = await routesCrud.update(id, toRowInput(values))
  return mapRoute(row)
}

export async function renameRoute(id: string, values: RouteRenameFormValues): Promise<Route> {
  const row = await routesCrud.update(id, { nom: values.nom })
  return mapRoute(row)
}

export async function deleteRoute(id: string): Promise<void> {
  const { error: contractsError } = await supabase
    .from('route_contracts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('route_id', id)
    .is('deleted_at', null)
  if (contractsError) throw contractsError
  await routesCrud.softDelete(id)
}
