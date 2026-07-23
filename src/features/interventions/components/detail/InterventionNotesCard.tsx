import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { QueryState } from '@/components/ui/QueryState'
import { useAddInterventionNote } from '../../hooks/useAddInterventionNote'
import { useDeleteInterventionNote } from '../../hooks/useDeleteInterventionNote'
import { useInterventionNotes } from '../../hooks/useInterventionNotes'
import { InterventionEditNoteModal } from './InterventionEditNoteModal'
import { InterventionNoteTimelineItem } from './InterventionNoteTimelineItem'
import type { InterventionNote } from '../../types/interventionNote.types'

const COLLAPSED_COUNT = 4

/** "Notes" — même composant (ajout inline + édition/suppression) que la fiche Client. Auto-suffisant. */
export function InterventionNotesCard({ interventionId }: { interventionId: string }) {
  const { data: notes, isLoading, isError } = useInterventionNotes(interventionId)
  const addNote = useAddInterventionNote(interventionId)
  const deleteNote = useDeleteInterventionNote(interventionId)
  const [message, setMessage] = useState('')
  const [editingNote, setEditingNote] = useState<InterventionNote | null>(null)
  const [showAll, setShowAll] = useState(false)

  function handleAdd() {
    const trimmed = message.trim()
    if (!trimmed) return
    addNote.mutate(trimmed, { onSuccess: () => setMessage('') })
  }

  function handleDelete(id: string) {
    if (!window.confirm('Supprimer cette note ?')) return
    deleteNote.mutate(id)
  }

  const visibleNotes = notes && !showAll ? notes.slice(0, COLLAPSED_COUNT) : notes

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Notes</h2>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Écrire une nouvelle note…"
          className="h-11 flex-1 rounded-control border border-reca-gray-light bg-reca-white px-3 text-body text-reca-black placeholder:text-reca-gray-medium/70 focus:outline-none focus:ring-2 focus:ring-reca-red/30"
        />
        <Button onClick={handleAdd} isLoading={addNote.isPending} disabled={!message.trim()}>
          Ajouter une note
        </Button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={visibleNotes}
        isEmpty={(data) => data.length === 0}
        emptyLabel="Aucune note pour cette intervention."
        errorLabel="Impossible de charger les notes."
      >
        {(data) => (
          <div className="flex flex-col gap-4">
            {data.map((note) => (
              <InterventionNoteTimelineItem key={note.id} note={note} onEdit={setEditingNote} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </QueryState>

      {notes && notes.length > COLLAPSED_COUNT && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="flex items-center justify-between text-label font-medium text-reca-red hover:underline"
        >
          Voir toutes les notes ({notes.length})
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      )}

      {editingNote && (
        <InterventionEditNoteModal
          open
          onClose={() => setEditingNote(null)}
          interventionId={interventionId}
          note={editingNote}
        />
      )}
    </Card>
  )
}
