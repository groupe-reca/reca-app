import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopLeadsListPage } from './desktop/DesktopLeadsListPage'
import { MobileLeadsListPage } from './mobile/MobileLeadsListPage'

export function LeadsListPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileLeadsListPage /> : <DesktopLeadsListPage />
}
