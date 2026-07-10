import { useQuery } from '@tanstack/react-query'
import * as leadsService from '../services/leads.service'
import { leadKeys } from './leadKeys'

export function useLeads() {
  return useQuery({
    queryKey: leadKeys.list(),
    queryFn: leadsService.listLeads,
  })
}
