import { DollarSign } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDateLong } from '@/lib/format'
import type { Payment } from '../types/payment.types'

type PaymentCardProps = {
  payment: Payment
  onClick: () => void
}

/** Même gabarit que `ContractCard.tsx` — le clic navigue vers la facture liée (pas de fiche paiement dédiée). */
export function PaymentCard({ payment, onClick }: PaymentCardProps) {
  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-reca-gray-light text-reca-gray-medium">
          <DollarSign className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="font-medium text-reca-black">{formatCurrency(payment.montant)}</span>
            <span className="text-label text-reca-gray-medium">{formatDateLong(payment.date)}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-label text-reca-gray-medium">
            <span className="truncate">
              {payment.methode || '—'}
              {payment.reference && ` · ${payment.reference}`}
            </span>
            <span className="shrink-0 font-medium text-reca-black">{payment.invoice?.numero ?? '—'}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
