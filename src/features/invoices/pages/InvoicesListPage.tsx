import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopInvoicesListPage } from './desktop/DesktopInvoicesListPage'
import { MobileInvoicesListPage } from './mobile/MobileInvoicesListPage'

export function InvoicesListPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileInvoicesListPage /> : <DesktopInvoicesListPage />
}
