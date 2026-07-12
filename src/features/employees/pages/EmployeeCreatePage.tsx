import { useNavigate } from 'react-router'
import { Card } from '@/components/ui/Card'
import { EmployeeForm } from '../components/EmployeeForm'
import { useCreateEmployee } from '../hooks/useCreateEmployee'

export function EmployeeCreatePage() {
  const navigate = useNavigate()
  const createEmployee = useCreateEmployee()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Nouvel employé</h1>
        <p className="text-body text-reca-gray-medium">Ajoutez un membre à l’équipe de Groupe RECA.</p>
      </div>

      <Card>
        <EmployeeForm
          isSubmitting={createEmployee.isPending}
          onSubmit={(values) =>
            createEmployee.mutate(values, { onSuccess: (created) => navigate(`/employees/${created.id}`) })
          }
          onCancel={() => navigate('/employees')}
        />
      </Card>
    </div>
  )
}
