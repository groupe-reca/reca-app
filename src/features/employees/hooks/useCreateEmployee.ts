import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as employeesService from '../services/employees.service'
import { employeeKeys } from './employeeKeys'

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: employeesService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      toast.success('Employé créé.')
    },
    onError: () => toast.error('Impossible de créer l’employé.'),
  })
}
