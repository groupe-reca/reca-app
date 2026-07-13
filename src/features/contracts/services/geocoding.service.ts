import { MAPBOX_GEOCODING_URL, MAPBOX_TOKEN, isMapboxConfigured } from '@/lib/mapboxClient'

export type GeocodeResult = {
  lat: number
  lng: number
  placeName: string
}

/**
 * Géocode une adresse via l'API Mapbox Geocoding. Retourne `null` si le token
 * Mapbox n'est pas configuré ou si aucun résultat n'est trouvé — appelant doit
 * gérer ce cas (afficher un message plutôt que planter la carte).
 */
export async function geocodeAddress(
  adresse: string | null,
  ville: string | null,
  codePostal: string | null,
): Promise<GeocodeResult | null> {
  if (!isMapboxConfigured) return null

  const query = [adresse, ville, codePostal, 'Québec', 'Canada'].filter(Boolean).join(', ')
  if (!query) return null

  const url = `${MAPBOX_GEOCODING_URL}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=CA&types=address&limit=1`

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Échec du géocodage (${response.status})`)

  const data = (await response.json()) as { features?: { center: [number, number]; place_name: string }[] }
  const feature = data.features?.[0]
  if (!feature) return null

  const [lng, lat] = feature.center
  return { lat, lng, placeName: feature.place_name }
}
