import { useQuery } from '@tanstack/react-query'
import * as missionItemsService from '../services/missionItems.service'
import { missionKeys } from './missionKeys'

export function useMissionItems(missionId: string | undefined) {
  return useQuery({
    queryKey: missionKeys.items(missionId ?? ''),
    queryFn: () => missionItemsService.listMissionItems(missionId as string),
    enabled: Boolean(missionId),
  })
}
