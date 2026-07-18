import { useState } from 'react'
import { Maximize2, MapPin } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { useSignedCaptureUrl } from '../../hooks/useSignedCaptureUrl'
import type { ContractZoneFormValues } from '../../schemas/contractCreation.schema'

/**
 * Grande carte satellite (image signée, zones déjà tracées visibles dessus — voir
 * `useDelineateState.handleContinueWithCapture`), pastilles superposées façon maquette.
 * Reprend le même hook de capture que `DocumentSatelliteZones.tsx` sans dupliquer la logique
 * de fetch — layout différent (cette page veut des pastilles superposées, pas une légende
 * empilée sous l'image façon document PDF).
 */
export function ContractMapCard({ zones }: { zones: ContractZoneFormValues[] }) {
  const [fullscreen, setFullscreen] = useState(false)
  const imageUrl = useSignedCaptureUrl(zones[0]?.imageStoragePath)

  return (
    <>
      <div className="overflow-hidden rounded-card bg-reca-white shadow-card">
        <div className="border-b border-reca-gray-light p-6 pb-4">
          <h2 className="text-subtitle font-semibold text-reca-black">Carte du site & tracé à déneiger</h2>
        </div>
        <div className="relative">
          {imageUrl ? (
            <img src={imageUrl} alt="Vue satellite de la propriété avec les zones tracées" className="w-full" />
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 py-24 text-center">
              <MapPin className="size-6 text-reca-gray-medium" aria-hidden="true" />
              <p className="text-label text-reca-gray-medium">Aucune image satellite disponible.</p>
            </div>
          )}
          {imageUrl && (
            <>
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-reca-black/70 px-3 py-1.5 text-label font-medium text-white backdrop-blur-sm hover:bg-reca-black/85"
              >
                <Maximize2 className="size-3.5" aria-hidden="true" />
                Voir en plein écran
              </button>
              <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-reca-black/70 px-3 py-1.5 text-label font-medium text-white backdrop-blur-sm">
                <span className="h-0.5 w-4 rounded-full bg-reca-red" aria-hidden="true" />
                Zone à déneiger
              </span>
            </>
          )}
        </div>
      </div>

      <Modal open={fullscreen} onClose={() => setFullscreen(false)} title="Carte du site">
        {imageUrl && <img src={imageUrl} alt="Vue satellite de la propriété, plein écran" className="w-full rounded-control" />}
      </Modal>
    </>
  )
}
