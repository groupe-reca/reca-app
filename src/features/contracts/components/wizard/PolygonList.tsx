import { PolygonCard } from './PolygonCard'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'

type PolygonListProps = {
  zones: ContractZoneFormValues[]
  selectedZoneId: string | null
  onSelectZone: (id: string) => void
  onEditZone: (id: string) => void
  onZoomZone: (zone: ContractZoneFormValues) => void
  onRemoveZone: (id: string) => void
}

/** Liste des zones tracées, séparateurs entre chaque ligne + ligne TOTAL en bas. */
export function PolygonList({ zones, selectedZoneId, onSelectZone, onEditZone, onZoomZone, onRemoveZone }: PolygonListProps) {
  const total = zones.reduce((sum, zone) => sum + zone.surfaceM2, 0)

  if (zones.length === 0) {
    return <p className="text-body text-reca-gray-medium">Aucune zone tracée pour l'instant.</p>
  }

  return (
    <div className="flex flex-col">
      {zones.map((zone, index) => (
        <div key={zone.id} className={index > 0 ? 'mt-2 border-t border-reca-gray-light pt-2' : ''}>
          <PolygonCard
            zone={zone}
            selected={zone.id === selectedZoneId}
            onSelect={() => onSelectZone(zone.id)}
            actions={{
              onEdit: () => onEditZone(zone.id),
              onZoom: () => onZoomZone(zone),
              onRemove: () => onRemoveZone(zone.id),
            }}
          />
        </div>
      ))}
      <div className="mt-3 flex items-center justify-between border-t border-reca-gray-light pt-3">
        <span className="text-label font-semibold text-reca-black">TOTAL</span>
        <span className="text-label font-semibold text-reca-black">{total.toFixed(2)} m²</span>
      </div>
    </div>
  )
}
