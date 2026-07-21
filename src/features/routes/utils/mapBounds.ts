/** Bbox min/max [lng, lat] d'un nuage de points — pour alimenter `map.fitBounds()`. */
export function boundsFromPoints(points: [number, number][]): [[number, number], [number, number]] | null {
  if (points.length === 0) return null

  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity

  for (const [lng, lat] of points) {
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
