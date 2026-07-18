import { Avatar } from '@/components/ui/Avatar'
import { formatDateTime } from '@/lib/format'
import type { ContractNote } from '../../types/contractNote.types'

export function ContractNoteTimelineItem({ note }: { note: ContractNote }) {
  const authorName = note.author?.nom || 'Utilisateur'

  return (
    <div className="flex gap-3">
      <Avatar name={authorName} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-body font-medium text-reca-black">{authorName}</span>
          <span className="text-label text-reca-gray-medium">{formatDateTime(note.createdAt)}</span>
        </div>
        <p className="mt-0.5 text-body text-reca-gray-medium">{note.message}</p>
      </div>
    </div>
  )
}
