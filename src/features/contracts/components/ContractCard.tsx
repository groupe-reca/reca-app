import { CircleAlert, User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDateLong } from '@/lib/format'
import { ContractStatusBadge } from './ContractStatusBadge'
import type { Contract } from '../types/contract.types'

type ContractCardProps = {
  contract: Contract
  onClick: () => void
}

export function ContractCard({ contract, onClick }: ContractCardProps) {
  const clientName = contract.client ? `${contract.client.prenom} ${contract.client.nom}` : '—'

  return (
    <Card variant="clickable" chevron onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-reca-gray-light text-reca-gray-medium">
          <User className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="truncate font-medium text-reca-black">{clientName}</span>
            <div className="flex items-center gap-2">
              {contract.hasOverdueInvoice && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-reca-red dark:bg-red-500/15 dark:text-red-400">
                  <CircleAlert className="size-3" aria-hidden="true" />
                  En retard de paiement
                </span>
              )}
              <ContractStatusBadge status={contract.statut} />
            </div>
          </div>
          {contract.adresseGeocodee && (
            <p className="truncate text-label text-reca-gray-medium">{contract.adresseGeocodee}</p>
          )}
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-label text-reca-gray-medium">
            <span>
              {contract.type ?? '—'} · Créé le {formatDateLong(contract.createdAt)}
            </span>
            <span className="font-medium text-reca-black">
              {contract.prix != null ? formatCurrency(contract.prix) : '—'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
