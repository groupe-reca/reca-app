import { useQuery } from '@tanstack/react-query'
import * as quotesService from '../services/quotes.service'
import { quoteKeys } from './quoteKeys'

export function useQuotes() {
  return useQuery({
    queryKey: quoteKeys.list(),
    queryFn: quotesService.listQuotes,
  })
}
