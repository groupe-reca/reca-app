import { useQuery } from '@tanstack/react-query'
import * as missionsService from '../services/missions.service'
import { missionKeys } from './missionKeys'

export function useMissions() {
  return useQuery({
    queryKey: missionKeys.list(),
    queryFn: missionsService.listMissionsSummary,
  })
}
