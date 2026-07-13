import type { Map as MapboxMap } from 'mapbox-gl'
import { MapCanvas } from '@/components/map/MapCanvas'

type PropertyMapProps = {
  center: [number, number]
  onMapReady?: (map: MapboxMap) => void
  onError?: (message: string) => void
}

/** Composition domaine : carte satellite centrée sur la propriété du client, plein cadre. */
export function PropertyMap({ center, onMapReady, onError }: PropertyMapProps) {
  return (
    <MapCanvas
      center={center}
      zoom={19.5}
      className="h-[480px] w-full rounded-card"
      onMapReady={onMapReady}
      onError={onError}
    />
  )
}
