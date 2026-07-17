import { useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { PropertyMapStage } from '../wizard/PropertyMapStage'
import { PolygonEditor } from '../wizard/PolygonEditor'
import { ZoneNamingModal } from '../wizard/ZoneNamingModal'
import { useDelineateState } from '../../hooks/useDelineateState'
import type { MapViewport } from '../../hooks/usePropertyCapture'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'
import type { PropertyNav } from '../wizard/WizardStepProperty'
import { PropertyZonesSheet } from './PropertyZonesSheet'
import { ZoneToolbarFloating } from './ZoneToolbarFloating'
import { ZoneDetailSheet } from './ZoneDetailSheet'

type MobilePropertySubStepDelineateProps = {
  center: [number, number]
  boundary: Polygon
  capturePath: string | null
  /** Cadrage déjà capturé à Localiser (persiste ici) — voir `PropertyMapStage`. */
  initialViewport: MapViewport | null
  mapUnavailable: boolean
  onMapError: (message: string) => void
  zones: ContractZoneFormValues[]
  onAddZone: (zone: ContractZoneFormValues) => void
  /** Ajout groupé (détection automatique) — une seule mise à jour d'état pour tout le lot, voir `usePropertyStepState.addZones`. */
  onAddZones: (zones: ContractZoneFormValues[]) => void
  onUpdateZone: (id: string, patch: Partial<ContractZoneFormValues>) => void
  onRemoveZone: (id: string) => void
  onContinue: () => void
  onNavChange: (nav: PropertyNav) => void
}

/**
 * Sous-étape 2/3 mobile (sprint012, Phase D) — même logique que Desktop
 * (`useDelineateState`, partagée), carte plein écran avec outils flottants
 * (`ZoneToolbarFloating`) et zones dans un `BottomSheet` (`PropertyZonesSheet`) au lieu
 * du panneau fixe 30%. Sélectionner une zone (tap dans la liste) ouvre en plus
 * `ZoneDetailSheet` (nom/surface réels + placeholder services/notes/photos/priorité).
 */
export function MobilePropertySubStepDelineate({
  center,
  boundary,
  capturePath,
  initialViewport,
  mapUnavailable,
  onMapError,
  zones,
  onAddZone,
  onAddZones,
  onUpdateZone,
  onRemoveZone,
  onContinue,
  onNavChange,
}: MobilePropertySubStepDelineateProps) {
  const [detailZoneId, setDetailZoneId] = useState<string | null>(null)
  const [recenter, setRecenter] = useState<(() => void) | null>(null)

  const {
    map,
    setMap,
    mode,
    selectedZoneId,
    setSelectedZoneId,
    pendingZone,
    polygonEditorRef,
    mapReady,
    handleAddZoneClick,
    handleZoneDrawn,
    handleConfirmNaming,
    handleCancelNaming,
    handleZoneUpdated,
    handleEditZone,
    handleToggleEdit,
    handleDeleteZone,
    handleZoomZone,
    handleModeChange,
    addManualZone,
    isAnalyzing,
    handleAutoDetect,
  } = useDelineateState({
    mapUnavailable,
    capturePath,
    viewport: initialViewport,
    zones,
    onAddZone,
    onAddZones,
    onUpdateZone,
    onRemoveZone,
    onContinue,
    onNavChange,
  })

  function handleSelectZone(id: string) {
    setSelectedZoneId(id)
    setDetailZoneId(id)
  }

  function handleMapReady(instance: MapboxMap) {
    setMap(instance)
  }

  const detailZone = zones.find((zone) => zone.id === detailZoneId) ?? null

  return (
    <div className="relative h-full">
      <PropertyMapStage
        ready={mapReady}
        unavailableMessage="La carte est indisponible pour le moment — ajoutez les zones manuellement dans la feuille du bas."
        center={center}
        boundary={boundary}
        initialViewport={initialViewport}
        onMapError={onMapError}
        onMapReady={handleMapReady}
        onRecenterReady={(fn) => setRecenter(() => fn)}
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

      {mapReady && (
        <ZoneToolbarFloating
          onAddZone={handleAddZoneClick}
          addDisabled={mode !== 'idle' || pendingZone !== null}
          selectedZoneId={selectedZoneId}
          editing={mode === 'editing'}
          onToggleEdit={handleToggleEdit}
          onDelete={() => selectedZoneId && handleDeleteZone(selectedZoneId)}
          onRecenter={() => recenter?.()}
          recenterDisabled={!recenter}
          onAutoDetect={handleAutoDetect}
          autoDetectDisabled={!capturePath || mode !== 'idle' || pendingZone !== null}
          isAnalyzing={isAnalyzing}
        />
      )}

      <PropertyZonesSheet
        zones={zones}
        selectedZoneId={selectedZoneId}
        onSelectZone={handleSelectZone}
        onEditZone={handleEditZone}
        onZoomZone={handleZoomZone}
        onRemoveZone={handleDeleteZone}
        mapAvailable={mapReady}
        onAddManualZone={addManualZone}
      />

      <ZoneDetailSheet zone={detailZone} onClose={() => setDetailZoneId(null)} />
      <ZoneNamingModal pendingZone={pendingZone} onConfirm={handleConfirmNaming} onCancel={handleCancelNaming} />
    </div>
  )
}
