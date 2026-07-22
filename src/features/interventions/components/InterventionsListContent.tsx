import { CalendarDays, Route as RouteIcon, Search, Truck, User } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FilterChips } from '@/components/ui/FilterChips'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Select } from '@/components/ui/Select'
import { useEmployees } from '@/features/employees/hooks/useEmployees'
import { useEquipments } from '@/features/equipments/hooks/useEquipments'
import { useRoutes } from '@/features/routes/hooks/useRoutes'
import { InterventionCard } from './InterventionCard'
import { InterventionsStatsRow } from './InterventionsStatsRow'
import {
  INTERVENTION_STATUS_FILTER_OPTIONS,
  useInterventionsListFilters,
} from '../hooks/useInterventionsListFilters'
import type { InterventionStatusFilter } from '../hooks/useInterventionsListFilters'
import type { Intervention } from '../types/intervention.types'

type InterventionsListContentProps = {
  interventions: Intervention[] | undefined
  isLoading: boolean
  isError: boolean
}

export function InterventionsListContent({ interventions, isLoading, isError }: InterventionsListContentProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={interventions}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucune intervention pour le moment."
      errorLabel="Impossible de charger les interventions."
    >
      {(data) => (
        <InterventionsListBody
          interventions={data}
          onSelect={(intervention) => navigate(`/interventions/${intervention.id}`)}
        />
      )}
    </QueryState>
  )
}

function InterventionsListBody({
  interventions,
  onSelect,
}: {
  interventions: Intervention[]
  onSelect: (intervention: Intervention) => void
}) {
  const { data: employees } = useEmployees()
  const { data: equipments } = useEquipments()
  const { data: routes } = useRoutes()

  const {
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
  } = useInterventionsListFilters(interventions)

  return (
    <div className="flex flex-col gap-4">
      <InterventionsStatsRow interventions={interventions} />

      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Numéro, route, employé, équipement…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          label="Date"
          type="date"
          icon={CalendarDays}
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
        />
        <Select
          label="Employé"
          icon={User}
          value={employeeFilter}
          onChange={(event) => setEmployeeFilter(event.target.value)}
        >
          <option value="tous">Tous</option>
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
          <option value="tous">Tous</option>
          {equipments?.map((equipment) => (
            <option key={equipment.id} value={equipment.id}>
              {equipment.numero} — {equipment.nom}
            </option>
          ))}
        </Select>
        <div className="sm:col-span-3">
          <Select
            label="Route"
            icon={RouteIcon}
            value={routeFilter}
            onChange={(event) => setRouteFilter(event.target.value)}
          >
            <option value="tous">Toutes</option>
            {routes?.map((route) => (
              <option key={route.id} value={route.id}>
                {route.numero} — {route.nom}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <FilterChips
        options={INTERVENTION_STATUS_FILTER_OPTIONS}
        activeId={statusFilter}
        onChange={(id) => setStatusFilter(id as InterventionStatusFilter)}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
          Aucune intervention ne correspond à ces filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((intervention) => (
            <InterventionCard key={intervention.id} intervention={intervention} onClick={() => onSelect(intervention)} />
          ))}
        </div>
      )}
    </div>
  )
}
