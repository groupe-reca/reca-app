import { useMemo, useState } from 'react'
import type { FilterChipOption } from '@/components/ui/FilterChips'
import type { Equipment, EquipmentStatus } from '../types/equipment.types'

export type EquipmentStatusFilter = 'tous' | EquipmentStatus

export const EQUIPMENT_STATUS_FILTER_OPTIONS: FilterChipOption[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'disponible', label: 'Disponibles' },
  { id: 'en_operation', label: 'En opération' },
  { id: 'entretien', label: 'Entretien' },
  { id: 'brise', label: 'Brisés' },
]

/** Recherche + filtre par statut de la page liste Équipements — état purement local, pas de nouvel appel réseau. */
export function useEquipmentsListFilters(equipments: Equipment[] | undefined) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<EquipmentStatusFilter>('tous')

  const filtered = useMemo(() => {
    if (!equipments) return []
    const term = search.trim().toLowerCase()

    return equipments.filter((equipment) => {
      if (statusFilter !== 'tous' && equipment.statut !== statusFilter) return false
      if (!term) return true
      const haystack = [
        equipment.numero,
        equipment.nom,
        equipment.categorie ?? '',
        equipment.marque ?? '',
        equipment.modele ?? '',
        equipment.plaque ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [equipments, search, statusFilter])

  return { search, setSearch, statusFilter, setStatusFilter, filtered }
}
