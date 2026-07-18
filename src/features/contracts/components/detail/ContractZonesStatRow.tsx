import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatDateLong } from '@/lib/format'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'

type ContractZonesStatRowProps = {
  zones: ContractZoneFormValues[]
  onEditZones: () => void
}

/** Rangée compacte sous la carte : surface totale, nombre de zones, dernière modification. */
export function ContractZonesStatRow({ zones, onEditZones }: ContractZonesStatRowProps) {
  const total = zones.reduce((sum, zone) => sum + zone.surfaceM2, 0)
  const lastCapturedAt = zones.reduce<string | null>(
    (latest, zone) => (!latest || zone.capturedAt > latest ? zone.capturedAt : latest),
    null,
  )

  return (
    <Card className="flex flex-wrap items-center justify-between gap-4">
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
      <Button variant="secondary" onClick={onEditZones}>
        <Pencil className="size-4" aria-hidden="true" />
        Modifier les zones
      </Button>
    </Card>
  )
}
