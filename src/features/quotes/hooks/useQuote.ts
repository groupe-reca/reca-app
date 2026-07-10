import { useQuery } from '@tanstack/react-query'
import * as quotesService from '../services/quotes.service'
import { quoteKeys } from './quoteKeys'

export function useQuote(id: string) {
  return useQuery({
    queryKey: quoteKeys.detail(id),
    queryFn: () => quotesService.getQuote(id),
    enabled: Boolean(id),
  })
}
