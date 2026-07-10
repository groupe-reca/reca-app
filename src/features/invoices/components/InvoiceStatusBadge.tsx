import { StatusBadge } from '@/components/shared/StatusBadge'
import type { BadgeColor } from '@/components/ui/Badge'
import { INVOICE_STATUS_LABELS } from '../types/invoice.types'
import type { InvoiceStatus } from '../types/invoice.types'

const INVOICE_STATUS_COLORS: Record<InvoiceStatus, BadgeColor> = {
  brouillon: 'gray',
  envoyee: 'blue',
  payee: 'green',
  partiellement_payee: 'orange',
  en_retard: 'red',
  annulee: 'red',
}

const INVOICE_STATUS_CONFIG = Object.fromEntries(
  Object.entries(INVOICE_STATUS_LABELS).map(([status, label]) => [
    status,
    { label, color: INVOICE_STATUS_COLORS[status as InvoiceStatus] },
  ]),
) as Record<InvoiceStatus, { label: string; color: BadgeColor }>

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <StatusBadge status={status} config={INVOICE_STATUS_CONFIG} />
}
