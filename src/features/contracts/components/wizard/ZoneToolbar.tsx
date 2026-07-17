import { Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type ZoneToolbarProps = {
  onAddZone: () => void
  addDisabled: boolean
  selectedZoneId: string | null
  editing: boolean
  onToggleEdit: () => void
  onDelete: () => void
  onAutoDetect: () => void
  autoDetectDisabled: boolean
  isAnalyzing: boolean
}

/**
 * Barre d'outils locale au-dessus de la carte (sprint009) — n'ajoute que les actions
 * qui n'existaient pas encore (+ Nouvelle zone / Modifier / Supprimer). Recentrer et
 * 📸 Nouvelle capture restent exclusivement dans le Footer global du Wizard (décision
 * sprint008.5), pas dupliqués ici. "Détection automatique" (tâche 1) suggère des zones
 * de stationnement éditables via Gemini — reste optionnel, le tracé manuel fonctionne
 * toujours de la même façon si non utilisé.
 */
export function ZoneToolbar({
  onAddZone,
  addDisabled,
  selectedZoneId,
  editing,
  onToggleEdit,
  onDelete,
  onAutoDetect,
  autoDetectDisabled,
  isAnalyzing,
}: ZoneToolbarProps) {
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
      <Button type="button" variant="secondary" onClick={onAutoDetect} disabled={autoDetectDisabled} isLoading={isAnalyzing}>
        <Sparkles className="size-4" aria-hidden="true" />
        Détection automatique
      </Button>
    </div>
  )
}
