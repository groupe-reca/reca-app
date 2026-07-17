import { Loader2, LocateFixed, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type ZoneToolbarFloatingProps = {
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
 * Barre d'outils flottante mobile (sprint012, Phase D) — mêmes callbacks/état que
 * `ZoneToolbar.tsx` (Desktop, inchangé), présentée en pilule flottante au-dessus de la
 * carte plein écran plutôt qu'en barre fixe. "Terminer" du brief correspond à l'avancée
 * d'étape existante (`FloatingActionBar` → Suivant), pas un 5e bouton ici.
 */
export function ZoneToolbarFloating({
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
}: ZoneToolbarFloatingProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(15dvh+16px)] z-30 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/95 p-2 shadow-[0_4px_16px_rgba(0,0,0,0.18)] backdrop-blur">
        <FloatingIconButton icon={Plus} label="Nouvelle zone" onClick={onAddZone} disabled={addDisabled} />
        <FloatingIconButton
          icon={Pencil}
          label={editing ? 'Terminer la modification' : 'Modifier la zone'}
          onClick={onToggleEdit}
          disabled={!selectedZoneId}
          active={editing}
        />
        <FloatingIconButton icon={Trash2} label="Supprimer la zone" onClick={onDelete} disabled={!selectedZoneId} />
        <FloatingIconButton icon={LocateFixed} label="Recentrer" onClick={onRecenter} disabled={recenterDisabled} />
        <FloatingIconButton
          icon={isAnalyzing ? Loader2 : Sparkles}
          label="Détection automatique"
          onClick={onAutoDetect}
          disabled={autoDetectDisabled || isAnalyzing}
          spinning={isAnalyzing}
        />
      </div>
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
      className={`flex size-12 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-30 ${
        active ? 'bg-reca-red text-white' : 'text-reca-black hover:bg-reca-snow'
      }`}
    >
      <Icon className={`size-5 ${spinning ? 'animate-spin' : ''}`} aria-hidden="true" />
    </button>
  )
}
