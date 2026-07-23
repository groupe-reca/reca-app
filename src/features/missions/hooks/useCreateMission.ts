import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/stores/toastStore'
import { createMission } from '../services/missions.service'
import { copyActiveContractsToMission } from '../services/missionItems.service'
import { createMissionEvent } from '../services/missionEvents.service'
import type { MissionFormValues } from '../schemas/mission.schema'
import { missionKeys } from './missionKeys'

async function createMissionWithItems(values: MissionFormValues) {
  const mission = await createMission(values)
  await copyActiveContractsToMission(mission.id, values.routeId)
  await createMissionEvent(mission.id, 'mission_creee')
  return mission
}

export function useCreateMission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMissionWithItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: missionKeys.all })
      toast.success('Mission créée.')
    },
    onError: () => toast.error('Impossible de créer la mission.'),
  })
}
