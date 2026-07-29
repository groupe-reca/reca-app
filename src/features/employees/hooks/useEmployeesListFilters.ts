import { useMemo, useState } from 'react'
import type { FilterChipOption } from '@/components/ui/FilterChips'
import type { Employee } from '../types/employee.types'

export type EmployeeStatusFilter = 'tous' | 'actif' | 'inactif'

export const EMPLOYEE_STATUS_FILTER_OPTIONS: FilterChipOption[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'actif', label: 'Actifs' },
  { id: 'inactif', label: 'Inactifs' },
]

/** Recherche + filtre par statut de la page liste Employés — état purement local, pas de nouvel appel réseau. */
export function useEmployeesListFilters(employees: Employee[] | undefined) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<EmployeeStatusFilter>('tous')

  const filtered = useMemo(() => {
    if (!employees) return []
    const term = search.trim().toLowerCase()

    return employees.filter((employee) => {
      if (statusFilter === 'actif' && !employee.actif) return false
      if (statusFilter === 'inactif' && employee.actif) return false
      if (!term) return true
      const haystack = [
        `${employee.prenom} ${employee.nom}`,
        employee.courriel ?? '',
        employee.telephone ?? '',
        employee.poste ?? '',
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(term)
    })
  }, [employees, search, statusFilter])

  return { search, setSearch, statusFilter, setStatusFilter, filtered }
}
