import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as missionsService from '../services/missions.service'
import type { MissionStatus } from '../types/mission.types'
import { missionKeys } from './missionKeys'

export function useUpdateMissionStatus(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ statut, force }: { statut: MissionStatus; force?: boolean }) =>
      missionsService.updateMissionStatus(id, statut, { force }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: missionKeys.list() })
      queryClient.invalidateQueries({ queryKey: missionKeys.events(id) })
      toast.success('Statut de la mission mis à jour.')
    },
    onError: () => toast.error('Impossible de mettre à jour le statut de la mission.'),
  })
}
