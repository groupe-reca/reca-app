import { supabase } from '@/lib/supabaseClient'

export type AssignmentStatus = 'planifiee' | 'en_cours' | 'terminee' | 'annulee'

export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string> = {
  planifiee: 'Planifiée',
  en_cours: 'En cours',
  terminee: 'Terminée',
  annulee: 'Annulée',
}

export type RouteAssignment = {
  id: string
  date: string
  statut: AssignmentStatus
  employee: { id: string; prenom: string; nom: string } | null
  equipment: { id: string; numero: string; nom: string } | null
}

type RouteAssignmentRow = {
  id: string
  date: string
  statut: AssignmentStatus
  employee: { id: string; prenom: string; nom: string } | null
  equipment: { id: string; numero: string; nom: string } | null
}

export type RouteAssignmentWithRoute = RouteAssignment & {
  route: { id: string; numero: string; nom: string; couleur: string | null } | null
}

type RouteAssignmentWithRouteRow = RouteAssignmentRow & {
  route: { id: string; numero: string; nom: string; couleur: string | null } | null
}

const SELECT_WITH_RELATIONS =
  'id, date, statut, employee:employees(id, prenom, nom), equipment:equipments(id, numero, nom)'

const SELECT_WITH_ROUTE =
  'id, date, statut, employee:employees(id, prenom, nom), equipment:equipments(id, numero, nom), route:routes(id, numero, nom, couleur)'

export async function listAssignments(routeId: string): Promise<RouteAssignment[]> {
  const { data, error } = await supabase
    .from('route_assignments')
    .select(SELECT_WITH_RELATIONS)
    .eq('route_id', routeId)
    .is('deleted_at', null)
    .order('date', { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as RouteAssignmentRow[]
}

/** Toutes les assignations (toutes routes confondues) sur une plage de dates — vue Timeline. */
export async function listAssignmentsInRange(startDate: string, endDate: string): Promise<RouteAssignmentWithRoute[]> {
  const { data, error } = await supabase
    .from('route_assignments')
    .select(SELECT_WITH_ROUTE)
    .is('deleted_at', null)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown as RouteAssignmentWithRouteRow[]
}

export async function createAssignment(
  routeId: string,
  employeeId: string,
  date: string,
  equipmentId?: string,
): Promise<void> {
  const { error } = await supabase.from('route_assignments').insert({
    route_id: routeId,
    employee_id: employeeId,
    equipment_id: equipmentId || null,
    date,
  } as never)

  if (error) throw error
}

export async function updateAssignmentStatus(id: string, statut: AssignmentStatus): Promise<void> {
  const { error } = await supabase
    .from('route_assignments')
    .update({ statut } as never)
    .eq('id', id)

  if (error) throw error
}

export async function deleteAssignment(id: string): Promise<void> {
  const { error } = await supabase
    .from('route_assignments')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}
