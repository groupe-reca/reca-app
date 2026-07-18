import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Invoice } from '@/features/invoices/types/invoice.types'
import type { Payment } from '@/features/payments/types/payment.types'
import { formatCurrency, formatDateLong } from '@/lib/format'
import { ContractPaymentsHistoryModal } from './ContractPaymentsHistoryModal'
import { PAYMENT_PRESET_LABELS, detectPreset } from '../../utils/paymentPresets'
import type { Contract } from '../../types/contract.types'

type ContractPaymentsCardProps = {
  contract: Contract
  invoices: Invoice[]
  payments: Payment[]
}

/** Résumé compact (maquette) — le détail complet (Versement/Montant/Échéance/Statut/Payé le/Action) est dans la modale. */
export function ContractPaymentsCard({ contract, invoices, payments }: ContractPaymentsCardProps) {
  const [historyOpen, setHistoryOpen] = useState(false)

  const total = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const solde = invoices.reduce((sum, invoice) => sum + invoice.solde, 0)
  const paye = total - solde
  const isFullyPaid = total > 0 && solde <= 0
  const percentPaid = total > 0 ? Math.round((paye / total) * 100) : 0

  const preset = detectPreset(contract.modalitesPaiement)
  const scheduleLabel = preset
    ? PAYMENT_PRESET_LABELS[preset]
    : `${invoices.length} versement${invoices.length > 1 ? 's' : ''}`

  const lastPayment = [...payments].sort((a, b) => b.date.localeCompare(a.date))[0]

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-subtitle font-semibold text-reca-black">Paiements</h2>
        <p className="text-label text-reca-gray-medium">
          Paiement {scheduleLabel} · {percentPaid}%
        </p>
      </div>

      <div className="flex flex-col gap-2 text-body">
        <div className="flex items-center justify-between">
          <span className="text-reca-gray-medium">Montant total</span>
          <span className="font-medium text-reca-black">{formatCurrency(total)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-reca-gray-medium">Payé</span>
          <span className="font-medium text-reca-success">{formatCurrency(paye)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-reca-gray-medium">Solde</span>
          <span className="font-medium text-reca-black">{formatCurrency(solde)}</span>
        </div>
      </div>

      {isFullyPaid && (
        <Badge color="green">
          <CheckCircle2 className="mr-1 size-3.5" aria-hidden="true" />
          Payé en totalité
        </Badge>
      )}

      <div className="grid grid-cols-2 gap-4 border-t border-reca-gray-light pt-4 text-body">
        <div>
          <p className="text-label text-reca-gray-medium">Dernier paiement</p>
          <p className="font-medium text-reca-black">{lastPayment ? formatDateLong(lastPayment.date) : '—'}</p>
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">Méthode</p>
          <p className="font-medium text-reca-black">{lastPayment?.methode ?? '—'}</p>
        </div>
      </div>

      <Button variant="secondary" onClick={() => setHistoryOpen(true)}>
        Voir l'historique des paiements
      </Button>

      <ContractPaymentsHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        invoices={invoices}
        payments={payments}
      />
    </Card>
  )
}
