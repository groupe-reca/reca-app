import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as leadsService from '../services/leads.service'
import type { LeadStatus } from '../types/lead.types'
import { leadKeys } from './leadKeys'

export function useUpdateLeadStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (statut: LeadStatus) => leadsService.updateLeadStatus(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all })
      toast.success('Statut mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le statut.'),
  })
}
