import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'

/**
 * Convertit un contour Gemini (liste de points [y, x], normalisés 0-1000 par rapport à
 * l'image capturée, un par coin réel du stationnement) en polygone GeoJSON (lng/lat),
 * en utilisant la caméra actuelle de `map` — l'appelant doit s'être assuré au préalable
 * que cette caméra correspond exactement à celle utilisée au moment de la capture
 * (`map.jumpTo` sur le viewport stocké), sans quoi la position serait décalée.
 *
 * `canvas.width`/`canvas.height` sont en pixels *device* (× devicePixelRatio, la même
 * résolution que l'image JPEG capturée), alors que `map.unproject()` attend des pixels
 * *CSS* — diviser par `devicePixelRatio` avant de déprojeter, sinon le polygone suggéré
 * apparaît mal positionné/mal dimensionné sur les écrans à forte densité (Retina, etc.).
 */
export function contourToPolygon(contour: [number, number][], map: MapboxMap): Polygon {
  const canvas = map.getCanvas()
  const dpr = window.devicePixelRatio || 1
  const widthCss = canvas.width / dpr
  const heightCss = canvas.height / dpr

  function toLngLat([normY, normX]: [number, number]): [number, number] {
    const point = map.unproject([(normX / 1000) * widthCss, (normY / 1000) * heightCss])
    return [point.lng, point.lat]
  }

  const ring: [number, number][] = contour.map(toLngLat)
  ring.push(ring[0])

  return { type: 'Polygon', coordinates: [ring] }
}
