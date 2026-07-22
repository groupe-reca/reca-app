import { MoreVertical } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { getAvatarColor } from '@/lib/avatarColor'
import { formatDateTime } from '@/lib/format'
import type { InterventionNote } from '../../types/interventionNote.types'

type InterventionNoteTimelineItemProps = {
  note: InterventionNote
  onEdit: (note: InterventionNote) => void
  onDelete: (id: string) => void
}

export function InterventionNoteTimelineItem({ note, onEdit, onDelete }: InterventionNoteTimelineItemProps) {
  const authorName = note.author?.nom || 'Utilisateur'

  return (
    <div className="flex gap-3">
      <Avatar name={authorName} size="sm" color={getAvatarColor(note.author?.id ?? note.id)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-body font-medium text-reca-black">{authorName}</span>
            <span className="text-label text-reca-gray-medium">{formatDateTime(note.createdAt)}</span>
          </div>
          <Dropdown
            trigger={
              <button
                type="button"
                aria-label="Actions sur la note"
                className="flex size-8 shrink-0 items-center justify-center rounded-control text-reca-gray-medium hover:bg-reca-gray-light hover:text-reca-black"
              >
                <MoreVertical className="size-4" aria-hidden="true" />
              </button>
            }
          >
            <DropdownItem onClick={() => onEdit(note)}>Modifier</DropdownItem>
            <DropdownItem onClick={() => onDelete(note.id)}>Supprimer</DropdownItem>
          </Dropdown>
        </div>
        <p className="mt-0.5 text-body text-reca-gray-medium">{note.message}</p>
      </div>
    </div>
  )
}
