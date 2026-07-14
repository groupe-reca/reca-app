import { useState } from 'react'
import { Ruler } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PolygonList } from './PolygonList'
import { ZoneAreaSummary } from './ZoneAreaSummary'
import { ZoneTypeSelector } from './ZoneTypeSelector'
import { useZoneTypeSelection } from '../../hooks/useZoneTypeSelection'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'
import type { ZoneType } from '../../types/contract.types'

export type PropertyZonesContentProps = {
  zones: ContractZoneFormValues[]
  selectedZoneId: string | null
  onSelectZone: (id: string) => void
  onEditZone: (id: string) => void
  onZoomZone: (zone: ContractZoneFormValues) => void
  onRemoveZone: (id: string) => void
  mapAvailable: boolean
  onAddManualZone: (type: ZoneType, label: string, surfaceM2: number) => void
}

/**
 * Contenu pur (sans le conteneur `Card`) de la liste des zones + résumé + repli manuel
 * — extrait de `PropertyZonesPanel.tsx` (sprint012) pour être réutilisé tel quel par
 * `PropertyZonesPanel` (Desktop, dans une `Card`) et `PropertyZonesSheet` (Mobile, dans
 * un `BottomSheet`), sans dupliquer ce JSX.
 */
export function PropertyZonesContent({
  zones,
  selectedZoneId,
  onSelectZone,
  onEditZone,
  onZoomZone,
  onRemoveZone,
  mapAvailable,
  onAddManualZone,
}: PropertyZonesContentProps) {
  const manualSelection = useZoneTypeSelection()
  const [manualSurface, setManualSurface] = useState('')

  function handleAddManual() {
    const surface = Number(manualSurface)
    if (!manualSelection.resolvedLabel || !Number.isFinite(surface) || surface <= 0) return
    onAddManualZone(manualSelection.type, manualSelection.resolvedLabel, surface)
    manualSelection.reset()
    setManualSurface('')
  }

  return (
    <>
      <h2 className="text-subtitle font-semibold text-reca-black">Zones tracées</h2>

      <PolygonList
        zones={zones}
        selectedZoneId={selectedZoneId}
        onSelectZone={onSelectZone}
        onEditZone={onEditZone}
        onZoomZone={onZoomZone}
        onRemoveZone={onRemoveZone}
      />

      <ZoneAreaSummary zones={zones} />

      {!mapAvailable && (
        <div className="flex flex-col gap-3 border-t border-reca-gray-light pt-4">
          <ZoneTypeSelector selection={manualSelection} />
          <Input
            label="Surface (m²)"
            icon={Ruler}
            type="number"
            step="0.01"
            value={manualSurface}
            onChange={(event) => setManualSurface(event.target.value)}
          />
          <Button type="button" disabled={!manualSelection.resolvedLabel} onClick={handleAddManual}>
            Ajouter la zone
          </Button>
        </div>
      )}
    </>
  )
}
