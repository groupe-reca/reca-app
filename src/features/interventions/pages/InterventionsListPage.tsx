import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopInterventionsListPage } from './desktop/DesktopInterventionsListPage'
import { MobileInterventionsListPage } from './mobile/MobileInterventionsListPage'

export function InterventionsListPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileInterventionsListPage /> : <DesktopInterventionsListPage />
}
