import { useEffect, useRef, useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import area from '@turf/area'
import { isMapboxConfigured } from '@/lib/mapboxClient'
import { toast } from '@/stores/toastStore'
import type { PolygonEditorHandle } from '../components/wizard/PolygonEditor'
import { boundsFromPolygon } from '../utils/propertyBoundary'
import { contourToPolygon } from '../utils/satelliteZoneProjection'
import { analyzeSatelliteImage } from '../services/satelliteAnalysis.service'
import { useContractWizardDefaults } from './useContractWizardDefaults'
import { DEFAULT_AI_PROMPT_DETECTION } from '../types/contractWizardDefaults.types'
import { usePropertyCapture } from './usePropertyCapture'
import type { ContractZoneFormValues } from '../schemas/contractCreation.schema'
import type { ZoneType } from '../types/contract.types'
import type { MapViewport } from './usePropertyCapture'
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
  contractId: string
  /** Contour de démonstration — transmis à `usePropertyCapture` (même signature que Locate). */
  boundary: Polygon | null
  mapUnavailable: boolean
  capturePath: string | null
  /** Cadrage capturé à Localiser (tâche 12) — nécessaire pour réaligner la caméra avant de déprojeter les suggestions Gemini. */
  viewport: MapViewport | null
  zones: ContractZoneFormValues[]
  onAddZone: (zone: ContractZoneFormValues) => void
  /** Ajout groupé (détection automatique) — une seule mise à jour d'état pour tout le lot, voir `usePropertyStepState.addZones`. */
  onAddZones: (zones: ContractZoneFormValues[]) => void
  onUpdateZone: (id: string, patch: Partial<ContractZoneFormValues>) => void
  onRemoveZone: (id: string) => void
  /** Reporte la nouvelle capture (tâche 8) — même callback que Locate (`usePropertyStepState.handleCaptured`). */
  onCaptured: (path: string, viewport: MapViewport) => void
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
  contractId,
  boundary,
  mapUnavailable,
  capturePath,
  viewport,
  zones,
  onAddZone,
  onAddZones,
  onUpdateZone,
  onRemoveZone,
  onCaptured,
  onContinue,
  onNavChange,
}: UseDelineateStateArgs) {
  const [map, setMap] = useState<MapboxMap | null>(null)
  const [mode, setMode] = useState<DelineateMode>('idle')
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null)
  const [pendingZone, setPendingZone] = useState<{ geojson: Polygon; surfaceM2: number } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const polygonEditorRef = useRef<PolygonEditorHandle>(null)
  const { data: wizardDefaults } = useContractWizardDefaults()
  const { capture: captureWithZones, isCapturing: isCapturingFinal } = usePropertyCapture(map, contractId, boundary)

  const mapReady = isMapboxConfigured && !mapUnavailable

  /**
   * Tâche 8 : recapture la carte (zones colorées déjà visibles dessus) en quittant
   * Délimiter, pour que le document du contrat ait une vraie photo satellite AVEC les
   * zones tracées — la capture de Localiser précède le tracé, elle ne les montre jamais.
   * Toutes les zones existantes sont réassignées à cette nouvelle capture (elles
   * pointaient jusqu'ici vers l'image de Localiser, prise avant leur tracé).
   */
  async function handleContinueWithCapture() {
    if (map) {
      const result = await captureWithZones()
      if (result) {
        onCaptured(result.storagePath, result.viewport)
        zones.forEach((zone) => onUpdateZone(zone.id, { imageStoragePath: result.storagePath }))
      }
    }
    onContinue()
  }

  useEffect(() => {
    onNavChange({
      onNext: handleContinueWithCapture,
      nextDisabled: zones.length === 0 || isCapturingFinal,
      action: null,
      immersive: mapReady,
    })
    // onContinue/onNavChange/handleContinueWithCapture sont recréés à chaque rendu du
    // parent — seuls le nombre de zones, la disponibilité de la carte et l'état de la
    // recapture finale doivent réellement redéclencher un nouveau rapport de nav.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zones.length, mapReady, isCapturingFinal])

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

  async function handleAutoDetect() {
    if (!capturePath || !map) return
    setIsAnalyzing(true)
    try {
      const result = await analyzeSatelliteImage(
        capturePath,
        wizardDefaults?.aiProvider ?? 'google',
        wizardDefaults?.aiModel ?? 'flash',
        wizardDefaults?.aiPromptDetection ?? DEFAULT_AI_PROMPT_DETECTION,
      )

      if (result.qualite_image === 'insuffisante') {
        toast.error(
          result.raison_qualite
            ? `Image insuffisante pour la détection automatique — ${result.raison_qualite}`
            : 'Image insuffisante pour la détection automatique — continuez en mode manuel.',
        )
        return
      }

      if (result.zones.length === 0) {
        toast.error('Aucun stationnement détecté automatiquement — continuez en mode manuel.')
        return
      }

      // Réaligne la caméra sur le cadrage exact utilisé au moment de la capture, sans
      // quoi la déprojection pixel→lng/lat des bounding boxes Gemini serait décalée.
      if (viewport) map.jumpTo({ center: viewport.center, zoom: viewport.zoom })

      // Construites en une seule fois puis ajoutées via `onAddZones` (mise à jour
      // groupée) — plusieurs appels synchrones à `onAddZone` dans cette boucle
      // écraseraient les précédents (fermeture `zones` figée entre les appels, seul le
      // dernier survivrait). `addSuggestedZone` (Draw) reste appelé par zone : son état
      // interne est impératif, pas concerné par ce problème.
      const newZones: ContractZoneFormValues[] = result.zones.map((suggestion, index) => {
        const geojson = contourToPolygon(suggestion.contour, map)
        const surfaceM2 = Math.round(area({ type: 'Feature', properties: {}, geometry: geojson }) * 100) / 100
        const id = crypto.randomUUID()
        polygonEditorRef.current?.addSuggestedZone(geojson, id, 'stationnement')
        return {
          id,
          type: 'stationnement',
          label: 'Stationnement',
          geojson,
          surfaceM2,
          imageStoragePath: capturePath,
          ordre: zones.length + index,
          capturedAt: new Date().toISOString(),
        }
      })
      onAddZones(newZones)

      const zonesLabel =
        result.zones.length === 1
          ? '1 zone de stationnement suggérée'
          : `${result.zones.length} zones de stationnement suggérées`
      toast.success(`${zonesLabel} — ajustez les contours si nécessaire.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Impossible d'analyser l'image satellite.")
    } finally {
      setIsAnalyzing(false)
    }
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
    isAnalyzing,
    handleAutoDetect,
  }
}
