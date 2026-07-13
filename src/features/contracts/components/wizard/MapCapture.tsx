import { useState } from 'react'
import type { Map as MapboxMap } from 'mapbox-gl'
import { Camera } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/stores/toastStore'

type MapCaptureProps = {
  map: MapboxMap | null
  contractId: string
  onCaptured: (storagePath: string) => void
}

/** Bouton "📸 Capturer" — lit le canvas Mapbox et l'enregistre dans Supabase Storage. */
export function MapCapture({ map, contractId, onCaptured }: MapCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false)

  async function handleCapture() {
    if (!map) return
    setIsCapturing(true)
    try {
      const dataUrl = map.getCanvas().toDataURL('image/jpeg', 0.85)
      const blob = await (await fetch(dataUrl)).blob()
      const path = `contracts/${contractId}/zones/${crypto.randomUUID()}.jpg`
      const { error } = await supabase.storage
        .from('contract-captures')
        .upload(path, blob, { contentType: 'image/jpeg' })
      if (error) throw error
      onCaptured(path)
      toast.success('Capture satellite enregistrée.')
    } catch {
      toast.error("Impossible d'enregistrer la capture satellite.")
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <Button type="button" onClick={handleCapture} disabled={!map || isCapturing} isLoading={isCapturing}>
      <Camera className="size-4" aria-hidden="true" />
      Capturer
    </Button>
  )
}
