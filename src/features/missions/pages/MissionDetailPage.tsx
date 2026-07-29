import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopMissionDetailPage } from './desktop/DesktopMissionDetailPage'
import { MobileMissionDetailPage } from './mobile/MobileMissionDetailPage'

export function MissionDetailPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileMissionDetailPage /> : <DesktopMissionDetailPage />
}
