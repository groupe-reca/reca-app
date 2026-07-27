import { useDeviceTier } from '@/hooks/useDeviceTier'
import { DesktopQuoteDetailPage } from './desktop/DesktopQuoteDetailPage'
import { MobileQuoteDetailPage } from './mobile/MobileQuoteDetailPage'

export function QuoteDetailPage() {
  const tier = useDeviceTier()
  return tier === 'mobile' ? <MobileQuoteDetailPage /> : <DesktopQuoteDetailPage />
}
