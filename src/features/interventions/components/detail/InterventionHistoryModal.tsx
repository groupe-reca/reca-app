import { Modal } from '@/components/ui/Modal'
import { InterventionEventTimelineItem } from './InterventionEventTimelineItem'
import type { InterventionEvent } from '../../types/interventionEvent.types'

type InterventionHistoryModalProps = {
  open: boolean
  onClose: () => void
  events: InterventionEvent[]
}

export function InterventionHistoryModal({ open, onClose, events }: InterventionHistoryModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Historique de l'intervention">
      {events.length > 0 ? (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <InterventionEventTimelineItem key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-body text-reca-gray-medium">Aucun événement pour cette intervention.</p>
      )}
    </Modal>
  )
}
