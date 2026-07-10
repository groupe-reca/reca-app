import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routeAssignmentsService from '../services/routeAssignments.service'
import type { AssignmentStatus } from '../services/routeAssignments.service'
import { routeKeys } from './routeKeys'

export function useUpdateAssignmentStatus(routeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: AssignmentStatus }) =>
      routeAssignmentsService.updateAssignmentStatus(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.assignments(routeId) })
      toast.success('Statut mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le statut.'),
  })
}
