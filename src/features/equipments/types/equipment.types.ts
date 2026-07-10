export type EquipmentStatus = 'disponible' | 'en_operation' | 'entretien' | 'brise'

export const EQUIPMENT_STATUSES: EquipmentStatus[] = ['disponible', 'en_operation', 'entretien', 'brise']

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  disponible: 'Disponible',
  en_operation: 'En opération',
  entretien: 'Entretien',
  brise: 'Brisé',
}

export const EQUIPMENT_CATEGORIES = [
  'Camions',
  'Tracteurs',
  'Chargeuses',
  'Souffleuses',
  'Saleuses',
  'Remorques',
] as const

export type EquipmentRow = {
  id: string
  numero: string
  nom: string
  categorie: string | null
  marque: string | null
  modele: string | null
  annee: number | null
  plaque: string | null
  numero_serie: string | null
  statut: EquipmentStatus
  entretien: string | null
  notes: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type Equipment = {
  id: string
  numero: string
  nom: string
  categorie: string | null
  marque: string | null
  modele: string | null
  annee: number | null
  plaque: string | null
  numeroSerie: string | null
  statut: EquipmentStatus
  entretien: string | null
  notes: string | null
  createdAt: string
}
