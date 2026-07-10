import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { Table } from '@/components/ui/Table'
import type { TableColumn } from '@/components/ui/Table'
import { useTableState } from '@/components/ui/useTableState'
import type { Employee } from '../types/employee.types'

type EmployeeTableProps = {
  employees: Employee[] | undefined
  isLoading: boolean
  isError: boolean
}

export function EmployeeTable({ employees, isLoading, isError }: EmployeeTableProps) {
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
        <EmployeeTableContent
          employees={data}
          onRowClick={(employee) => navigate(`/employees/${employee.id}`)}
        />
      )}
    </QueryState>
  )
}

function EmployeeTableContent({
  employees,
  onRowClick,
}: {
  employees: Employee[]
  onRowClick: (employee: Employee) => void
}) {
  const { search, setSearch, sort, toggleSort, rows } = useTableState({
    data: employees,
    searchableFields: ['prenom', 'nom', 'courriel', 'telephone', 'poste'],
  })

  const columns: TableColumn<Employee>[] = [
    { key: 'nom', header: 'Nom', sortable: true, render: (employee) => `${employee.prenom} ${employee.nom}` },
    { key: 'poste', header: 'Poste', render: (employee) => employee.poste ?? '—' },
    { key: 'telephone', header: 'Téléphone', render: (employee) => employee.telephone ?? '—' },
    {
      key: 'actif',
      header: 'Statut',
      render: (employee) => (
        <Badge color={employee.actif ? 'green' : 'gray'}>{employee.actif ? 'Actif' : 'Inactif'}</Badge>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Nom, courriel, téléphone..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />
      <Table
        columns={columns}
        rows={rows}
        rowKey={(employee) => employee.id}
        onRowClick={onRowClick}
        sort={sort}
        onSortChange={toggleSort}
      />
    </div>
  )
}
