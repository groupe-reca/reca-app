import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as leadsService from '../services/leads.service'
import { leadKeys } from './leadKeys'

export function useDeleteLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadsService.softDeleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all })
      toast.success('Lead supprimé.')
    },
    onError: () => toast.error('Impossible de supprimer le lead.'),
  })
}
