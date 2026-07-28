import { FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDateLong } from '@/lib/format'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import type { Invoice } from '../types/invoice.types'

type InvoiceCardProps = {
  invoice: Invoice
  onClick: () => void
}

export function InvoiceCard({ invoice, onClick }: InvoiceCardProps) {
  const clientName = invoice.client ? `${invoice.client.prenom} ${invoice.client.nom}` : '—'

  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-reca-gray-light text-reca-gray-medium">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="truncate font-medium text-reca-black">{clientName}</span>
            <InvoiceStatusBadge status={invoice.statut} />
          </div>
          <p className="truncate text-label text-reca-gray-medium">Créée le {formatDateLong(invoice.date)}</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-label text-reca-gray-medium">
            <span>{invoice.numero}</span>
            <span className="font-medium text-reca-black">
              {formatCurrency(invoice.total)}
              {invoice.solde > 0 ? ` · Solde ${formatCurrency(invoice.solde)}` : ''}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
