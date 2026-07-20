import { Modal } from '@/components/ui/Modal'
import type { ContractEvent } from '../../types/contractEvent.types'
import { ContractEventTimelineItem } from './ContractEventTimelineItem'

type ContractHistoryModalProps = {
  open: boolean
  onClose: () => void
  events: ContractEvent[]
}

export function ContractHistoryModal({ open, onClose, events }: ContractHistoryModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Historique du contrat">
      {events.length > 0 ? (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <ContractEventTimelineItem key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-body text-reca-gray-medium">Aucun événement pour ce contrat.</p>
      )}
    </Modal>
  )
}
