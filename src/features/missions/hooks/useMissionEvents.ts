import { useQuery } from '@tanstack/react-query'
import * as missionEventsService from '../services/missionEvents.service'
import { missionKeys } from './missionKeys'

export function useMissionEvents(missionId: string) {
  return useQuery({
    queryKey: missionKeys.events(missionId),
    queryFn: () => missionEventsService.listMissionEvents(missionId),
    enabled: Boolean(missionId),
  })
}
