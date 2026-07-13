import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_TOKEN, isMapboxConfigured } from '@/lib/mapboxClient'

type UseMapboxMapOptions = {
  center: [number, number]
  zoom?: number
  style?: string
}

/**
 * Instancie une carte Mapbox GL dans le conteneur fourni. L'instance vit dans un ref
 * (jamais dans le state React) — seul `isLoaded` déclenche un re-render, pour que les
 * appels impératifs Mapbox (Draw, capture) restent hors du cycle de rendu React.
 */
export function useMapboxMap(containerRef: React.RefObject<HTMLDivElement | null>, options: UseMapboxMapOptions) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isMapboxConfigured || !containerRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN as string

    // Un token invalide (ex: token secret sk.* au lieu d'un token public pk.*) fait
    // planter Mapbox GL de façon synchrone dans son constructeur — capturé ici pour
    // ne jamais faire planter toute l'application (aucun ErrorBoundary sur cette route).
    let instance: mapboxgl.Map
    try {
      instance = new mapboxgl.Map({
        container: containerRef.current,
        style: options.style ?? 'mapbox://styles/mapbox/satellite-v9',
        center: options.center,
        zoom: options.zoom ?? 19,
        // Requis pour que MapCapture puisse lire le canvas via toDataURL() — sans ce
        // flag, Mapbox efface le buffer après chaque frame et la capture est noire.
        preserveDrawingBuffer: true,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible d'initialiser la carte Mapbox."
      // queueMicrotask : la construction échoue de façon synchrone, mais l'appel à
      // setState doit rester hors de la portion synchrone du corps de l'effet.
      queueMicrotask(() => setError(message))
      return
    }
    instance.addControl(new mapboxgl.NavigationControl(), 'top-right')
    instance.on('load', () => setIsLoaded(true))
    instance.on('error', (event) => setError(event.error?.message ?? 'Erreur Mapbox.'))
    mapRef.current = instance
    setMap(instance)

    return () => {
      instance.remove()
      mapRef.current = null
      setMap(null)
      setIsLoaded(false)
    }
    // Le centre/zoom initiaux ne doivent recréer la carte que si le conteneur change —
    // un recentrage après coup se fait via map.flyTo, pas via une recréation d'instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef])

  return { map, isLoaded, error }
}
