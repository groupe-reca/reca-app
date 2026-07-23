import { useMemo, useState } from 'react'
import type { FilterChipOption } from '@/components/ui/FilterChips'
import { MISSION_STATUS_LABELS } from '../types/mission.types'
import type { MissionStatus, MissionSummary } from '../types/mission.types'

export type MissionStatusFilter = 'tous' | MissionStatus

export const MISSION_STATUS_FILTER_OPTIONS: FilterChipOption[] = [
  { id: 'tous', label: 'Tous' },
  ...Object.entries(MISSION_STATUS_LABELS).map(([id, label]) => ({ id, label })),
]

/**
 * Filtres multi-dimension (Date/Statut/Route/Opérateur/Équipement) + recherche de la page liste
 * Missions — état 100% local, aucun refetch réseau, même architecture que
 * `useContractsListFilters` étendue à plusieurs dimensions simultanées.
 */
export function useMissionsListFilters(missions: MissionSummary[] | undefined) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<MissionStatusFilter>('tous')
  const [routeFilter, setRouteFilter] = useState('')
  const [operatorFilter, setOperatorFilter] = useState('')
  const [equipmentFilter, setEquipmentFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const filtered = useMemo(() => {
    if (!missions) return []
    const term = search.trim().toLowerCase()

    return missions.filter((mission) => {
      if (statusFilter !== 'tous' && mission.statut !== statusFilter) return false
      if (routeFilter && mission.routeId !== routeFilter) return false
      if (operatorFilter && mission.operatorId !== operatorFilter) return false
      if (equipmentFilter && mission.equipmentId !== equipmentFilter) return false
      if (dateFilter && mission.date !== dateFilter) return false
      if (!term) return true
      const haystack = [mission.routeName, mission.operatorName ?? '', mission.equipmentName ?? '']
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [missions, search, statusFilter, routeFilter, operatorFilter, equipmentFilter, dateFilter])

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    routeFilter,
    setRouteFilter,
    operatorFilter,
    setOperatorFilter,
    equipmentFilter,
    setEquipmentFilter,
    dateFilter,
    setDateFilter,
    filtered,
  }
}
