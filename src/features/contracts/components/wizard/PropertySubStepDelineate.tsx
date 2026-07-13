import { useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { MapPin, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import { PropertyMap } from './PropertyMap'
import { PolygonEditor } from './PolygonEditor'
import { SurfaceSummary } from './SurfaceSummary'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'

const EMPTY_POLYGON: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  ],
}

type PropertySubStepDelineateProps = {
  center: [number, number]
  capturePath: string | null
  mapUnavailable: boolean
  onMapError: (message: string) => void
  zones: ContractZoneFormValues[]
  onAddZone: (zone: ContractZoneFormValues) => void
  onRemoveZone: (id: string) => void
  onContinue: () => void
}

/** Sous-étape 2/3 : tracé des polygones (ou saisie manuelle si la carte n'est pas disponible). */
export function PropertySubStepDelineate({
  center,
  capturePath,
  mapUnavailable,
  onMapError,
  zones,
  onAddZone,
  onRemoveZone,
  onContinue,
}: PropertySubStepDelineateProps) {
  const [map, setMap] = useState<MapboxMap | null>(null)
  const [pendingZone, setPendingZone] = useState<{ geojson: Polygon; surfaceM2: number } | null>(null)
  const [label, setLabel] = useState('')
  const [manualLabel, setManualLabel] = useState('')
  const [manualSurface, setManualSurface] = useState('')

  function confirmPendingZone() {
    if (!pendingZone) return
    onAddZone({
      id: crypto.randomUUID(),
      label: label.trim() || `Zone ${zones.length + 1}`,
      geojson: pendingZone.geojson,
      surfaceM2: pendingZone.surfaceM2,
      imageStoragePath: capturePath ?? 'manuel',
      ordre: zones.length,
      capturedAt: new Date().toISOString(),
    })
    setPendingZone(null)
    setLabel('')
  }

  function addManualZone() {
    const surface = Number(manualSurface)
    if (!manualLabel.trim() || !Number.isFinite(surface) || surface <= 0) return
    onAddZone({
      id: crypto.randomUUID(),
      label: manualLabel.trim(),
      geojson: EMPTY_POLYGON,
      surfaceM2: Math.round(surface * 100) / 100,
      imageStoragePath: 'manuel',
      ordre: zones.length,
      capturedAt: new Date().toISOString(),
    })
    setManualLabel('')
    setManualSurface('')
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h2 className="mb-1 text-subtitle font-semibold text-reca-black">Délimiter les zones</h2>
        <p className="text-body text-reca-gray-medium">
          {isMapboxConfigured && !mapUnavailable
            ? 'Tracez un polygone autour de chaque zone à déneiger (clic, clic, clic… puis terminer). Vous pouvez tracer plusieurs zones.'
            : "La carte n'est pas disponible pour le moment — ajoutez les zones manuellement en attendant."}
        </p>
      </Card>

      {isMapboxConfigured && !mapUnavailable ? (
        <>
          <PropertyMap center={center} onMapReady={setMap} onError={onMapError} />
          <PolygonEditor map={map} onZoneDrawn={(geojson, surfaceM2) => setPendingZone({ geojson, surfaceM2 })} />
          {pendingZone && (
            <Card>
              <p className="mb-2 text-body text-reca-black">Zone tracée : {pendingZone.surfaceM2.toFixed(2)} m²</p>
              <div className="flex items-end gap-3">
                <Input
                  label="Nom de la zone"
                  icon={MapPin}
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  placeholder="Entrée, Stationnement, Trottoir…"
                />
                <Button type="button" onClick={confirmPendingZone}>
                  Ajouter la zone
                </Button>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <div className="flex items-end gap-3">
            <Input
              label="Nom de la zone"
              icon={MapPin}
              value={manualLabel}
              onChange={(event) => setManualLabel(event.target.value)}
              placeholder="Entrée, Stationnement, Trottoir…"
            />
            <Input
              label="Surface (m²)"
              icon={Ruler}
              type="number"
              step="0.01"
              value={manualSurface}
              onChange={(event) => setManualSurface(event.target.value)}
            />
            <Button type="button" onClick={addManualZone}>
              Ajouter la zone
            </Button>
          </div>
        </Card>
      )}

      <SurfaceSummary zones={zones} onRemove={onRemoveZone} />

      <div className="flex justify-end">
        <Button type="button" disabled={zones.length === 0} onClick={onContinue}>
          Continuer vers la validation
        </Button>
      </div>
    </div>
  )
}
