import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as quotesService from '../services/quotes.service'
import type { QuoteStatus } from '../types/quote.types'
import { quoteKeys } from './quoteKeys'

export function useUpdateQuoteStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (statut: QuoteStatus) => quotesService.updateQuoteStatus(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all })
      toast.success('Statut mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le statut.'),
  })
}
