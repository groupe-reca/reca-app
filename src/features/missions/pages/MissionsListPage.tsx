import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopMissionsListPage } from './desktop/DesktopMissionsListPage'
import { MobileMissionsListPage } from './mobile/MobileMissionsListPage'

export function MissionsListPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileMissionsListPage /> : <DesktopMissionsListPage />
}
