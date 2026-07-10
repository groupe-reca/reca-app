import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as routeAssignmentsService from '../services/routeAssignments.service'
import { routeKeys } from './routeKeys'

type CreateArgs = { employeeId: string; date: string; equipmentId?: string }

export function useCreateRouteAssignment(routeId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ employeeId, date, equipmentId }: CreateArgs) =>
      routeAssignmentsService.createAssignment(routeId, employeeId, date, equipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: routeKeys.assignments(routeId) })
      toast.success('Assignation créée.')
    },
    onError: () => toast.error('Impossible de créer l’assignation.'),
  })
}
