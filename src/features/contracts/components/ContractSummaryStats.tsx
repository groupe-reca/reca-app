import type { LucideIcon } from 'lucide-react'
import { Activity, CreditCard, DollarSign, Home, Layers, MapPin, User } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import type { Client } from '@/features/clients/types/client.types'
import { formatAddress, formatCurrency } from '@/lib/format'
import { MODE_PAIEMENT_OPTIONS } from '../constants/wizardOptions'
import { ContractStatusBadge } from './ContractStatusBadge'
import { getNextPaymentEntry } from '../utils/paymentPresets'
import type { Contract } from '../types/contract.types'

type ContractSummaryStatsProps = {
  contract: Contract
  client: Client
}

type StatEntry = { icon: LucideIcon; label: string; value: ReactNode }

/**
 * Colonne droite "Informations du contrat" — petites cartes label/valeur. `StatCard`
 * (`src/components/ui/StatCard.tsx`) a été essayé en premier mais son style (valeur en
 * `text-h1`) est pensé pour des KPI numériques courts ; un nom ou une adresse à cette
 * taille rend mal (testé en navigateur) — cartes plus sobres à la place.
 */
export function ContractSummaryStats({ contract, client }: ContractSummaryStatsProps) {
  const nextPayment = getNextPaymentEntry(contract.modalitesPaiement)
  const modeLabel = MODE_PAIEMENT_OPTIONS.find((mode) => mode.value === contract.modePaiement)?.label ?? '—'

  const stats: StatEntry[] = [
    { icon: User, label: 'Client', value: `${client.prenom} ${client.nom}` },
    { icon: MapPin, label: 'Adresse', value: formatAddress(client.adresse, client.ville, client.codePostal) || '—' },
    { icon: Home, label: 'Type', value: contract.type ?? '—' },
    { icon: DollarSign, label: 'Prix', value: contract.prix != null ? formatCurrency(contract.prix) : '—' },
    { icon: CreditCard, label: 'Mode de paiement', value: modeLabel },
    { icon: Layers, label: 'Nombre de versements', value: contract.modalitesPaiement.length },
    { icon: CreditCard, label: 'Prochain paiement', value: nextPayment?.dateEcheance ?? '—' },
    { icon: Activity, label: 'Statut', value: <ContractStatusBadge status={contract.statut} /> },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {stats.map(({ icon: Icon, label, value }) => (
        <Card key={label} className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-reca-red/10 text-reca-red">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-label text-reca-gray-medium">{label}</p>
            <p className="truncate text-body font-semibold text-reca-black">{value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
