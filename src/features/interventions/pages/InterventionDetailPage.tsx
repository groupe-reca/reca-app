import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopInterventionDetailPage } from './desktop/DesktopInterventionDetailPage'
import { MobileInterventionDetailPage } from './mobile/MobileInterventionDetailPage'

export function InterventionDetailPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileInterventionDetailPage /> : <DesktopInterventionDetailPage />
}
