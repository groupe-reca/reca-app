import { useQuery } from '@tanstack/react-query'
import * as missionNotesService from '../services/missionNotes.service'
import { missionKeys } from './missionKeys'

export function useMissionNotes(missionId: string) {
  return useQuery({
    queryKey: missionKeys.notes(missionId),
    queryFn: () => missionNotesService.listMissionNotes(missionId),
    enabled: Boolean(missionId),
  })
}
