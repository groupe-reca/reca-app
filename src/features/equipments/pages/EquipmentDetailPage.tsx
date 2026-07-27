import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopEquipmentDetailPage } from './desktop/DesktopEquipmentDetailPage'
import { MobileEquipmentDetailPage } from './mobile/MobileEquipmentDetailPage'

export function EquipmentDetailPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileEquipmentDetailPage /> : <DesktopEquipmentDetailPage />
}
