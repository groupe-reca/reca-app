import { ZONE_TYPE_COLORS } from './wizardOptions'

const blue = '#3bb2d0'
const orange = '#fbb03b'
const white = '#fff'

/** Correspondance type de zone → couleur, lisible par une expression Mapbox GL `match`. */
const zoneTypeColorMatch: unknown[] = ['match', ['get', 'user_zoneType']]
for (const [type, color] of Object.entries(ZONE_TYPE_COLORS)) {
  zoneTypeColorMatch.push(type, color)
}
zoneTypeColorMatch.push(blue) // fallback : zone tout juste tracée, pas encore typée

/**
 * Thème Mapbox GL Draw (sprint009) — copie exacte du thème par défaut de
 * `@mapbox/mapbox-gl-draw` (7 couches, `node_modules/@mapbox/mapbox-gl-draw/src/lib/theme.js`,
 * cette version du paquet n'a PAS le thème ~15 couches vu dans certains exemples en ligne),
 * en ne modifiant que les 2 couches polygone (remplissage + contour) pour appliquer la
 * couleur du type de zone (`user_zoneType`, propriété custom posée via
 * `draw.setFeatureProperty` — Mapbox la préfixe automatiquement par `user_` au rendu).
 * `active === 'true'` (propriété réservée de Draw) reste prioritaire pour le feedback
 * visuel de sélection, comme dans le thème d'origine.
 */
export const ZONE_DRAW_STYLES = [
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: ['all', ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': ['case', ['==', ['get', 'active'], 'true'], orange, zoneTypeColorMatch],
      'fill-opacity': 0.35,
    },
  },
  {
    id: 'gl-draw-lines',
    type: 'line',
    filter: ['any', ['==', '$type', 'LineString'], ['==', '$type', 'Polygon']],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': ['case', ['==', ['get', 'active'], 'true'], orange, zoneTypeColorMatch],
      'line-dasharray': ['case', ['==', ['get', 'active'], 'true'], [0.2, 2], [2, 0]],
      'line-width': 3,
    },
  },
  {
    id: 'gl-draw-point-outer',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 7, 5],
      'circle-color': white,
    },
  },
  {
    id: 'gl-draw-point-inner',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 5, 3],
      'circle-color': ['case', ['==', ['get', 'active'], 'true'], orange, blue],
    },
  },
  {
    id: 'gl-draw-vertex-outer',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'vertex'], ['!=', 'mode', 'simple_select']],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 7, 5],
      'circle-color': white,
    },
  },
  {
    id: 'gl-draw-vertex-inner',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'vertex'], ['!=', 'mode', 'simple_select']],
    paint: {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 5, 3],
      'circle-color': orange,
    },
  },
  {
    id: 'gl-draw-midpoint',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 3,
      'circle-color': orange,
    },
  },
]
