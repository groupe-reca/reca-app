import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopQuotesListPage } from './desktop/DesktopQuotesListPage'
import { MobileQuotesListPage } from './mobile/MobileQuotesListPage'

export function QuotesListPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileQuotesListPage /> : <DesktopQuotesListPage />
}
