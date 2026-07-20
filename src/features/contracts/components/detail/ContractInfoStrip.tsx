import { Calendar, CreditCard, DollarSign, FileText, PenLine, RefreshCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDateLong } from '@/lib/format'
import { ContractStatusBadge } from '../ContractStatusBadge'
import type { Contract } from '../../types/contract.types'

type InfoItem = { icon: LucideIcon; label: string; value: ReactNode }

/** "Informations générales" — liste verticale compacte (1 colonne de la 1ère rangée). */
export function ContractInfoStrip({ contract }: { contract: Contract }) {
  const rows: InfoItem[] = [
    { icon: DollarSign, label: 'Prix du contrat', value: contract.prix != null ? formatCurrency(contract.prix) : '—' },
    { icon: PenLine, label: 'Date de signature', value: contract.dateSignature ? formatDateLong(contract.dateSignature) : '—' },
    { icon: Calendar, label: 'Début', value: contract.dateDebut ? formatDateLong(contract.dateDebut) : '—' },
    { icon: Calendar, label: 'Fin', value: contract.dateFin ? formatDateLong(contract.dateFin) : '—' },
    { icon: RefreshCw, label: 'Renouvellement', value: contract.renouvellement ? 'Automatique' : 'Manuel' },
    { icon: CreditCard, label: 'Mode de paiement', value: contract.modePaiement || '—' },
    { icon: FileText, label: 'Type de contrat', value: contract.type ?? '—' },
  ]

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Informations générales</h2>
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
          <ContractStatusBadge status={contract.statut} />
        </div>
      </div>
    </Card>
  )
}
