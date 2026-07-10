import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as employeesService from '../services/employees.service'
import type { EmployeeFormValues } from '../schemas/employee.schema'
import { employeeKeys } from './employeeKeys'

export function useUpdateEmployee(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: EmployeeFormValues) => employeesService.updateEmployee(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      toast.success('Employé mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour l’employé.'),
  })
}
