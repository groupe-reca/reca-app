import { FilePlus, Pause, Play, RotateCw, ShieldAlert, Square } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatDateTime } from '@/lib/format'
import { INTERVENTION_EVENT_TYPE_LABELS } from '../../types/interventionEvent.types'
import type { InterventionEvent, InterventionEventType } from '../../types/interventionEvent.types'

const EVENT_ICONS: Record<InterventionEventType, LucideIcon> = {
  creee: FilePlus,
  debut: Play,
  pause: Pause,
  reprise: RotateCw,
  terminee: Square,
  fermee: ShieldAlert,
}

function eventLabel(event: InterventionEvent): string {
  if (event.type === 'fermee' && event.payload?.itemsRestants != null) {
    return `${INTERVENTION_EVENT_TYPE_LABELS.fermee} — ${event.payload.itemsRestants} résidence(s) restée(s) incomplète(s)`
  }
  return INTERVENTION_EVENT_TYPE_LABELS[event.type]
}

export function InterventionEventTimelineItem({ event }: { event: InterventionEvent }) {
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
