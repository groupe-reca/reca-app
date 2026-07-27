import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FilterChips } from '@/components/ui/FilterChips'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { EmployeeCard } from './EmployeeCard'
import { EmployeesStatsRow } from './EmployeesStatsRow'
import { EMPLOYEE_STATUS_FILTER_OPTIONS, useEmployeesListFilters } from '../hooks/useEmployeesListFilters'
import type { EmployeeStatusFilter } from '../hooks/useEmployeesListFilters'
import type { Employee } from '../types/employee.types'

type EmployeesListContentProps = {
  employees: Employee[] | undefined
  isLoading: boolean
  isError: boolean
  showStats?: boolean
}

export function EmployeesListContent({
  employees,
  isLoading,
  isError,
  showStats = true,
}: EmployeesListContentProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={employees}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun employé pour le moment."
      errorLabel="Impossible de charger les employés."
    >
      {(data) => (
        <EmployeesListBody
          employees={data}
          showStats={showStats}
          onSelect={(employee) => navigate(`/employees/${employee.id}`)}
        />
      )}
    </QueryState>
  )
}

function EmployeesListBody({
  employees,
  showStats,
  onSelect,
}: {
  employees: Employee[]
  showStats: boolean
  onSelect: (employee: Employee) => void
}) {
  const { search, setSearch, statusFilter, setStatusFilter, filtered } = useEmployeesListFilters(employees)

  return (
    <div className="flex flex-col gap-4">
      {showStats && <EmployeesStatsRow employees={employees} />}

      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Nom, courriel, téléphone…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <FilterChips
        options={EMPLOYEE_STATUS_FILTER_OPTIONS}
        activeId={statusFilter}
        onChange={(id) => setStatusFilter(id as EmployeeStatusFilter)}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
          Aucun employé ne correspond à ces filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} onClick={() => onSelect(employee)} />
          ))}
        </div>
      )}
    </div>
  )
}
