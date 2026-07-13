import { useEffect, useRef } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import area from '@turf/area'
import type { Feature, Polygon } from 'geojson'

type PolygonEditorProps = {
  map: MapboxMap | null
  onZoneDrawn: (geojson: Polygon, surfaceM2: number) => void
}

/**
 * Tracé de polygones à la souris (clic-clic-clic-terminer, comme Google Maps) via
 * Mapbox GL Draw, avec calcul de surface GPS (Turf.js — précision maximale, aucune
 * approximation basée sur les pixels). Le mode dessin se réactive après chaque zone
 * complétée pour permettre d'en tracer plusieurs à la suite.
 */
export function PolygonEditor({ map, onZoneDrawn }: PolygonEditorProps) {
  const onZoneDrawnRef = useRef(onZoneDrawn)
  useEffect(() => {
    onZoneDrawnRef.current = onZoneDrawn
  })

  useEffect(() => {
    if (!map) return

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    })
    map.addControl(draw)
    draw.changeMode('draw_polygon')

    function handleCreate(event: { features: Feature<Polygon>[] }) {
      const feature = event.features[0]
      if (!feature) return
      const surfaceM2 = Math.round(area(feature) * 100) / 100
      // Mapbox GL Draw renvoie un objet géométrie interne (pas un GeoJSON brut) — le
      // sérialiser en JSON plain object évite de propager des références internes de
      // Draw jusque dans le state RHF/Zod (source d'un stack overflow en aval sinon).
      const geojson = JSON.parse(JSON.stringify(feature.geometry)) as Polygon
      onZoneDrawnRef.current(geojson, surfaceM2)
      // Rappeler changeMode() de façon synchrone depuis le gestionnaire de son propre
      // événement draw.create fait re-rentrer Mapbox GL Draw dans son propre cycle
      // interne de fin/début de mode (onStop → fire → ... ) et provoque un stack
      // overflow (RangeError observé en test réel). Reporter l'appel au tick suivant
      // laisse le cycle d'événements actuel se terminer proprement avant de relancer
      // le mode dessin pour permettre le tracé d'une zone suivante.
      setTimeout(() => draw.changeMode('draw_polygon'), 0)
    }

    map.on('draw.create', handleCreate)

    return () => {
      // PropertyMap (le parent de la carte) peut déjà avoir détruit l'instance Mapbox
      // au moment où ce nettoyage s'exécute (changement de sous-étape) — Draw lève alors
      // une exception interne en tentant de se désabonner d'un état déjà démantelé.
      // Sans impact fonctionnel puisque la carte entière disparaît de toute façon.
      try {
        map.off('draw.create', handleCreate)
        map.removeControl(draw)
      } catch {
        // ignoré — nettoyage best-effort pendant le démontage
      }
    }
  }, [map])

  return null
}
