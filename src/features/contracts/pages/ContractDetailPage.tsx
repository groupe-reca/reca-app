import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopContractDetailPage } from './desktop/DesktopContractDetailPage'
import { MobileContractDetailPage } from './mobile/MobileContractDetailPage'

export function ContractDetailPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileContractDetailPage /> : <DesktopContractDetailPage />
}
