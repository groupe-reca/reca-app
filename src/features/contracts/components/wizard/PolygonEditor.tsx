import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import area from '@turf/area'
import type { Feature, Polygon } from 'geojson'
import { ZONE_DRAW_STYLES } from '../../constants/zoneDrawStyles'
import type { ZoneType } from '../../types/contract.types'

export type PolygonEditorHandle = {
  /** Démarre le tracé d'une nouvelle zone (mode dessin, sur clic explicite du bouton "+ Nouvelle zone"). */
  startDrawing: () => void
  /** Tague la géométrie tout juste tracée avec l'id/type de zone confirmés dans la fenêtre de nommage. */
  confirmPending: (zoneId: string, type: ZoneType) => void
  /** Annulation de la fenêtre de nommage : retire la géométrie tout juste tracée (jamais laissée orpheline). */
  discardPending: () => void
  /** Entre en édition des sommets d'une zone déjà confirmée. */
  editZone: (zoneId: string) => void
  /** Sort du mode édition. */
  stopEditing: () => void
  /** Supprime une zone déjà confirmée de l'état interne de Draw (corrige la désynchronisation carte/liste). */
  deleteZone: (zoneId: string) => void
}

type PolygonEditorProps = {
  map: MapboxMap | null
  onZoneDrawn: (geojson: Polygon, surfaceM2: number) => void
  onZoneUpdated: (zoneId: string, geojson: Polygon, surfaceM2: number) => void
  onModeChange?: (mode: string) => void
}

/**
 * Tracé de polygones à la souris (clic-clic-clic-double-clic, comme les outils
 * professionnels) via Mapbox GL Draw, avec calcul de surface GPS (Turf.js — précision
 * maximale, aucune approximation basée sur les pixels). Sprint009 : le dessin ne
 * démarre plus automatiquement au montage — il est piloté impérativement par le
 * parent (`startDrawing`/`editZone`/`deleteZone`...) via ce handle, déclenché
 * explicitement par la barre d'outils (+ Nouvelle zone / Modifier / Supprimer).
 */
export const PolygonEditor = forwardRef<PolygonEditorHandle, PolygonEditorProps>(function PolygonEditor(
  { map, onZoneDrawn, onZoneUpdated, onModeChange },
  ref,
) {
  const drawRef = useRef<MapboxDraw | null>(null)
  const lastCreatedFeatureIdRef = useRef<string | null>(null)

  const onZoneDrawnRef = useRef(onZoneDrawn)
  const onZoneUpdatedRef = useRef(onZoneUpdated)
  const onModeChangeRef = useRef(onModeChange)
  useEffect(() => {
    onZoneDrawnRef.current = onZoneDrawn
    onZoneUpdatedRef.current = onZoneUpdated
    onModeChangeRef.current = onModeChange
  })

  useImperativeHandle(
    ref,
    () => ({
      startDrawing() {
        drawRef.current?.changeMode('draw_polygon')
      },
      confirmPending(zoneId, type) {
        const draw = drawRef.current
        const featureId = lastCreatedFeatureIdRef.current
        if (!draw || !featureId) return
        draw.setFeatureProperty(featureId, 'zoneId', zoneId)
        draw.setFeatureProperty(featureId, 'zoneType', type)
        lastCreatedFeatureIdRef.current = null
      },
      discardPending() {
        const draw = drawRef.current
        const featureId = lastCreatedFeatureIdRef.current
        if (!draw || !featureId) return
        draw.delete(featureId)
        lastCreatedFeatureIdRef.current = null
      },
      editZone(zoneId) {
        const draw = drawRef.current
        if (!draw) return
        const feature = draw.getAll().features.find((f) => f.properties?.zoneId === zoneId)
        if (feature?.id == null) return
        draw.changeMode('direct_select', { featureId: String(feature.id) })
      },
      stopEditing() {
        const draw = drawRef.current
        if (draw && draw.getMode() !== 'simple_select') draw.changeMode('simple_select')
      },
      deleteZone(zoneId) {
        const draw = drawRef.current
        if (!draw) return
        const feature = draw.getAll().features.find((f) => f.properties?.zoneId === zoneId)
        if (feature?.id == null) return
        draw.delete(String(feature.id))
      },
    }),
    [],
  )

  useEffect(() => {
    if (!map) return

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {},
      styles: ZONE_DRAW_STYLES,
      // Nécessaire pour que les propriétés custom posées via setFeatureProperty
      // (zoneId/zoneType) soient exposées en style sous le préfixe `user_` — sans ce
      // flag, Draw les garde en interne mais ne les expose jamais aux expressions
      // `paint` (['get', 'user_zoneType'] renvoie toujours null), et la couleur par
      // type retombe silencieusement sur le bleu par défaut dès qu'une zone est
      // désélectionnée. Confirmé en test réel (2e/3e zone bleues au lieu de leur
      // couleur de type une fois désélectionnées) avant ce correctif.
      userProperties: true,
    })
    map.addControl(draw)
    drawRef.current = draw

    function handleCreate(event: { features: Feature<Polygon>[] }) {
      const feature = event.features[0]
      if (!feature || feature.id == null) return
      const surfaceM2 = Math.round(area(feature) * 100) / 100
      // Mapbox GL Draw renvoie un objet géométrie interne (pas un GeoJSON brut) — le
      // sérialiser en JSON plain object évite de propager des références internes de
      // Draw jusque dans le state RHF/Zod (source d'un stack overflow en aval sinon).
      const geojson = JSON.parse(JSON.stringify(feature.geometry)) as Polygon
      lastCreatedFeatureIdRef.current = String(feature.id)
      onZoneDrawnRef.current(geojson, surfaceM2)
      // Contrairement à l'ancien comportement (sprint007/008), le mode dessin n'est plus
      // relancé automatiquement ici : sprint009 veut une zone à la fois, sur déclenchement
      // explicite du bouton "+ Nouvelle zone". Rappel : tout futur rappel de changeMode()
      // depuis un gestionnaire draw.* doit rester différé via setTimeout(...,0) — un appel
      // synchrone fait re-rentrer Draw dans son propre cycle interne (stack overflow
      // observé en test réel) — cette règle n'a simplement plus de site d'appel ici.
    }

    function handleUpdate(event: { features: Feature<Polygon>[] }) {
      for (const feature of event.features) {
        const zoneId = feature.properties?.zoneId
        if (typeof zoneId !== 'string') continue
        const surfaceM2 = Math.round(area(feature) * 100) / 100
        const geojson = JSON.parse(JSON.stringify(feature.geometry)) as Polygon
        onZoneUpdatedRef.current(zoneId, geojson, surfaceM2)
      }
    }

    function handleModeChange(event: { mode: string }) {
      onModeChangeRef.current?.(event.mode)
    }

    map.on('draw.create', handleCreate)
    map.on('draw.update', handleUpdate)
    map.on('draw.modechange', handleModeChange)

    return () => {
      // PropertyMap (le parent de la carte) peut déjà avoir détruit l'instance Mapbox
      // au moment où ce nettoyage s'exécute (changement de sous-étape) — Draw lève alors
      // une exception interne en tentant de se désabonner d'un état déjà démantelé.
      // Sans impact fonctionnel puisque la carte entière disparaît de toute façon.
      try {
        map.off('draw.create', handleCreate)
        map.off('draw.update', handleUpdate)
        map.off('draw.modechange', handleModeChange)
        map.removeControl(draw)
      } catch {
        // ignoré — nettoyage best-effort pendant le démontage
      }
      drawRef.current = null
    }
  }, [map])

  return null
})
