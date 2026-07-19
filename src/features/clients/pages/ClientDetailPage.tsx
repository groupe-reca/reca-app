import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopClientDetailPage } from './desktop/DesktopClientDetailPage'
import { MobileClientDetailPage } from './mobile/MobileClientDetailPage'

export function ClientDetailPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileClientDetailPage /> : <DesktopClientDetailPage />
}
