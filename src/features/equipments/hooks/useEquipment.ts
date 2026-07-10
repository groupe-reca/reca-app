import { useQuery } from '@tanstack/react-query'
import * as equipmentsService from '../services/equipments.service'
import { equipmentKeys } from './equipmentKeys'

export function useEquipment(id: string) {
  return useQuery({
    queryKey: equipmentKeys.detail(id),
    queryFn: () => equipmentsService.getEquipment(id),
    enabled: Boolean(id),
  })
}
