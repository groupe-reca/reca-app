import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Client } from '../../types/client.types'

type ClientDetailHeaderProps = {
  client: Client
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export function ClientDetailHeader({ client, onEdit, onDelete, isDeleting = false }: ClientDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-label text-reca-gray-medium">{client.numero}</p>
        <h1 className="text-section font-semibold text-reca-black">
          {client.prenom} {client.nom}
        </h1>
        {client.entreprise && <p className="text-body text-reca-gray-medium">{client.entreprise}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" fullWidth onClick={onEdit} className="sm:w-auto">
          <Pencil className="size-4" aria-hidden="true" />
          Modifier
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={onDelete}
          disabled={isDeleting}
          className="sm:w-auto border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Supprimer
        </Button>
      </div>
    </div>
  )
}
