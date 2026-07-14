import type { Polygon } from 'geojson'

const METERS_PER_DEGREE_LAT = 111_320

/**
 * V1 sans données cadastrales (sprint008) : le contour du terrain est généré autour du
 * centre géocodé plutôt que récupéré d'une vraie parcelle. Simple placeholder visuel —
 * à remplacer par un raccordement cadastral réel dans un sprint ultérieur.
 */
export function buildDemoBoundary(center: [number, number], halfWidthM = 25, halfHeightM = 18): Polygon {
  const [lng, lat] = center
  const dLat = halfHeightM / METERS_PER_DEGREE_LAT
  const dLng = halfWidthM / (METERS_PER_DEGREE_LAT * Math.cos((lat * Math.PI) / 180))

  const corners: [number, number][] = [
    [lng - dLng, lat - dLat],
    [lng + dLng, lat - dLat],
    [lng + dLng, lat + dLat],
    [lng - dLng, lat + dLat],
    [lng - dLng, lat - dLat],
  ]

  return { type: 'Polygon', coordinates: [corners] }
}

/** Bbox min/max [lng, lat] du premier anneau — pour alimenter `map.fitBounds()`. */
export function boundsFromPolygon(polygon: Polygon): [[number, number], [number, number]] {
  const ring = polygon.coordinates[0] ?? []
  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity
  for (const [lng, lat] of ring) {
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ]
}

/**
 * 4 rectangles couvrant les alentours du terrain (haut/bas/gauche/droite) sans jamais
 * chevaucher le contour lui-même — le masque extérieur, sans recourir à un polygone "à
 * trou". Un polygone à trou (anneau extérieur + anneau intérieur inversé) est la technique
 * habituelle pour ce genre de masque, mais s'est avérée invisible en test réel : la
 * tessellation (`earcut`) du layer `fill` de Mapbox GL ne produit aucun triangle pour ce
 * "donut" dans ce cas précis (grand anneau extérieur, trou minuscule au zoom satellite
 * ~20), alors même que `queryRenderedFeatures` confirmait la géométrie logique correcte —
 * signe que le rendu GPU et l'index de requête divergent ici. 4 rectangles simples
 * (jamais de trou) sont un cas nettement plus robuste pour un layer `fill`.
 */
export function buildMaskRects(boundary: Polygon, outerHalfWidthM = 5000): Polygon[] {
  const [[minLng, minLat], [maxLng, maxLat]] = boundsFromPolygon(boundary)
  const centerLng = (minLng + maxLng) / 2
  const centerLat = (minLat + maxLat) / 2
  const outer = buildDemoBoundary([centerLng, centerLat], outerHalfWidthM, outerHalfWidthM)
  const [[oMinLng, oMinLat], [oMaxLng, oMaxLat]] = boundsFromPolygon(outer)

  const rect = (a: [number, number], b: [number, number]): Polygon => ({
    type: 'Polygon',
    coordinates: [
      [
        [a[0], a[1]],
        [b[0], a[1]],
        [b[0], b[1]],
        [a[0], b[1]],
        [a[0], a[1]],
      ],
    ],
  })

  return [
    rect([oMinLng, maxLat], [oMaxLng, oMaxLat]), // bande du haut
    rect([oMinLng, oMinLat], [oMaxLng, minLat]), // bande du bas
    rect([oMinLng, minLat], [minLng, maxLat]), // bande de gauche
    rect([maxLng, minLat], [oMaxLng, maxLat]), // bande de droite
  ]
}
