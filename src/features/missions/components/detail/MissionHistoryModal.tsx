import { Modal } from '@/components/ui/Modal'
import type { MissionEvent } from '../../types/missionEvent.types'
import { MissionEventTimelineItem } from './MissionEventTimelineItem'

type MissionHistoryModalProps = {
  open: boolean
  onClose: () => void
  events: MissionEvent[]
}

export function MissionHistoryModal({ open, onClose, events }: MissionHistoryModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Historique de la mission">
      {events.length > 0 ? (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <MissionEventTimelineItem key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-body text-reca-gray-medium">Aucun événement pour cette mission.</p>
      )}
    </Modal>
  )
}
