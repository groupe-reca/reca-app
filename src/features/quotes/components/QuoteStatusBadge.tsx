import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeColor } from '@/components/ui/Badge'
import { QUOTE_STATUS_LABELS } from '../types/quote.types'
import type { QuoteStatus } from '../types/quote.types'

const QUOTE_STATUS_COLORS: Record<QuoteStatus, BadgeColor> = {
  brouillon: 'gray',
  envoyee: 'blue',
  acceptee: 'green',
  refusee: 'red',
  expiree: 'orange',
}

const QUOTE_STATUS_CONFIG = Object.fromEntries(
  Object.entries(QUOTE_STATUS_LABELS).map(([status, label]) => [
    status,
    { label, color: QUOTE_STATUS_COLORS[status as QuoteStatus] },
  ]),
) as Record<QuoteStatus, { label: string; color: BadgeColor }>

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return <StatusBadge status={status} config={QUOTE_STATUS_CONFIG} />
}
