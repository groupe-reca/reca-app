import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { EmployeeFormModal } from '../components/EmployeeFormModal'
import { EmployeeTable } from '../components/EmployeeTable'
import { useEmployees } from '../hooks/useEmployees'

export function EmployeesListPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: employees, isLoading, isError } = useEmployees()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Employés</h1>
          <p className="text-body text-reca-gray-medium">Équipe de Groupe RECA.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Nouvel employé
        </Button>
      </div>

      <EmployeeTable employees={employees} isLoading={isLoading} isError={isError} />

      <EmployeeFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
