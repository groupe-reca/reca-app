import { CalendarDays, MapPin, Search, Truck, User } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FilterChips } from '@/components/ui/FilterChips'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Select } from '@/components/ui/Select'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { useEquipments } from '@/features/equipments/hooks/useEquipments'
import { useRoutes } from '@/features/routes/hooks/useRoutes'
import { MissionCard } from './MissionCard'
import { MISSION_STATUS_FILTER_OPTIONS, useMissionsListFilters } from '../hooks/useMissionsListFilters'
import type { MissionStatusFilter } from '../hooks/useMissionsListFilters'
import type { MissionSummary } from '../types/mission.types'

type MissionsListContentProps = {
  missions: MissionSummary[] | undefined
  isLoading: boolean
  isError: boolean
}

export function MissionsListContent({ missions, isLoading, isError }: MissionsListContentProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={missions}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucune mission pour le moment."
      errorLabel="Impossible de charger les missions."
    >
      {(data) => (
        <MissionsListBody missions={data} onSelect={(mission) => navigate(`/missions/${mission.id}`)} />
      )}
    </QueryState>
  )
}

function MissionsListBody({
  missions,
  onSelect,
}: {
  missions: MissionSummary[]
  onSelect: (mission: MissionSummary) => void
}) {
  const { data: routes } = useRoutes()
  const { data: employees } = useEmployees()
  const { data: equipments } = useEquipments()

  const {
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
  } = useMissionsListFilters(missions)

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Route, opérateur, équipement…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          type="date"
          label="Date"
          icon={CalendarDays}
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
        />
        <Select label="Route" icon={MapPin} value={routeFilter} onChange={(event) => setRouteFilter(event.target.value)}>
          <option value="">Toutes les routes</option>
          {routes?.map((route) => (
            <option key={route.id} value={route.id}>
              {route.nom}
            </option>
          ))}
        </Select>
        <Select
          label="Opérateur"
          icon={User}
          value={operatorFilter}
          onChange={(event) => setOperatorFilter(event.target.value)}
        >
          <option value="">Tous les opérateurs</option>
          {employees?.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.prenom} {employee.nom}
            </option>
          ))}
        </Select>
        <Select
          label="Équipement"
          icon={Truck}
          value={equipmentFilter}
          onChange={(event) => setEquipmentFilter(event.target.value)}
        >
          <option value="">Tous les équipements</option>
          {equipments?.map((equipment) => (
            <option key={equipment.id} value={equipment.id}>
              {equipment.nom}
            </option>
          ))}
        </Select>
      </div>

      <FilterChips
        options={MISSION_STATUS_FILTER_OPTIONS}
        activeId={statusFilter}
        onChange={(id) => setStatusFilter(id as MissionStatusFilter)}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
          Aucune mission ne correspond à ces filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onClick={() => onSelect(mission)} />
          ))}
        </div>
      )}
    </div>
  )
}
