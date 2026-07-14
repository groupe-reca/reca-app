import { Card } from '@/components/ui/Card'
import { PolygonCard } from './PolygonCard'
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
          <PolygonCard key={zone.id} zone={zone} actions={onRemove ? { onRemove: () => onRemove(zone.id) } : undefined} />
        ))}
      </div>
      {zones.length > 0 && (
        <p className="mt-4 text-label font-medium text-reca-black">Surface totale : {total.toFixed(2)} m²</p>
      )}
    </Card>
  )
}
