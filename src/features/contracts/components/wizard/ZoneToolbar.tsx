import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type ZoneToolbarProps = {
  onAddZone: () => void
  addDisabled: boolean
  selectedZoneId: string | null
  editing: boolean
  onToggleEdit: () => void
  onDelete: () => void
}

/**
 * Barre d'outils locale au-dessus de la carte (sprint009) — n'ajoute que les actions
 * qui n'existaient pas encore (+ Nouvelle zone / Modifier / Supprimer). Recentrer et
 * 📸 Nouvelle capture restent exclusivement dans le Footer global du Wizard (décision
 * sprint008.5), pas dupliqués ici.
 */
export function ZoneToolbar({ onAddZone, addDisabled, selectedZoneId, editing, onToggleEdit, onDelete }: ZoneToolbarProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-card border border-reca-gray-light bg-white p-2">
      <Button type="button" variant="secondary" onClick={onAddZone} disabled={addDisabled}>
        <Plus className="size-4" aria-hidden="true" />
        Nouvelle zone
      </Button>
      <Button type="button" variant="secondary" onClick={onToggleEdit} disabled={!selectedZoneId}>
        <Pencil className="size-4" aria-hidden="true" />
        {editing ? 'Terminer' : 'Modifier'}
      </Button>
      <Button type="button" variant="secondary" onClick={onDelete} disabled={!selectedZoneId}>
        <Trash2 className="size-4" aria-hidden="true" />
        Supprimer
      </Button>
    </div>
  )
}
