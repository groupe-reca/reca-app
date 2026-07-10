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

const SELECT_WITH_RELATIONS =
  'id, date, statut, employee:employees(id, prenom, nom), equipment:equipments(id, numero, nom)'

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
