import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopInvoiceDetailPage } from './desktop/DesktopInvoiceDetailPage'
import { MobileInvoiceDetailPage } from './mobile/MobileInvoiceDetailPage'

export function InvoiceDetailPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileInvoiceDetailPage /> : <DesktopInvoiceDetailPage />
}
