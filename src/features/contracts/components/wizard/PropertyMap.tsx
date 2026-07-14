import type { Map as MapboxMap } from 'mapbox-gl'
import { MapCanvas } from '@/components/map/MapCanvas'

type PropertyMapProps = {
  center: [number, number]
  onMapReady?: (map: MapboxMap) => void
  onError?: (message: string) => void
}

/**
 * Composition domaine : carte satellite centrée sur la propriété du client. Remplit
 * toute la hauteur disponible de son parent (sprint008.5 — la carte est le composant
 * dominant de l'étape, pas un widget de taille fixe) : le parent doit fournir une
 * hauteur définie (`flex-1 min-h-0` dans une colonne flex).
 */
export function PropertyMap({ center, onMapReady, onError }: PropertyMapProps) {
  return (
    <MapCanvas center={center} zoom={19.5} className="h-full w-full rounded-card" onMapReady={onMapReady} onError={onError} />
  )
}
