import { FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDateLong } from '@/lib/format'
import { QuoteStatusBadge } from './QuoteStatusBadge'
import type { Quote } from '../types/quote.types'

type QuoteCardProps = {
  quote: Quote
  onClick: () => void
}

export function QuoteCard({ quote, onClick }: QuoteCardProps) {
  const leadName = quote.lead ? `${quote.lead.prenom} ${quote.lead.nom}` : '—'

  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-reca-gray-light text-reca-gray-medium">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="truncate font-medium text-reca-black">{formatCurrency(quote.total)}</span>
            <QuoteStatusBadge status={quote.statut} />
          </div>
          <p className="truncate text-label text-reca-gray-medium">{leadName}</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-label text-reca-gray-medium">
            <span>
              {quote.expiration ? `Expire le ${formatDateLong(quote.expiration)}` : 'Sans expiration'}
            </span>
            <span>{quote.numero}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
