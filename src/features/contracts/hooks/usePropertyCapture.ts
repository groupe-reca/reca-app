import { useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import type { Polygon } from 'geojson'
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/stores/toastStore'

export type PropertyCapture = {
  storagePath: string
  viewport: { center: [number, number]; zoom: number }
  boundary: Polygon | null
}

/**
 * Logique de capture de la vue satellite courante (image + zoom/centre/polygone),
 * enregistrement Storage réel (branché et vérifié depuis le sprint007). Exposée comme un
 * hook plutôt qu'un composant bouton (ex-`CaptureButton.tsx`, sprint008) — le déclencheur
 * ("Capturer" dans le Footer aujourd'hui) est découplé de la logique elle-même, pour
 * qu'un futur sprint puisse appeler `capture()` automatiquement (ex. sur `moveend`) sans
 * toucher à cette logique (sprint008.5, "préparer la future automatisation").
 */
export function usePropertyCapture(map: MapboxMap | null, contractId: string, boundary: Polygon | null) {
  const [isCapturing, setIsCapturing] = useState(false)

  async function capture(): Promise<PropertyCapture | null> {
    if (!map) return null
    setIsCapturing(true)
    try {
      const dataUrl = map.getCanvas().toDataURL('image/jpeg', 0.85)
      const blob = await (await fetch(dataUrl)).blob()
      const path = `contracts/${contractId}/zones/${crypto.randomUUID()}.jpg`
      const { error } = await supabase.storage
        .from('contract-captures')
        .upload(path, blob, { contentType: 'image/jpeg' })
      if (error) throw error
      const center = map.getCenter()
      const result: PropertyCapture = {
        storagePath: path,
        viewport: { center: [center.lng, center.lat], zoom: map.getZoom() },
        boundary,
      }
      toast.success('Capture satellite enregistrée.')
      return result
    } catch {
      toast.error("Impossible d'enregistrer la capture satellite.")
      return null
    } finally {
      setIsCapturing(false)
    }
  }

  return { capture, isCapturing }
}
