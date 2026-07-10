import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as quotesService from '../services/quotes.service'
import type { QuoteFormValues } from '../schemas/quote.schema'
import { quoteKeys } from './quoteKeys'

export function useCreateQuote(leadId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: QuoteFormValues) => quotesService.createQuote(values, leadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all })
      toast.success('Soumission créée.')
    },
    onError: () => toast.error('Impossible de créer la soumission.'),
  })
}
