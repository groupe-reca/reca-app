import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import * as missionItemsService from '../services/missionItems.service'
import type { MissionItemStatus } from '../types/missionItem.types'
import { missionKeys } from './missionKeys'

export function useUpdateMissionItemStatus(missionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, statut }: { id: string; statut: MissionItemStatus }) =>
      missionItemsService.updateMissionItemStatus(id, statut),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionKeys.items(missionId) })
      queryClient.invalidateQueries({ queryKey: missionKeys.detail(missionId) })
      queryClient.invalidateQueries({ queryKey: missionKeys.mapData(missionId) })
      queryClient.invalidateQueries({ queryKey: missionKeys.list() })
    },
    onError: () => toast.error('Impossible de mettre à jour le statut du contrat.'),
  })
}
