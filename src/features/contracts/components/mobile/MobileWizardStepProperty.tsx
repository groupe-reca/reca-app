import type { Control, UseFormSetValue } from 'react-hook-form'
import type { Client } from '@/features/clients/types/client.types'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'
import { usePropertyStepState } from '../../hooks/usePropertyStepState'
import type { PropertyNav } from '../wizard/WizardStepProperty'
import { PropertySubStepValidate } from '../wizard/PropertySubStepValidate'
import { MobilePropertySubStepLocate } from './MobilePropertySubStepLocate'
import { MobilePropertySubStepDelineate } from './MobilePropertySubStepDelineate'

type MobileWizardStepPropertyProps = {
  client: Client
  contractId: string
  control: Control<ContractCreationFormValues>
  setValue: UseFormSetValue<ContractCreationFormValues>
  onCompletionChange: (complete: boolean) => void
  onNavChange: (nav: PropertyNav) => void
  onAdvanceStep: () => void
}

/**
 * Étape 2 mobile — "Analyse de la propriété" (sprint012, Phase D). Même orchestration
 * à 3 sous-phases que `WizardStepProperty.tsx` (Desktop, `usePropertyStepState`
 * partagé), mais Locate/Delineate deviennent plein écran (carte + Bottom Sheets) sans
 * bandeau de sous-étapes visible ("aucune distraction" pendant le dessin, demandé par
 * le brief) — Valider réutilise `PropertySubStepValidate` tel quel (simple pile de
 * `Card`, déjà adapté sans modification à un rendu plein largeur).
 */
export function MobileWizardStepProperty({
  client,
  contractId,
  control,
  setValue,
  onCompletionChange,
  onNavChange,
  onAdvanceStep,
}: MobileWizardStepPropertyProps) {
  const {
    subStep,
    setSubStep,
    capturePath,
    setCapturePath,
    mapUnavailable,
    setMapError,
    zones,
    photos,
    center,
    boundary,
    handleGeocoded,
    addZone,
    updateZone,
    removeZone,
    addPhoto,
    removePhoto,
  } = usePropertyStepState({ control, setValue, onCompletionChange, onNavChange, onAdvanceStep })

  return (
    <div className="h-full">
      {subStep === 'locate' && (
        <MobilePropertySubStepLocate
          client={client}
          contractId={contractId}
          boundary={boundary}
          capturePath={capturePath}
          mapUnavailable={mapUnavailable}
          onMapError={setMapError}
          onCaptured={setCapturePath}
          onGeocoded={handleGeocoded}
          onContinue={() => setSubStep('delineate')}
          onNavChange={onNavChange}
        />
      )}
      {subStep === 'delineate' && (
        <MobilePropertySubStepDelineate
          center={center}
          boundary={boundary}
          capturePath={capturePath}
          mapUnavailable={mapUnavailable}
          onMapError={setMapError}
          zones={zones}
          onAddZone={addZone}
          onUpdateZone={updateZone}
          onRemoveZone={removeZone}
          onContinue={() => setSubStep('validate')}
          onNavChange={onNavChange}
        />
      )}
      {subStep === 'validate' && (
        <div className="h-full overflow-y-auto p-4">
          <PropertySubStepValidate
            zones={zones}
            capturePath={capturePath}
            contractId={contractId}
            photos={photos}
            onAddPhoto={addPhoto}
            onRemovePhoto={removePhoto}
          />
        </div>
      )}
    </div>
  )
}
