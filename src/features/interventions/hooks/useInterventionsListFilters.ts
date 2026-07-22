import { useMemo, useState } from 'react'
import type { FilterChipOption } from '@/components/ui/FilterChips'
import { INTERVENTION_STATUS_LABELS } from '../types/intervention.types'
import type { Intervention, InterventionStatus } from '../types/intervention.types'

export type InterventionStatusFilter = 'tous' | InterventionStatus

const ALL = 'tous'

export const INTERVENTION_STATUS_FILTER_OPTIONS: FilterChipOption[] = [
  { id: ALL, label: 'Tous' },
  ...Object.entries(INTERVENTION_STATUS_LABELS).map(([id, label]) => ({ id, label })),
]

/** Recherche + filtres (Statut/Date/Employé/Équipement/Route) de la page liste Interventions — état purement local, pas de nouvel appel réseau. */
export function useInterventionsListFilters(interventions: Intervention[] | undefined) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<InterventionStatusFilter>(ALL)
  const [dateFilter, setDateFilter] = useState('')
  const [employeeFilter, setEmployeeFilter] = useState(ALL)
  const [equipmentFilter, setEquipmentFilter] = useState(ALL)
  const [routeFilter, setRouteFilter] = useState(ALL)

  const filtered = useMemo(() => {
    if (!interventions) return []
    const term = search.trim().toLowerCase()

    return interventions.filter((intervention) => {
      if (statusFilter !== ALL && intervention.statut !== statusFilter) return false
      if (dateFilter && intervention.date !== dateFilter) return false
      if (employeeFilter !== ALL && intervention.employeeId !== employeeFilter) return false
      if (equipmentFilter !== ALL && intervention.equipmentId !== equipmentFilter) return false
      if (routeFilter !== ALL && intervention.routeId !== routeFilter) return false
      if (!term) return true
      const haystack = [
        intervention.numero,
        intervention.route?.nom ?? '',
        intervention.employee ? `${intervention.employee.prenom} ${intervention.employee.nom}` : '',
        intervention.equipment ? `${intervention.equipment.numero} ${intervention.equipment.nom}` : '',
        intervention.date,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [interventions, search, statusFilter, dateFilter, employeeFilter, equipmentFilter, routeFilter])

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    employeeFilter,
    setEmployeeFilter,
    equipmentFilter,
    setEquipmentFilter,
    routeFilter,
    setRouteFilter,
    filtered,
  }
}
