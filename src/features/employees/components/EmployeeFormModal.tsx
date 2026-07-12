import { Modal } from '@/components/ui/Modal'
import { useUpdateEmployee } from '../hooks/useUpdateEmployee'
import { EmployeeForm } from './EmployeeForm'
import type { Employee } from '../types/employee.types'

type EmployeeFormModalProps = {
  open: boolean
  onClose: () => void
  employee: Employee
}

export function EmployeeFormModal({ open, onClose, employee }: EmployeeFormModalProps) {
  const updateEmployee = useUpdateEmployee(employee.id)

  return (
    <Modal open={open} onClose={onClose} title="Modifier l’employé">
      <EmployeeForm
        employee={employee}
        isSubmitting={updateEmployee.isPending}
        onSubmit={(values) => updateEmployee.mutate(values, { onSuccess: onClose })}
        onCancel={onClose}
      />
    </Modal>
  )
}
