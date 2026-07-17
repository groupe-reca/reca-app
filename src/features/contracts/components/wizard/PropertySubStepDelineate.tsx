import type { Polygon } from 'geojson'
import { PropertyMapStage } from './PropertyMapStage'
import { PolygonEditor } from './PolygonEditor'
import { PropertyZonesPanel } from './PropertyZonesPanel'
import { ZoneToolbar } from './ZoneToolbar'
import { ZoneNamingModal } from './ZoneNamingModal'
import { useDelineateState } from '../../hooks/useDelineateState'
import type { MapViewport } from '../../hooks/usePropertyCapture'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'
import type { PropertyNav } from './WizardStepProperty'

type PropertySubStepDelineateProps = {
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
 * Sous-étape 2/3 : tracé des polygones (ou saisie manuelle si la carte n'est pas
 * disponible). Consomme désormais `useDelineateState` (extraction sprint012, pour
 * réutilisation par `MobilePropertySubStepDelineate.tsx`) — JSX/comportement inchangés.
 */
export function PropertySubStepDelineate({
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
}: PropertySubStepDelineateProps) {
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
            onAutoDetect={handleAutoDetect}
            autoDetectDisabled={!capturePath || mode !== 'idle' || pendingZone !== null}
            isAnalyzing={isAnalyzing}
          />
        )}
        <div className="min-h-0 flex-1">
          <PropertyMapStage
            ready={mapReady}
            unavailableMessage="La carte est indisponible pour le moment — ajoutez les zones manuellement dans le panneau de gauche."
            center={center}
            boundary={boundary}
            initialViewport={initialViewport}
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
