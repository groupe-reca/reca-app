import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopClientsListPage } from './desktop/DesktopClientsListPage'
import { MobileClientsListPage } from './mobile/MobileClientsListPage'

export function ClientsListPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileClientsListPage /> : <DesktopClientsListPage />
}
