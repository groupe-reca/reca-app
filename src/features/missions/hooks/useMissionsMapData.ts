import { useQuery } from '@tanstack/react-query'
import * as missionsMapService from '../services/missionsMap.service'
import { missionKeys } from './missionKeys'

export function useMissionsMapData(missionId: string | undefined) {
  return useQuery({
    queryKey: missionKeys.mapData(missionId ?? ''),
    queryFn: () => missionsMapService.getMissionMapData(missionId as string),
    enabled: Boolean(missionId),
  })
}
