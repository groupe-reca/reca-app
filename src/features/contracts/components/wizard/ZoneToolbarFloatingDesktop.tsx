import { Loader2, LocateFixed, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ZoneToolbarFloatingDesktopProps = {
  onAddZone: () => void
  addDisabled: boolean
  selectedZoneId: string | null
  editing: boolean
  onToggleEdit: () => void
  onDelete: () => void
  onRecenter: () => void
  recenterDisabled: boolean
  onAutoDetect: () => void
  autoDetectDisabled: boolean
  isAnalyzing: boolean
}

/**
 * Barre d'outils flottante verticale (Desktop, tâche 4) — posée directement sur la carte
 * plutôt qu'au-dessus dans une grille (ancien `ZoneToolbar.tsx`, supprimé). Composant
 * autonome (ne réutilise pas `components/mobile/ZoneToolbarFloating.tsx`, orientation
 * horizontale) pour ne prendre aucun risque de régression sur le Mobile déjà vérifié.
 */
export function ZoneToolbarFloatingDesktop({
  onAddZone,
  addDisabled,
  selectedZoneId,
  editing,
  onToggleEdit,
  onDelete,
  onRecenter,
  recenterDisabled,
  onAutoDetect,
  autoDetectDisabled,
  isAnalyzing,
}: ZoneToolbarFloatingDesktopProps) {
  return (
    <div className="absolute left-4 top-4 z-20 flex flex-col items-center gap-1 rounded-full bg-white/95 p-2 shadow-[0_4px_16px_rgba(0,0,0,0.18)] backdrop-blur">
      <FloatingIconButton icon={LocateFixed} label="Recentrer" onClick={onRecenter} disabled={recenterDisabled} />
      <div className="h-px w-8 bg-reca-gray-light" aria-hidden="true" />
      <FloatingIconButton icon={Plus} label="Nouvelle zone" onClick={onAddZone} disabled={addDisabled} />
      <FloatingIconButton
        icon={Pencil}
        label={editing ? 'Terminer la modification' : 'Modifier la zone'}
        onClick={onToggleEdit}
        disabled={!selectedZoneId}
        active={editing}
      />
      <FloatingIconButton icon={Trash2} label="Supprimer la zone" onClick={onDelete} disabled={!selectedZoneId} />
      <FloatingIconButton
        icon={isAnalyzing ? Loader2 : Sparkles}
        label="Détection automatique"
        onClick={onAutoDetect}
        disabled={autoDetectDisabled || isAnalyzing}
        spinning={isAnalyzing}
      />
    </div>
  )
}

function FloatingIconButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  active,
  spinning,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  disabled?: boolean
  active?: boolean
  spinning?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-30 ${
        active ? 'bg-reca-red text-white' : 'text-reca-black hover:bg-reca-snow'
      }`}
    >
      <Icon className={`size-4 ${spinning ? 'animate-spin' : ''}`} aria-hidden="true" />
    </button>
  )
}
