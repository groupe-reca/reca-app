import { createCrudService } from '@/lib/supabaseCrud'
import type { EquipmentFormValues } from '../schemas/equipment.schema'
import type { Equipment, EquipmentRow, EquipmentStatus } from '../types/equipment.types'

const equipmentsCrud = createCrudService<EquipmentRow>('equipments')

function mapEquipment(row: EquipmentRow): Equipment {
  return {
    id: row.id,
    numero: row.numero,
    nom: row.nom,
    categorie: row.categorie,
    marque: row.marque,
    modele: row.modele,
    annee: row.annee,
    plaque: row.plaque,
    numeroSerie: row.numero_serie,
    statut: row.statut,
    entretien: row.entretien,
    notes: row.notes,
    createdAt: row.created_at,
  }
}

function toRowInput(values: EquipmentFormValues): Partial<EquipmentRow> {
  return {
    nom: values.nom,
    categorie: values.categorie || null,
    marque: values.marque || null,
    modele: values.modele || null,
    annee: values.annee ? Number(values.annee) : null,
    plaque: values.plaque || null,
    numero_serie: values.numeroSerie || null,
    entretien: values.entretien || null,
    notes: values.notes || null,
  }
}

export async function listEquipments(): Promise<Equipment[]> {
  const rows = await equipmentsCrud.list()
  return rows.map(mapEquipment)
}

export async function getEquipment(id: string): Promise<Equipment> {
  const row = await equipmentsCrud.getById(id)
  return mapEquipment(row)
}

export async function createEquipment(values: EquipmentFormValues): Promise<Equipment> {
  const row = await equipmentsCrud.create(toRowInput(values))
  return mapEquipment(row)
}

export async function updateEquipment(id: string, values: EquipmentFormValues): Promise<Equipment> {
  const row = await equipmentsCrud.update(id, toRowInput(values))
  return mapEquipment(row)
}

export async function updateEquipmentStatus(id: string, statut: EquipmentStatus): Promise<Equipment> {
  const row = await equipmentsCrud.update(id, { statut })
  return mapEquipment(row)
}

export async function softDeleteEquipment(id: string): Promise<void> {
  await equipmentsCrud.softDelete(id)
}
