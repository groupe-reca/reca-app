import { useCallback, useState } from 'react'
import { Maximize2, MapPin } from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import type { Map as MapboxMap } from 'mapbox-gl'
import { MapCanvas } from '@/components/map/MapCanvas'
import { Modal } from '@/components/ui/Modal'

type LocationMapProps = {
  latitude: number | null
  longitude: number | null
  /** Hauteur/format du rendu en ligne (ex. `h-48 w-full`). */
  className?: string
  /** Facultatif — affiche « Situer manuellement » dans le repli quand l'adresse n'est pas localisée. */
  onLocate?: () => void
}

const MARKER_COLOR = '#ed1c24'
const MAP_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12'
const MAP_ZOOM = 15

/**
 * Carte Mapbox GL **interactive** générique pour localiser une adresse (épingle rouge RECA).
 * S'appuie sur `MapCanvas` (partagé) qui gère déjà token absent / token `sk.*` invalide / resize.
 * Repli explicite « Adresse non localisée » quand aucune coordonnée (pas un cadre gris muet), et
 * bouton d'agrandissement → lightbox plein écran (le clic direct sur la carte sert au pan/zoom).
 * Transverse (`src/components/ui/`) : réutilisable par toute fiche ayant une adresse géocodée.
 */
export function LocationMap({ latitude, longitude, className = '', onLocate }: LocationMapProps) {
  const [expanded, setExpanded] = useState(false)

  const addMarker = useCallback(
    (map: MapboxMap) => {
      if (latitude == null || longitude == null) return
      new mapboxgl.Marker({ color: MARKER_COLOR }).setLngLat([longitude, latitude]).addTo(map)
    },
    [latitude, longitude],
  )

  if (latitude == null || longitude == null) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-reca-gray-light bg-reca-snow p-6 text-center ${className}`}
      >
        <MapPin className="size-6 text-reca-gray-medium" aria-hidden="true" />
        <p className="text-body font-medium text-reca-black">Adresse non localisée</p>
        {onLocate && (
          <button
            type="button"
            onClick={onLocate}
            className="text-label font-medium text-reca-info hover:underline"
          >
            Situer manuellement
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className={`relative overflow-hidden rounded-card ${className}`}>
        <MapCanvas
          center={[longitude, latitude]}
          zoom={MAP_ZOOM}
          style={MAP_STYLE}
          className="size-full"
          onMapReady={addMarker}
        />
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Agrandir la carte"
          className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-control bg-reca-white/90 text-reca-black shadow-card hover:bg-reca-white"
        >
          <Maximize2 className="size-4" aria-hidden="true" />
        </button>
      </div>

      <Modal open={expanded} onClose={() => setExpanded(false)} title="Localisation">
        <div className="h-[70vh] w-full overflow-hidden rounded-card">
          <MapCanvas
            center={[longitude, latitude]}
            zoom={MAP_ZOOM}
            style={MAP_STYLE}
            className="size-full"
            onMapReady={addMarker}
          />
        </div>
      </Modal>
    </>
  )
}
