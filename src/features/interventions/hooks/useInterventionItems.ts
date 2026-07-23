import { useQuery } from '@tanstack/react-query'
import * as interventionItemsService from '../services/interventionItems.service'
import { interventionKeys } from './interventionKeys'

export function useInterventionItems(interventionId: string) {
  return useQuery({
    queryKey: interventionKeys.items(interventionId),
    queryFn: () => interventionItemsService.listInterventionItems(interventionId),
    enabled: Boolean(interventionId),
  })
}
