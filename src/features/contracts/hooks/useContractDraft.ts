import { useQueries } from '@tanstack/react-query'
import * as contractsService from '../services/contracts.service'
import { contractKeys } from './contractKeys'

/**
 * Charge un brouillon existant (contrat + zones + photos) pour la reprise éditable
 * du Wizard (`?draftId=`, sprint014). `contractId` vide = aucune reprise en cours
 * (les 3 requêtes restent désactivées, comme `useClient`/`useContract` avec un id vide).
 */
export function useContractDraft(contractId: string) {
  const enabled = Boolean(contractId)

  const [contractQuery, zonesQuery, photosQuery] = useQueries({
    queries: [
      {
        queryKey: contractKeys.detail(contractId),
        queryFn: () => contractsService.getContract(contractId),
        enabled,
      },
      {
        queryKey: contractKeys.zones(contractId),
        queryFn: () => contractsService.listContractZones(contractId),
        enabled,
      },
      {
        queryKey: contractKeys.photos(contractId),
        queryFn: () => contractsService.listContractPhotos(contractId),
        enabled,
      },
    ],
  })

  return {
    contract: contractQuery.data,
    zones: zonesQuery.data,
    photos: photosQuery.data,
    isLoading: enabled && (contractQuery.isLoading || zonesQuery.isLoading || photosQuery.isLoading),
    isError: enabled && (contractQuery.isError || zonesQuery.isError || photosQuery.isError),
  }
}
