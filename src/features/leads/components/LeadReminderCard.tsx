import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useScheduleReminder } from '../hooks/useScheduleReminder'
import type { Lead } from '../types/lead.types'

export function LeadReminderCard({ lead }: { lead: Lead }) {
  const scheduleReminder = useScheduleReminder(lead.id)
  const [date, setDate] = useState(lead.rappelLe ? lead.rappelLe.slice(0, 16) : '')
  const [note, setNote] = useState(lead.rappelNote ?? '')

  return (
    <Card>
      <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Rappel</h2>
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault()
          if (!date) return
          scheduleReminder.mutate({ rappelLe: new Date(date).toISOString(), rappelNote: note })
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rappel-date" className="text-label font-medium text-reca-gray-medium">
            Date et heure
          </label>
          <input
            id="rappel-date"
            type="datetime-local"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-11 rounded-control border border-reca-gray-light px-3 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="rappel-note" className="text-label font-medium text-reca-gray-medium">
            Note (optionnel)
          </label>
          <input
            id="rappel-note"
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="h-11 rounded-control border border-reca-gray-light px-3 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          />
        </div>
        <Button type="submit" variant="secondary" isLoading={scheduleReminder.isPending}>
          Planifier
        </Button>
      </form>
    </Card>
  )
}
