import { ZONE_TYPE_OPTIONS } from '../../constants/wizardOptions'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'

type ZoneAreaSummaryProps = {
  zones: ContractZoneFormValues[]
}

/** Résumé : nombre de zones, surface totale, sous-total par type (uniquement les types présents). */
export function ZoneAreaSummary({ zones }: ZoneAreaSummaryProps) {
  if (zones.length === 0) return null

  const total = zones.reduce((sum, zone) => sum + zone.surfaceM2, 0)
  const byType = ZONE_TYPE_OPTIONS.map((option) => ({
    ...option,
    subtotal: zones.filter((zone) => zone.type === option.code).reduce((sum, zone) => sum + zone.surfaceM2, 0),
  })).filter((entry) => entry.subtotal > 0)

  return (
    <div className="flex flex-col gap-2 border-t border-reca-gray-light pt-4">
      <p className="text-label font-medium text-reca-black">
        {zones.length} zone{zones.length > 1 ? 's' : ''} — {total.toFixed(2)} m² au total
      </p>
      <div className="flex flex-col gap-1">
        {byType.map((entry) => (
          <div key={entry.code} className="flex items-center justify-between text-label text-reca-gray-medium">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color }} aria-hidden="true" />
              {entry.label}
            </span>
            <span>{entry.subtotal.toFixed(2)} m²</span>
          </div>
        ))}
      </div>
    </div>
  )
}
