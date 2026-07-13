import { useState } from 'react'
import { Ruler } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { PolygonList } from './PolygonList'
import { ZoneAreaSummary } from './ZoneAreaSummary'
import { ZoneTypeSelector } from './ZoneTypeSelector'
import { useZoneTypeSelection } from '../../hooks/useZoneTypeSelection'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'
import type { ZoneType } from '../../types/contract.types'

type PropertyZonesPanelProps = {
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
 * Panneau colonne gauche (30%) de la sous-étape Délimiter — même cadre que
 * `PropertyInfoPanel` (Localiser), mais montre les zones tracées plutôt que
 * l'adresse du client (tâche 3). Sprint009 : la confirmation d'une zone tout juste
 * tracée se fait désormais dans `ZoneNamingModal` (rendue par le parent), plus ici —
 * ce panneau ne porte plus que la liste (avec actions Modifier/Zoomer/Supprimer), le
 * résumé par type, et le formulaire de secours manuel.
 */
export function PropertyZonesPanel({
  zones,
  selectedZoneId,
  onSelectZone,
  onEditZone,
  onZoomZone,
  onRemoveZone,
  mapAvailable,
  onAddManualZone,
}: PropertyZonesPanelProps) {
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
    <Card className="flex h-fit flex-col gap-4">
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
    </Card>
  )
}
