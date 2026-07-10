import { useQuery } from '@tanstack/react-query'
import * as equipmentsService from '../services/equipments.service'
import { equipmentKeys } from './equipmentKeys'

export function useEquipments() {
  return useQuery({
    queryKey: equipmentKeys.list(),
    queryFn: equipmentsService.listEquipments,
  })
}
