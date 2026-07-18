import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { QueryState } from '@/components/ui/QueryState'
import { useContractEvents } from '../../hooks/useContractEvents'
import { ContractEventTimelineItem } from './ContractEventTimelineItem'
import { ContractHistoryModal } from './ContractHistoryModal'

const COLLAPSED_COUNT = 4

/** "Historique du contrat" — auto-suffisant (fetch ses propres données), journal réel (`contract_events`). */
export function ContractHistoryCard({ contractId }: { contractId: string }) {
  const { data: events, isLoading, isError } = useContractEvents(contractId)
  const [historyOpen, setHistoryOpen] = useState(false)

  const visibleEvents = events?.slice(0, COLLAPSED_COUNT)

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Historique du contrat</h2>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={visibleEvents}
        isEmpty={(data) => data.length === 0}
        emptyLabel="Aucun événement pour ce contrat."
        errorLabel="Impossible de charger l'historique."
      >
        {(data) => (
          <div className="flex flex-col gap-4">
            {data.map((event) => (
              <ContractEventTimelineItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </QueryState>

      {events && events.length > 0 && (
        <Button variant="secondary" onClick={() => setHistoryOpen(true)}>
          Voir tout l'historique
        </Button>
      )}

      <ContractHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} events={events ?? []} />
    </Card>
  )
}
