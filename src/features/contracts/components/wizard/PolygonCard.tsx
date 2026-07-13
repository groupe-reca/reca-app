import { Pencil, Trash2, ZoomIn } from 'lucide-react'
import { ZONE_TYPE_COLORS } from '../../constants/wizardOptions'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'

type PolygonCardProps = {
  zone: ContractZoneFormValues
  selected?: boolean
  onSelect?: () => void
  actions?: {
    onEdit?: () => void
    onZoom?: () => void
    onRemove?: () => void
  }
}

/**
 * Ligne d'une zone (swatch coloré par type + nom + surface + actions optionnelles) —
 * composant partagé, réutilisé par `PolygonList` (Délimiter, actions complètes) et
 * `SurfaceSummary` (Valider/Validation, lecture seule) pour ne pas dupliquer ce JSX
 * dans 3 endroits différents comme c'était le cas avant ce sprint.
 */
export function PolygonCard({ zone, selected = false, onSelect, actions }: PolygonCardProps) {
  return (
    <div
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      className={`flex items-center justify-between rounded-control border px-3 py-2 ${
        selected ? 'border-reca-red bg-reca-red/5' : 'border-reca-gray-light'
      } ${onSelect ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center gap-2">
        <span
          className="size-3 shrink-0 rounded-full"
          style={{ backgroundColor: ZONE_TYPE_COLORS[zone.type] }}
          aria-hidden="true"
        />
        <span className="text-body text-reca-black">{zone.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-body font-medium text-reca-black">{zone.surfaceM2.toFixed(2)} m²</span>
        {actions?.onZoom && (
          <button type="button" onClick={(event) => { event.stopPropagation(); actions.onZoom?.() }} aria-label="Zoomer sur la zone">
            <ZoomIn className="size-4 text-reca-gray-medium hover:text-reca-black" aria-hidden="true" />
          </button>
        )}
        {actions?.onEdit && (
          <button type="button" onClick={(event) => { event.stopPropagation(); actions.onEdit?.() }} aria-label="Modifier la zone">
            <Pencil className="size-4 text-reca-gray-medium hover:text-reca-black" aria-hidden="true" />
          </button>
        )}
        {actions?.onRemove && (
          <button type="button" onClick={(event) => { event.stopPropagation(); actions.onRemove?.() }} aria-label="Supprimer la zone">
            <Trash2 className="size-4 text-reca-gray-medium hover:text-red-600" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
