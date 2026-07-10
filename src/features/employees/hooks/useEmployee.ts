import { useQuery } from '@tanstack/react-query'
import * as employeesService from '../services/employees.service'
import { employeeKeys } from './employeeKeys'

export function useEmployee(id: string) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeesService.getEmployee(id),
    enabled: Boolean(id),
  })
}
