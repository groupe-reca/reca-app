import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { supabase } from '@/lib/supabaseClient'
import { SurfaceSummary } from './SurfaceSummary'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'

type PropertySubStepValidateProps = {
  zones: ContractZoneFormValues[]
  capturePath: string | null
}

/** Résumé de l'analyse de la propriété avant de passer à l'étape Services (bouton "Suivant" du wizard). */
export function PropertySubStepValidate({ zones, capturePath }: PropertySubStepValidateProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

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

      <SurfaceSummary zones={zones} />
    </div>
  )
}
