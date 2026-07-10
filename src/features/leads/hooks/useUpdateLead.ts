import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as leadsService from '../services/leads.service'
import type { LeadFormValues } from '../schemas/lead.schema'
import { leadKeys } from './leadKeys'

export function useUpdateLead(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: LeadFormValues) => leadsService.updateLead(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all })
      toast.success('Lead mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le lead.'),
  })
}
