import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as quotesService from '../services/quotes.service'
import { quoteKeys } from './quoteKeys'

export function useDeleteQuote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: quotesService.softDeleteQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.all })
      toast.success('Soumission supprimée.')
    },
    onError: () => toast.error('Impossible de supprimer la soumission.'),
  })
}
