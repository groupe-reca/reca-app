import { useQuery } from '@tanstack/react-query'
import * as employeeEquipmentService from '../services/employeeEquipment.service'
import { employeeKeys } from './employeeKeys'

export function useEmployeeEquipment(employeeId: string) {
  return useQuery({
    queryKey: employeeKeys.equipment(employeeId),
    queryFn: () => employeeEquipmentService.listAssignedEquipment(employeeId),
    enabled: Boolean(employeeId),
  })
}
