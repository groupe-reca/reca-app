import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { QueryState } from '@/components/ui/QueryState'
import { useInterventionEvents } from '../../hooks/useInterventionEvents'
import { InterventionEventTimelineItem } from './InterventionEventTimelineItem'
import { InterventionHistoryModal } from './InterventionHistoryModal'

const COLLAPSED_COUNT = 4

/** "Historique" — journal réel (`intervention_events`), auto-suffisant. Mirrors `ContractHistoryCard.tsx`. */
export function InterventionHistoryCard({ interventionId }: { interventionId: string }) {
  const { data: events, isLoading, isError } = useInterventionEvents(interventionId)
  const [historyOpen, setHistoryOpen] = useState(false)

  const visibleEvents = events?.slice(0, COLLAPSED_COUNT)

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Historique</h2>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={visibleEvents}
        isEmpty={(data) => data.length === 0}
        emptyLabel="Aucun événement pour cette intervention."
        errorLabel="Impossible de charger l'historique."
      >
        {(data) => (
          <div className="flex flex-col gap-4">
            {data.map((event) => (
              <InterventionEventTimelineItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </QueryState>

      {events && events.length > 0 && (
        <Button variant="secondary" onClick={() => setHistoryOpen(true)}>
          Voir tout l'historique
        </Button>
      )}

      <InterventionHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} events={events ?? []} />
    </Card>
  )
}
