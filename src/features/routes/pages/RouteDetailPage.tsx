import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopRouteDetailPage } from './desktop/DesktopRouteDetailPage'
import { MobileRouteDetailPage } from './mobile/MobileRouteDetailPage'

export function RouteDetailPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileRouteDetailPage /> : <DesktopRouteDetailPage />
}
