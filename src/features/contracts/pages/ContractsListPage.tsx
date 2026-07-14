import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopContractsListPage } from './desktop/DesktopContractsListPage'
import { MobileContractsListPage } from './mobile/MobileContractsListPage'

export function ContractsListPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileContractsListPage /> : <DesktopContractsListPage />
}
