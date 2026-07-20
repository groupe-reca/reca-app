import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { QueryState } from '@/components/ui/QueryState'
import { useContractNotes } from '../../hooks/useContractNotes'
import { ContractAddNoteModal } from './ContractAddNoteModal'
import { ContractNoteTimelineItem } from './ContractNoteTimelineItem'

const COLLAPSED_COUNT = 4

/** "Notes au dossier" — auto-suffisant (fetch ses propres données), timeline des notes libres du contrat. */
export function ContractNotesCard({ contractId }: { contractId: string }) {
  const { data: notes, isLoading, isError } = useContractNotes(contractId)
  const [addOpen, setAddOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const visibleNotes = notes && !showAll ? notes.slice(0, COLLAPSED_COUNT) : notes

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-subtitle font-semibold text-reca-black">Notes au dossier</h2>
        <Button variant="secondary" onClick={() => setAddOpen(true)}>
          <Plus className="size-4" aria-hidden="true" />
          Ajouter une note
        </Button>
      </div>

      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={visibleNotes}
        isEmpty={(data) => data.length === 0}
        emptyLabel="Aucune note pour ce contrat."
        errorLabel="Impossible de charger les notes."
      >
        {(data) => (
          <div className="flex flex-col gap-4">
            {data.map((note) => (
              <ContractNoteTimelineItem key={note.id} note={note} />
            ))}
          </div>
        )}
      </QueryState>

      {notes && notes.length > COLLAPSED_COUNT && !showAll && (
        <Button variant="ghost" onClick={() => setShowAll(true)}>
          Voir toutes les notes
        </Button>
      )}

      <ContractAddNoteModal open={addOpen} onClose={() => setAddOpen(false)} contractId={contractId} />
    </Card>
  )
}
