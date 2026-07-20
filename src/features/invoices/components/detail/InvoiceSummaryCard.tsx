import { Calendar, DollarSign, FileText, Percent, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDateLong } from '@/lib/format'
import { InvoiceStatusBadge } from '../InvoiceStatusBadge'
import type { Invoice } from '../../types/invoice.types'

type InfoItem = { icon: LucideIcon; label: string; value: ReactNode }

/** Même gabarit que `ContractInfoStrip.tsx` — liste verticale compacte. */
export function InvoiceSummaryCard({ invoice }: { invoice: Invoice }) {
  const rows: InfoItem[] = [
    { icon: Calendar, label: 'Date', value: formatDateLong(invoice.date) },
    { icon: DollarSign, label: 'Sous-total', value: formatCurrency(invoice.sousTotal) },
    { icon: Percent, label: 'TPS', value: formatCurrency(invoice.tps) },
    { icon: Percent, label: 'TVQ', value: formatCurrency(invoice.tvq) },
    { icon: DollarSign, label: 'Total', value: formatCurrency(invoice.total) },
    { icon: Wallet, label: 'Solde', value: formatCurrency(invoice.solde) },
  ]

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Détails</h2>
      <div className="flex flex-col divide-y divide-reca-gray-light">
        {rows.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <span className="flex items-center gap-2 text-body text-reca-gray-medium">
              <item.icon className="size-4 shrink-0" aria-hidden="true" />
              {item.label}
            </span>
            <span className="shrink-0 text-body font-medium text-reca-black">{item.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
          <span className="flex items-center gap-2 text-body text-reca-gray-medium">
            <FileText className="size-4 shrink-0" aria-hidden="true" />
            Statut
          </span>
          <InvoiceStatusBadge status={invoice.statut} />
        </div>
      </div>
    </Card>
  )
}
