import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { supabase } from '@/lib/supabaseClient'
import { usePropertyPhotos } from '../../hooks/usePropertyPhotos'
import { SurfaceSummary } from './SurfaceSummary'
import type { ContractPhotoFormValues, ContractZoneFormValues } from '../../schemas/contractCreation.schema'

type PropertySubStepValidateProps = {
  zones: ContractZoneFormValues[]
  capturePath: string | null
  contractId: string
  photos: ContractPhotoFormValues[]
  onAddPhoto: (photo: ContractPhotoFormValues) => void
  onRemovePhoto: (id: string) => void
}

/** Résumé de l'analyse de la propriété avant de passer à l'étape Services (bouton "Suivant" du wizard). */
export function PropertySubStepValidate({
  zones,
  capturePath,
  contractId,
  photos,
  onAddPhoto,
  onRemovePhoto,
}: PropertySubStepValidateProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadPhoto, isUploading } = usePropertyPhotos(contractId)

  useEffect(() => {
    if (!capturePath || capturePath === 'manuel') return
    let cancelled = false
    supabase.storage
      .from('contract-captures')
      .createSignedUrl(capturePath, 3600)
      .then(({ data }) => {
        if (!cancelled) setImageUrl(data?.signedUrl ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [capturePath])

  useEffect(() => {
    let cancelled = false
    Promise.all(
      photos.map(async (photo) => {
        const { data } = await supabase.storage.from('contract-captures').createSignedUrl(photo.storagePath, 3600)
        return [photo.id, data?.signedUrl ?? ''] as const
      }),
    ).then((entries) => {
      if (!cancelled) setPhotoUrls(Object.fromEntries(entries))
    })
    return () => {
      cancelled = true
    }
  }, [photos])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const photo = await uploadPhoto(file)
    if (photo) onAddPhoto({ ...photo, ordre: photos.length })
  }

  const total = zones.reduce((sum, zone) => sum + zone.surfaceM2, 0)

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h2 className="mb-1 text-subtitle font-semibold text-reca-black">Résumé de l'analyse</h2>
        <p className="text-body text-reca-gray-medium">
          {zones.length} zone{zones.length > 1 ? 's' : ''} — {total.toFixed(2)} m² au total. Cliquez sur « Suivant »
          pour continuer vers les services.
        </p>
      </Card>

      {imageUrl && (
        <Card>
          <img src={imageUrl} alt="Capture satellite de la propriété" className="w-full rounded-control" />
        </Card>
      )}

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-subtitle font-semibold text-reca-black">Photos de la propriété</h2>
          <Button
            type="button"
            variant="secondary"
            isLoading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="size-4" aria-hidden="true" />
            Ajouter une photo
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
        {photos.length === 0 ? (
          <p className="text-body text-reca-gray-medium">Aucune photo ajoutée.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="relative size-24 overflow-hidden rounded-control bg-reca-gray-light">
                {photoUrls[photo.id] && (
                  <img src={photoUrls[photo.id]} alt="Photo de la propriété" className="size-full object-cover" />
                )}
                <button
                  type="button"
                  aria-label="Retirer la photo"
                  onClick={() => onRemovePhoto(photo.id)}
                  className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-reca-black/60 text-white"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <SurfaceSummary zones={zones} />
    </div>
  )
}
