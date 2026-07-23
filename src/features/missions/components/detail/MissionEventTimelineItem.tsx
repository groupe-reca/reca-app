import { CheckCircle2, FilePlus, Pause, Play, RotateCw, ShieldAlert, TriangleAlert, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { formatDateTime } from '@/lib/format'
import { MISSION_EVENT_TYPE_LABELS } from '../../types/missionEvent.types'
import type { MissionEvent, MissionEventType } from '../../types/missionEvent.types'

const EVENT_ICONS: Record<MissionEventType, LucideIcon> = {
  mission_creee: FilePlus,
  mission_debutee: Play,
  mission_pausee: Pause,
  mission_reprise: RotateCw,
  mission_terminee: CheckCircle2,
  mission_terminee_avec_anomalies: TriangleAlert,
  mission_fermee_de_force: ShieldAlert,
  mission_annulee: XCircle,
}

export function MissionEventTimelineItem({ event }: { event: MissionEvent }) {
  const Icon = EVENT_ICONS[event.type]

  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-reca-gray-light">
        <Icon className="size-4 text-reca-gray-medium" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-reca-black">{MISSION_EVENT_TYPE_LABELS[event.type]}</p>
        <p className="text-label text-reca-gray-medium">{formatDateTime(event.createdAt)}</p>
      </div>
      <span className="shrink-0 text-label text-reca-gray-medium">{event.author?.nom ?? '—'}</span>
    </div>
  )
}
