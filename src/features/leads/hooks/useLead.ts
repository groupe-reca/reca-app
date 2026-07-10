import { useQuery } from '@tanstack/react-query'
import * as leadsService from '../services/leads.service'
import { leadKeys } from './leadKeys'

export function useLead(id: string) {
  return useQuery({
    queryKey: leadKeys.detail(id),
    queryFn: () => leadsService.getLead(id),
    enabled: Boolean(id),
  })
}
