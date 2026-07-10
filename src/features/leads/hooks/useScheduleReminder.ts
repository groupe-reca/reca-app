import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as leadsService from '../services/leads.service'
import { leadKeys } from './leadKeys'

export function useScheduleReminder(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ rappelLe, rappelNote }: { rappelLe: string; rappelNote: string }) =>
      leadsService.scheduleReminder(id, rappelLe, rappelNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all })
      toast.success('Rappel planifié.')
    },
    onError: () => toast.error('Impossible de planifier le rappel.'),
  })
}
