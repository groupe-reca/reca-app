import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as employeesService from '../services/employees.service'
import { employeeKeys } from './employeeKeys'

export function useDeleteEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: employeesService.softDeleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      toast.success('Employé supprimé.')
    },
    onError: () => toast.error('Impossible de supprimer l’employé.'),
  })
}
