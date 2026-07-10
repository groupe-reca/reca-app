import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as quotesService from '../services/quotes.service'
import { quoteKeys } from './quoteKeys'

export function useConvertQuoteToClient(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (clientId: string) => quotesService.convertQuoteToClient(id, clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all })
      toast.success('Soumission liée au client.')
    },
    onError: () => toast.error('Impossible de lier le client à la soumission.'),
  })
}
