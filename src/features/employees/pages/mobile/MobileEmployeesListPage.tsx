import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { MobileEmployeeLayout } from '../../components/mobile/MobileEmployeeLayout'
import { EmployeesListContent } from '../../components/EmployeesListContent'
import { useEmployees } from '../../hooks/useEmployees'

export function MobileEmployeesListPage() {
  const navigate = useNavigate()
  const { data: employees, isLoading, isError } = useEmployees()

  return (
    <MobileEmployeeLayout
      headerActions={
        <button
          type="button"
          onClick={() => navigate('/employees/new')}
          aria-label="Nouvel employé"
          className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      }
    >
      <EmployeesListContent employees={employees} isLoading={isLoading} isError={isError} showStats={false} />
    </MobileEmployeeLayout>
  )
}
