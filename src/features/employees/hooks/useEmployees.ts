import { useQuery } from '@tanstack/react-query'
import * as employeesService from '../services/employees.service'
import { employeeKeys } from './employeeKeys'

export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.list(),
    queryFn: employeesService.listEmployees,
  })
}
