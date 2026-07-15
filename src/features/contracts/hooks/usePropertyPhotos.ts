import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { toast } from '@/stores/toastStore'
import type { ContractPhotoFormValues } from '../schemas/contractCreation.schema'

/**
 * Upload de photos réelles de la propriété (sprint014, complément optionnel à la
 * capture satellite) — même bucket privé `contract-captures`, même pattern d'upload
 * que `usePropertyCapture.ts` (upload direct, toasts succès/erreur), juste un préfixe
 * de chemin différent (`photos/` au lieu de `zones/`) et une source `File` (input natif)
 * plutôt qu'un screenshot de canvas.
 */
export function usePropertyPhotos(contractId: string) {
  const [isUploading, setIsUploading] = useState(false)

  async function uploadPhoto(file: File): Promise<ContractPhotoFormValues | null> {
    setIsUploading(true)
    try {
      const id = crypto.randomUUID()
      const path = `contracts/${contractId}/photos/${id}.jpg`
      const { error } = await supabase.storage
        .from('contract-captures')
        .upload(path, file, { contentType: file.type || 'image/jpeg' })
      if (error) throw error
      toast.success('Photo ajoutée.')
      return { id, storagePath: path, ordre: 0 }
    } catch {
      toast.error("Impossible d'ajouter la photo.")
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadPhoto, isUploading }
}
