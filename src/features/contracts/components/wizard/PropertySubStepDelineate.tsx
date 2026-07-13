import { useEffect, useRef, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import { PropertyMapStage } from './PropertyMapStage'
import { PolygonEditor } from './PolygonEditor'
import type { PolygonEditorHandle } from './PolygonEditor'
import { PropertyZonesPanel } from './PropertyZonesPanel'
import { ZoneToolbar } from './ZoneToolbar'
import { ZoneNamingModal } from './ZoneNamingModal'
import { boundsFromPolygon } from '../../utils/propertyBoundary'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'
import type { ZoneType } from '../../types/contract.types'
import type { PropertyNav } from './WizardStepProperty'

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

type DelineateMode = 'idle' | 'drawing' | 'editing'

type PropertySubStepDelineateProps = {
  center: [number, number]
  boundary: Polygon
  capturePath: string | null
  mapUnavailable: boolean
  onMapError: (message: string) => void
  zones: ContractZoneFormValues[]
  onAddZone: (zone: ContractZoneFormValues) => void
  onUpdateZone: (id: string, patch: Partial<ContractZoneFormValues>) => void
  onRemoveZone: (id: string) => void
  onContinue: () => void
  onNavChange: (nav: PropertyNav) => void
}

/**
 * Sous-étape 2/3 : tracé des polygones (ou saisie manuelle si la carte n'est pas
 * disponible). Sprint009 : le dessin est déclenché explicitement (barre d'outils
 * "+ Nouvelle zone"), chaque zone est typée avec une couleur associée, une zone
 * existante peut être sélectionnée pour être modifiée (sommets), zoomée ou supprimée
 * (carte ET liste — corrige la désynchronisation qui existait avant ce sprint).
 */
export function PropertySubStepDelineate({
  center,
  boundary,
  capturePath,
  mapUnavailable,
  onMapError,
  zones,
  onAddZone,
  onUpdateZone,
  onRemoveZone,
  onContinue,
  onNavChange,
}: PropertySubStepDelineateProps) {
  const [map, setMap] = useState<MapboxMap | null>(null)
  const [mode, setMode] = useState<DelineateMode>('idle')
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [pendingZone, setPendingZone] = useState<{ geojson: Polygon; surfaceM2: number } | null>(null)
  const polygonEditorRef = useRef<PolygonEditorHandle>(null)

  useEffect(() => {
    onNavChange({ onNext: onContinue, nextDisabled: zones.length === 0, action: null })
    // onContinue/onNavChange sont recréés à chaque rendu du parent — seul le nombre de
    // zones doit réellement redéclencher un nouveau rapport de nav.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zones.length])

  const mapReady = isMapboxConfigured && !mapUnavailable

  function handleAddZoneClick() {
    polygonEditorRef.current?.startDrawing()
    setMode('drawing')
  }

  function handleZoneDrawn(geojson: Polygon, surfaceM2: number) {
    setPendingZone({ geojson, surfaceM2 })
    setMode('idle')
  }

  function handleConfirmNaming(type: ZoneType, label: string) {
    if (!pendingZone) return
    const id = crypto.randomUUID()
    onAddZone({
      id,
      type,
      label,
      geojson: pendingZone.geojson,
      surfaceM2: pendingZone.surfaceM2,
      imageStoragePath: capturePath ?? 'manuel',
      ordre: zones.length,
      capturedAt: new Date().toISOString(),
    })
    polygonEditorRef.current?.confirmPending(id, type)
    setPendingZone(null)
  }

  function handleCancelNaming() {
    polygonEditorRef.current?.discardPending()
    setPendingZone(null)
  }

  function handleZoneUpdated(zoneId: string, geojson: Polygon, surfaceM2: number) {
    onUpdateZone(zoneId, { geojson, surfaceM2 })
  }

  function handleEditZone(id: string) {
    setSelectedZoneId(id)
    polygonEditorRef.current?.editZone(id)
    setMode('editing')
  }

  function handleToggleEdit() {
    if (!selectedZoneId) return
    if (mode === 'editing') {
      polygonEditorRef.current?.stopEditing()
      setMode('idle')
    } else {
      handleEditZone(selectedZoneId)
    }
  }

  function handleDeleteZone(id: string) {
    polygonEditorRef.current?.deleteZone(id)
    onRemoveZone(id)
    if (selectedZoneId === id) {
      setSelectedZoneId(null)
      setMode('idle')
    }
  }

  function handleZoomZone(zone: ContractZoneFormValues) {
    if (!map) return
    map.fitBounds(boundsFromPolygon(zone.geojson), { padding: 40, duration: 250 })
  }

  function handleModeChange(drawMode: string) {
    if (drawMode !== 'draw_polygon' && mode === 'drawing') setMode('idle')
  }

  function addManualZone(type: ZoneType, label: string, surfaceM2: number) {
    onAddZone({
      id: crypto.randomUUID(),
      type,
      label,
      geojson: EMPTY_POLYGON,
      surfaceM2: Math.round(surfaceM2 * 100) / 100,
      imageStoragePath: 'manuel',
      ordre: zones.length,
      capturedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]">
      <PropertyZonesPanel
        zones={zones}
        selectedZoneId={selectedZoneId}
        onSelectZone={setSelectedZoneId}
        onEditZone={handleEditZone}
        onZoomZone={handleZoomZone}
        onRemoveZone={handleDeleteZone}
        mapAvailable={mapReady}
        onAddManualZone={addManualZone}
      />

      <div className="flex h-full min-h-0 flex-col gap-2">
        {mapReady && (
          <ZoneToolbar
            onAddZone={handleAddZoneClick}
            addDisabled={mode !== 'idle' || pendingZone !== null}
            selectedZoneId={selectedZoneId}
            editing={mode === 'editing'}
            onToggleEdit={handleToggleEdit}
            onDelete={() => selectedZoneId && handleDeleteZone(selectedZoneId)}
          />
        )}
        <div className="min-h-0 flex-1">
          <PropertyMapStage
            ready={mapReady}
            unavailableMessage="La carte est indisponible pour le moment — ajoutez les zones manuellement dans le panneau de gauche."
            center={center}
            boundary={boundary}
            onMapError={onMapError}
            onMapReady={setMap}
          />
          {mapReady && (
            <PolygonEditor
              ref={polygonEditorRef}
              map={map}
              onZoneDrawn={handleZoneDrawn}
              onZoneUpdated={handleZoneUpdated}
              onModeChange={handleModeChange}
            />
          )}
        </div>
      </div>

      <ZoneNamingModal pendingZone={pendingZone} onConfirm={handleConfirmNaming} onCancel={handleCancelNaming} />
    </div>
  )
}
