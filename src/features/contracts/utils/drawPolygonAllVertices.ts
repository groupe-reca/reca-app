import MapboxDraw from '@mapbox/mapbox-gl-draw'
import type { Feature, GeoJSON, Point, Polygon, Position } from 'geojson'

/**
 * Meta custom (jamais `'vertex'`/`'feature'`/`'midpoint'`) posé sur les points
 * décoratifs ajoutés par `createDrawPolygonModeWithAllVertices` ci-dessous — choisi
 * précisément pour ne JAMAIS matcher `isVertex`/`isFeature` (sélecteurs internes de
 * Mapbox GL Draw basés sur `properties.meta`), afin que ces points restent purement
 * visuels et ne deviennent pas des cibles "clic pour terminer le polygone ici".
 */
const HISTORICAL_VERTEX_META = 'reca-historical-vertex'

function buildHistoricalVertexFeature(coordinates: Position): Feature<Point> {
  return {
    type: 'Feature',
    properties: { meta: HISTORICAL_VERTEX_META },
    geometry: { type: 'Point', coordinates },
  }
}

/**
 * Étend le mode `draw_polygon` standard de Mapbox GL Draw. Constat (confirmé en lisant
 * `node_modules/@mapbox/mapbox-gl-draw/src/modes/draw_polygon.js`, comportement
 * documenté de la librairie, pas un bug applicatif) : pendant le tracé actif, la
 * librairie n'affiche jamais qu'un point-sommet sur deux (le tout premier + l'avant-
 * dernier commis) — les sommets intermédiaires restent invisibles pendant qu'on trace,
 * alors que les segments/le remplissage du polygone continuent eux de s'afficher
 * normalement, ce qui donne l'impression que "les points disparaissent" en cours de
 * tracé (la forme complète réapparaît seulement une fois le tracé terminé, en
 * `simple_select`/`direct_select`, modes qui eux affichent tous les sommets).
 *
 * Corrigé en ajoutant un point décoratif à CHAQUE sommet déjà posé, en plus du
 * comportement d'origine (laissé intact) — voir `HISTORICAL_VERTEX_META` ci-dessus
 * pour pourquoi ces points ajoutés ne changent pas le comportement de fermeture du
 * polygone (clic sur le 1er sommet / double-clic restent les seuls déclencheurs).
 */
export function createDrawPolygonModeWithAllVertices(): MapboxDraw.DrawCustomMode {
  const base = MapboxDraw.modes.draw_polygon

  return {
    ...base,
    toDisplayFeatures(state, geojson, display) {
      const feature = geojson as Feature<Polygon>
      const isActivePolygon = feature.properties?.id === state.polygon.id
      feature.properties = { ...feature.properties, active: isActivePolygon ? 'true' : 'false' }
      if (!isActivePolygon) {
        display(feature as GeoJSON)
        return
      }

      const ring = feature.geometry.coordinates[0]
      if (!ring || ring.length === 0) return

      const coordinateCount = ring.length
      if (coordinateCount < 3) return

      // Point décoratif à chaque sommet déjà commis (exclut le tout dernier, qui suit
      // toujours le curseur — jamais encore "posé" par un clic).
      for (let i = 0; i < coordinateCount - 1; i++) {
        display(buildHistoricalVertexFeature(ring[i]) as GeoJSON)
      }

      // Comportement d'origine inchangé à partir d'ici : les 2 seuls sommets
      // réellement cliquables pour terminer le tracé.
      feature.properties.meta = 'feature'
      display(MapboxDraw.lib.createVertex(String(state.polygon.id), ring[0], '0.0', false) as GeoJSON)
      if (coordinateCount > 3) {
        const endPos = coordinateCount - 3
        display(MapboxDraw.lib.createVertex(String(state.polygon.id), ring[endPos], `0.${endPos}`, false) as GeoJSON)
      }

      if (coordinateCount <= 4) {
        const lineCoordinates = [ring[0], ring[1]]
        display({
          type: 'Feature',
          properties: feature.properties,
          geometry: { type: 'LineString', coordinates: lineCoordinates },
        } as GeoJSON)
        if (coordinateCount === 3) return
      }

      display(feature as GeoJSON)
    },
  }
}

export { HISTORICAL_VERTEX_META }
