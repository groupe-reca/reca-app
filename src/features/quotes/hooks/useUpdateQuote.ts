import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as quotesService from '../services/quotes.service'
import type { QuoteFormValues } from '../schemas/quote.schema'
import { quoteKeys } from './quoteKeys'

export function useUpdateQuote(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: QuoteFormValues) => quotesService.updateQuote(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all })
      toast.success('Soumission mise à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour la soumission.'),
  })
}
