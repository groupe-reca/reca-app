import { useState } from 'react'
import { useNavigate } from 'react-router'
import { MoreVertical } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatDurationShort } from '@/lib/format'
import { useClientContracts } from '@/features/contracts/hooks/useClientContracts'
import { InterventionItemDetailModal } from './InterventionItemDetailModal'
import { InterventionItemStatusDropdown } from './InterventionItemStatusDropdown'
import type { InterventionItem } from '../../types/interventionItem.types'

type InterventionItemCardProps = {
  interventionId: string
  item: InterventionItem
}

export function InterventionItemCard({ interventionId, item }: InterventionItemCardProps) {
  const navigate = useNavigate()
  const [detailOpen, setDetailOpen] = useState(false)
  const { data: contracts } = useClientContracts(item.clientId)

  const clientName = item.client ? `${item.client.prenom} ${item.client.nom}` : 'Client inconnu'
  const resolvedContract =
    contracts?.find((contract) => contract.statut === 'actif') ?? contracts?.[0] ?? null

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-reca-black">{clientName}</p>
          <p className="truncate text-label text-reca-gray-medium">{item.client?.adresse ?? '—'}</p>
        </div>
        <button
          type="button"
          onClick={() => setDetailOpen(true)}
          aria-label="Détails de la résidence"
          className="flex size-8 shrink-0 items-center justify-center rounded-control text-reca-gray-medium hover:bg-reca-gray-light hover:text-reca-black"
        >
          <MoreVertical className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <InterventionItemStatusDropdown interventionId={interventionId} itemId={item.id} status={item.statut} />
        <div className="flex items-center gap-4 text-label text-reca-gray-medium">
          <span>Déplacement : {formatDurationShort(item.tempsDeplacementSecondes)}</span>
          <span>Intervention : {formatDurationShort(item.tempsInterventionSecondes)}</span>
        </div>
      </div>

      <button
        type="button"
        disabled={!resolvedContract}
        onClick={() => resolvedContract && navigate(`/contracts/${resolvedContract.id}`)}
        className="self-start text-label font-medium text-reca-info hover:underline disabled:cursor-not-allowed disabled:text-reca-gray-medium disabled:no-underline"
      >
        Voir le contrat
      </button>

      <InterventionItemDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        interventionId={interventionId}
        item={item}
      />
    </Card>
  )
}
