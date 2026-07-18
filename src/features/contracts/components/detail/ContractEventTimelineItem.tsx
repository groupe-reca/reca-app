import { Download, FilePlus, Mail, PenLine, RefreshCw } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatDateTime } from '@/lib/format'
import { CONTRACT_STATUS_LABELS } from '../../types/contract.types'
import { CONTRACT_EVENT_TYPE_LABELS } from '../../types/contractEvent.types'
import type { ContractEvent, ContractEventType } from '../../types/contractEvent.types'

const EVENT_ICONS: Record<ContractEventType, LucideIcon> = {
  contrat_cree: FilePlus,
  contrat_signe: PenLine,
  statut_modifie: RefreshCw,
  pdf_genere: Download,
  courriel_envoye: Mail,
}

function eventLabel(event: ContractEvent): string {
  if (event.type === 'statut_modifie' && event.payload?.statut) {
    return `Statut : ${CONTRACT_STATUS_LABELS[event.payload.statut]}`
  }
  return CONTRACT_EVENT_TYPE_LABELS[event.type]
}

export function ContractEventTimelineItem({ event }: { event: ContractEvent }) {
  const Icon = EVENT_ICONS[event.type]

  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-reca-gray-light">
        <Icon className="size-4 text-reca-gray-medium" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-reca-black">{eventLabel(event)}</p>
        <p className="text-label text-reca-gray-medium">{formatDateTime(event.createdAt)}</p>
      </div>
      <span className="shrink-0 text-label text-reca-gray-medium">{event.author?.nom ?? '—'}</span>
    </div>
  )
}
