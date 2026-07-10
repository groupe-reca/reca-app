import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as leadsService from '../services/leads.service'
import { leadKeys } from './leadKeys'

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadsService.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all })
      toast.success('Lead créé.')
    },
    onError: () => toast.error('Impossible de créer le lead.'),
  })
}
