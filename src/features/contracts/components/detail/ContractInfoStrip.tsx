import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { EmptyValue } from '@/components/ui/EmptyValue'
import { formatDateLong } from '@/lib/format'
import { ContractStatusBadge } from '../ContractStatusBadge'
import type { Contract } from '../../types/contract.types'

type InfoItem = { label: string; value: ReactNode }

/**
 * « Informations générales » — liste clé-valeur verticale, volontairement sans icônes : `$`,
 * crayon et calendrier devant chaque ligne n'ajoutaient aucune information.
 *
 * Prix, Début et Fin ne figurent plus ici : ce sont les données cherchées en premier, elles
 * ont été promues au bandeau de stats de l'onglet Résumé (`ContractStatsBanner`). Ne reste
 * que le contexte administratif.
 */
export function ContractInfoStrip({ contract, onEdit }: { contract: Contract; onEdit: () => void }) {
  const rows: InfoItem[] = [
    {
      label: 'Date de signature',
      value: contract.dateSignature ? (
        formatDateLong(contract.dateSignature)
      ) : (
        <EmptyValue label="Ajouter une date" onAction={onEdit} />
      ),
    },
    { label: 'Renouvellement', value: contract.renouvellement ? 'Automatique' : 'Manuel' },
    { label: 'Mode de paiement', value: contract.modePaiement || '—' },
    { label: 'Type de contrat', value: contract.type ?? '—' },
  ]

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Informations générales</h2>
      <div className="flex flex-col divide-y divide-reca-gray-light">
        {rows.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <span className="text-body text-reca-gray-medium">{item.label}</span>
            <span className="shrink-0 text-body font-medium text-reca-black">{item.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
          <span className="text-body text-reca-gray-medium">Statut</span>
          <ContractStatusBadge status={contract.statut} />
        </div>
      </div>
    </Card>
  )
}
