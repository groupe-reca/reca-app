import { useEffect, useRef, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import type { PolygonEditorHandle } from '../components/wizard/PolygonEditor'
import { boundsFromPolygon } from '../utils/propertyBoundary'
import type { ContractZoneFormValues } from '../schemas/contractCreation.schema'
import type { ZoneType } from '../types/contract.types'
import type { PropertyNav } from '../components/wizard/WizardStepProperty'

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

export type DelineateMode = 'idle' | 'drawing' | 'editing'

type UseDelineateStateArgs = {
  mapUnavailable: boolean
  capturePath: string | null
  zones: ContractZoneFormValues[]
  onAddZone: (zone: ContractZoneFormValues) => void
  onUpdateZone: (id: string, patch: Partial<ContractZoneFormValues>) => void
  onRemoveZone: (id: string) => void
  onContinue: () => void
  onNavChange: (nav: PropertyNav) => void
}

/**
 * Logique de la sous-étape Délimiter (dessin/nommage/édition/suppression/zoom des
 * zones) — extraite de `PropertySubStepDelineate.tsx` (sprint012) pour être réutilisée
 * à l'identique par le Desktop (JSX inchangé) et `MobilePropertySubStepDelineate.tsx`
 * (carte plein écran + bottom sheets). Cette logique a déjà fait l'objet d'un débogage
 * approfondi en sprint009 (dessin non auto-actif, désynchronisation carte/liste au
 * Supprimer, etc.) — l'extraire plutôt que la dupliquer évite de réintroduire les mêmes
 * classes de bugs dans une seconde copie.
 */
export function useDelineateState({
  mapUnavailable,
  capturePath,
  zones,
  onAddZone,
  onUpdateZone,
  onRemoveZone,
  onContinue,
  onNavChange,
}: UseDelineateStateArgs) {
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

  return {
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
  }
}
