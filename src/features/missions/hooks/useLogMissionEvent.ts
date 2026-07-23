import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as missionEventsService from '../services/missionEvents.service'
import type { MissionEventPayload, MissionEventType } from '../types/missionEvent.types'
import { missionKeys } from './missionKeys'

/**
 * Journal best-effort (mirror `useLogContractEvent`) — utilisé directement par les boutons
 * Pause/Reprise, qui ne changent jamais le `statut` de la Mission (voir décision dans le plan :
 * Pause/Reprise sont de simples entrées d'historique, pas des états).
 */
export function useLogMissionEvent(missionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, payload }: { type: MissionEventType; payload?: MissionEventPayload }) =>
      missionEventsService.createMissionEvent(missionId, type, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionKeys.events(missionId) })
    },
  })
}
