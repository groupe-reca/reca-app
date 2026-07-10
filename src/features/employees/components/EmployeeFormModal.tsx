import { Modal } from '@/components/ui/Modal'
import { useCreateEmployee } from '../hooks/useCreateEmployee'
import { useUpdateEmployee } from '../hooks/useUpdateEmployee'
import { EmployeeForm } from './EmployeeForm'
import type { EmployeeFormValues } from '../schemas/employee.schema'
import type { Employee } from '../types/employee.types'

type EmployeeFormModalProps = {
  open: boolean
  onClose: () => void
  employee?: Employee
}

export function EmployeeFormModal({ open, onClose, employee }: EmployeeFormModalProps) {
  const createEmployee = useCreateEmployee()
  const updateEmployee = useUpdateEmployee(employee?.id ?? '')
  const isEditing = Boolean(employee)

  function handleSubmit(values: EmployeeFormValues) {
    if (isEditing && employee) {
      updateEmployee.mutate(values, { onSuccess: onClose })
    } else {
      createEmployee.mutate(values, { onSuccess: onClose })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Modifier l’employé' : 'Nouvel employé'}>
      <EmployeeForm
        employee={employee}
        isSubmitting={isEditing ? updateEmployee.isPending : createEmployee.isPending}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}
