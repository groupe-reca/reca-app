import { Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'

type SurfaceSummaryProps = {
  zones: ContractZoneFormValues[]
  onRemove?: (id: string) => void
}

/** Liste des zones tracées + surface totale — réutilisé dans la sous-étape Valider et l'étape Validation finale. */
export function SurfaceSummary({ zones, onRemove }: SurfaceSummaryProps) {
  const total = zones.reduce((sum, zone) => sum + zone.surfaceM2, 0)

  return (
    <Card>
      <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Zones tracées</h2>
      {zones.length === 0 && <p className="text-body text-reca-gray-medium">Aucune zone tracée pour l'instant.</p>}
      <div className="flex flex-col gap-2">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="flex items-center justify-between rounded-control border border-reca-gray-light px-3 py-2"
          >
            <span className="text-body text-reca-black">{zone.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-body font-medium text-reca-black">{zone.surfaceM2.toFixed(2)} m²</span>
              {onRemove && (
                <button type="button" onClick={() => onRemove(zone.id)} aria-label="Retirer la zone">
                  <Trash2 className="size-4 text-reca-gray-medium hover:text-red-600" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {zones.length > 0 && (
        <p className="mt-4 text-label font-medium text-reca-black">Surface totale : {total.toFixed(2)} m²</p>
      )}
    </Card>
  )
}
