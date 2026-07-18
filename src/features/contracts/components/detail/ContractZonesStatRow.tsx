import { Button } from '@/components/ui/Button'
import { formatDateLong } from '@/lib/format'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'

type ContractZonesStatRowProps = {
  zones: ContractZoneFormValues[]
  onViewTrace: () => void
}

/** Rangée compacte, rendue à l'intérieur de `ContractMapCard` : surface totale, nombre de zones, dernière modification. */
export function ContractZonesStatRow({ zones, onViewTrace }: ContractZonesStatRowProps) {
  const total = zones.reduce((sum, zone) => sum + zone.surfaceM2, 0)
  const lastCapturedAt = zones.reduce<string | null>(
    (latest, zone) => (!latest || zone.capturedAt > latest ? zone.capturedAt : latest),
    null,
  )

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-6 pt-4">
      <div className="flex flex-wrap items-center gap-6 text-body">
        <div>
          <p className="text-label text-reca-gray-medium">Surface totale</p>
          <p className="font-medium text-reca-black">{total.toFixed(2)} m²</p>
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">Nombre de zones</p>
          <p className="font-medium text-reca-black">{zones.length}</p>
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">Dernière modification</p>
          <p className="font-medium text-reca-black">{lastCapturedAt ? formatDateLong(lastCapturedAt) : '—'}</p>
        </div>
      </div>
      <Button variant="secondary" onClick={onViewTrace}>
        Voir le tracé complet
      </Button>
    </div>
  )
}
