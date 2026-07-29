import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { EmployeeFormModal } from '../../components/EmployeeFormModal'
import { EmployeeAccountCard } from '../../components/detail/EmployeeAccountCard'
import { EmployeeDetailHeader } from '../../components/detail/EmployeeDetailHeader'
import { EmployeeEquipmentCard } from '../../components/detail/EmployeeEquipmentCard'
import { EmployeeInfoStrip } from '../../components/detail/EmployeeInfoStrip'
import { useDeleteEmployee } from '../../hooks/useDeleteEmployee'
import { useEmployee } from '../../hooks/useEmployee'

export function MobileEmployeeDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: employee, isLoading, isError } = useEmployee(id)
  const deleteEmployee = useDeleteEmployee()
  const [editOpen, setEditOpen] = useState(false)

  function handleDelete() {
    if (!employee) return
    if (!window.confirm(`Supprimer l’employé ${employee.prenom} ${employee.nom} ?`)) return
    deleteEmployee.mutate(employee.id, { onSuccess: () => navigate('/employees') })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={employee}
        errorLabel="Impossible de charger cet employé."
      >
        {(employeeData) => (
          <>
            <EmployeeDetailHeader employee={employeeData} onEdit={() => setEditOpen(true)} onDelete={handleDelete} />
            <EmployeeInfoStrip employee={employeeData} />
            {employeeData.userId && <EmployeeAccountCard userId={employeeData.userId} />}
            <EmployeeEquipmentCard employeeId={employeeData.id} />
            <EmployeeFormModal open={editOpen} onClose={() => setEditOpen(false)} employee={employeeData} />
          </>
        )}
      </QueryState>
    </div>
  )
}
