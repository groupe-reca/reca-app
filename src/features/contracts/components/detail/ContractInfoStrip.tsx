import { Calendar, Clock, DollarSign, Pencil, RefreshCw, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDateLong } from '@/lib/format'
import { MODE_CONCLUSION_LABELS } from '../../constants/wizardOptions'
import type { Contract } from '../../types/contract.types'

type InfoItem = { icon: LucideIcon; label: string; value: ReactNode }

function InfoItemView({ icon: Icon, label, value }: InfoItem) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-reca-gray-light">
        <Icon className="size-5 text-reca-gray-medium" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-label text-reca-gray-medium">{label}</p>
        <p className="truncate text-body font-medium text-reca-black">{value}</p>
      </div>
    </div>
  )
}

/** Bandeau d'infos, 2 rangées : Prix/Mode de conclusion/Signature/Renouvellement // Début/Fin/Créé le. */
export function ContractInfoStrip({ contract }: { contract: Contract }) {
  const row1: InfoItem[] = [
    { icon: DollarSign, label: 'Prix', value: contract.prix != null ? formatCurrency(contract.prix) : '—' },
    { icon: User, label: 'Mode de conclusion', value: MODE_CONCLUSION_LABELS[contract.modeConclusion] },
    { icon: Pencil, label: 'Signature', value: contract.dateSignature ? formatDateLong(contract.dateSignature) : '—' },
    { icon: RefreshCw, label: 'Renouvellement automatique', value: contract.renouvellement ? 'Oui' : 'Non' },
  ]
  const row2: InfoItem[] = [
    { icon: Calendar, label: 'Début', value: contract.dateDebut ? formatDateLong(contract.dateDebut) : '—' },
    { icon: Calendar, label: 'Fin', value: contract.dateFin ? formatDateLong(contract.dateFin) : '—' },
    { icon: Clock, label: 'Créé le', value: formatDateLong(contract.createdAt) },
  ]

  return (
    <Card className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {row1.map((item) => (
          <InfoItemView key={item.label} {...item} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 border-t border-reca-gray-light pt-5 sm:grid-cols-3">
        {row2.map((item) => (
          <InfoItemView key={item.label} {...item} />
        ))}
      </div>
    </Card>
  )
}
