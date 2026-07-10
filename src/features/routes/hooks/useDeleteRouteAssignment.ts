import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routeAssignmentsService from '../services/routeAssignments.service'
import { routeKeys } from './routeKeys'

export function useDeleteRouteAssignment(routeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => routeAssignmentsService.deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.assignments(routeId) })
      toast.success('Assignation supprimée.')
    },
    onError: () => toast.error('Impossible de supprimer l’assignation.'),
  })
}
