import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopLeadDetailPage } from './desktop/DesktopLeadDetailPage'
import { MobileLeadDetailPage } from './mobile/MobileLeadDetailPage'

export function LeadDetailPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileLeadDetailPage /> : <DesktopLeadDetailPage />
}
