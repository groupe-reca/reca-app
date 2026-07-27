import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopEmployeesListPage } from './desktop/DesktopEmployeesListPage'
import { MobileEmployeesListPage } from './mobile/MobileEmployeesListPage'

export function EmployeesListPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileEmployeesListPage /> : <DesktopEmployeesListPage />
}
