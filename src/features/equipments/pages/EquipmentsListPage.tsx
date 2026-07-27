import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopEquipmentsListPage } from './desktop/DesktopEquipmentsListPage'
import { MobileEquipmentsListPage } from './mobile/MobileEquipmentsListPage'

export function EquipmentsListPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileEquipmentsListPage /> : <DesktopEquipmentsListPage />
}
