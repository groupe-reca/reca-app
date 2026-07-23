import { useQuery } from '@tanstack/react-query'
import * as missionsService from '../services/missions.service'
import { missionKeys } from './missionKeys'

export function useMission(id: string | undefined) {
  return useQuery({
    queryKey: missionKeys.detail(id ?? ''),
    queryFn: () => missionsService.getMission(id as string),
    enabled: Boolean(id),
  })
}
