import { MapPin } from 'lucide-react'
import { MAPBOX_TOKEN, isMapboxConfigured } from '@/lib/mapboxClient'

type StaticMapThumbnailProps = {
  latitude: number | null
  longitude: number | null
  className?: string
}

/** Vignette de carte statique (API Mapbox Static Images, style sombre + pin) — pas de session Mapbox live, juste une image. */
export function StaticMapThumbnail({ latitude, longitude, className = '' }: StaticMapThumbnailProps) {
  const imageUrl =
    isMapboxConfigured && latitude != null && longitude != null
      ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+ed1c24(${longitude},${latitude})/${longitude},${latitude},14,0/160x160@2x?access_token=${MAPBOX_TOKEN}`
      : null

  if (!imageUrl) {
    return (
      <div
        className={`flex items-center justify-center rounded-control bg-reca-gray-light ${className}`}
      >
        <MapPin className="size-6 text-reca-gray-medium" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt="Localisation approximative de l'adresse"
      className={`rounded-control object-cover ${className}`}
    />
  )
}
