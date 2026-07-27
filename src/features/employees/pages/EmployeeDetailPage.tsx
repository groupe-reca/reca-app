import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopEmployeeDetailPage } from './desktop/DesktopEmployeeDetailPage'
import { MobileEmployeeDetailPage } from './mobile/MobileEmployeeDetailPage'

export function EmployeeDetailPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileEmployeeDetailPage /> : <DesktopEmployeeDetailPage />
}
