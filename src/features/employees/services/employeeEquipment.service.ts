import { supabase } from '@/lib/supabaseClient'
import type { EquipmentStatus } from '@/features/equipments/types/equipment.types'

export type AssignedEquipment = {
  id: string
  equipmentId: string
  numero: string
  nom: string
  statut: EquipmentStatus
}

type AssignedEquipmentRow = {
  id: string
  equipment_id: string
  equipment: { id: string; numero: string; nom: string; statut: EquipmentStatus } | null
}

export async function listAssignedEquipment(employeeId: string): Promise<AssignedEquipment[]> {
  const { data, error } = await supabase
    .from('employee_equipment')
    .select('id, equipment_id, equipment:equipments(id, numero, nom, statut)')
    .eq('employee_id', employeeId)
    .is('deleted_at', null)

  if (error) throw error

  return ((data ?? []) as unknown as AssignedEquipmentRow[])
    .filter((row) => row.equipment !== null)
    .map((row) => ({
      id: row.id,
      equipmentId: row.equipment_id,
      numero: row.equipment!.numero,
      nom: row.equipment!.nom,
      statut: row.equipment!.statut,
    }))
}

export async function assignEquipment(employeeId: string, equipmentId: string): Promise<void> {
  const { error } = await supabase
    .from('employee_equipment')
    .insert({ employee_id: employeeId, equipment_id: equipmentId } as never)

  if (error) throw error
}

export async function unassignEquipment(id: string): Promise<void> {
  const { error } = await supabase
    .from('employee_equipment')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}
