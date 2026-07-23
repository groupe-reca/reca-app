import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { QueryState } from '@/components/ui/QueryState'
import { useMissionEvents } from '../../hooks/useMissionEvents'
import { MissionEventTimelineItem } from './MissionEventTimelineItem'
import { MissionHistoryModal } from './MissionHistoryModal'

const COLLAPSED_COUNT = 4

/** "Historique de la mission" — auto-suffisant (fetch ses propres données), journal réel (`mission_events`). */
export function MissionHistoryCard({ missionId }: { missionId: string }) {
  const { data: events, isLoading, isError } = useMissionEvents(missionId)
  const [historyOpen, setHistoryOpen] = useState(false)

  const visibleEvents = events?.slice(0, COLLAPSED_COUNT)

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Historique de la mission</h2>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={visibleEvents}
        isEmpty={(data) => data.length === 0}
        emptyLabel="Aucun événement pour cette mission."
        errorLabel="Impossible de charger l'historique."
      >
        {(data) => (
          <div className="flex flex-col gap-4">
            {data.map((event) => (
              <MissionEventTimelineItem key={event.id} event={event} />
            ))}
          </div>
        )}
      </QueryState>

      {events && events.length > 0 && (
        <Button variant="secondary" onClick={() => setHistoryOpen(true)}>
          Voir tout l'historique
        </Button>
      )}

      <MissionHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} events={events ?? []} />
    </Card>
  )
}
