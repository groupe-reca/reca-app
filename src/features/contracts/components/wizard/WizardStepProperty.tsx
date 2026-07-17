import type { Control, UseFormSetValue } from 'react-hook-form'
import type { Client } from '@/features/clients/types/client.types'
import type { WizardFooterAction } from '@/components/layout/WizardFooter'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'
import { usePropertyStepState, SUB_STEP_LABELS, SUB_STEP_ORDER } from '../../hooks/usePropertyStepState'
import { PropertySubStepLocate } from './PropertySubStepLocate'
import { PropertySubStepDelineate } from './PropertySubStepDelineate'
import { PropertySubStepValidate } from './PropertySubStepValidate'

/**
 * Nav rapportée par l'étape "Analyse de la propriété" au Footer unique du Wizard
 * (sprint008.5) — remplace les boutons autrefois rendus dans la zone de carte.
 */
export type PropertyNav = {
  onNext: () => void
  nextDisabled: boolean
  action?: WizardFooterAction | null
}

type WizardStepPropertyProps = {
  client: Client
  contractId: string
  control: Control<ContractCreationFormValues>
  setValue: UseFormSetValue<ContractCreationFormValues>
  onCompletionChange: (complete: boolean) => void
  /** Rapporte la nav (Suivant/action) de la sous-étape courante au Footer du Wizard. */
  onNavChange: (nav: PropertyNav) => void
  /** goNext du Wizard — utilisé par la sous-étape Valider pour sortir vers Services. */
  onAdvanceStep: () => void
}

/**
 * Étape 2 — "Analyse de la propriété" : mini-stepper interne à 3 sous-phases fluides.
 * Consomme désormais `usePropertyStepState` (extraction sprint012, pour réutilisation
 * par `MobileWizardStepProperty.tsx`) — JSX/comportement inchangés.
 */
export function WizardStepProperty({
  client,
  contractId,
  control,
  setValue,
  onCompletionChange,
  onNavChange,
  onAdvanceStep,
}: WizardStepPropertyProps) {
  const {
    subStep,
    setSubStep,
    capturePath,
    viewport,
    mapUnavailable,
    setMapError,
    zones,
    photos,
    center,
    boundary,
    currentIndex,
    handleGeocoded,
    handleCaptured,
    addZone,
    addZones,
    updateZone,
    removeZone,
    addPhoto,
    removePhoto,
  } = usePropertyStepState({ control, setValue, onCompletionChange, onNavChange, onAdvanceStep })

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex shrink-0 items-center gap-2 text-label text-reca-gray-medium">
        {SUB_STEP_ORDER.map((step, index) => (
          <div key={step} className="flex items-center gap-2">
            <span className={index <= currentIndex ? 'font-medium text-reca-red' : ''}>{SUB_STEP_LABELS[step]}</span>
            {index < SUB_STEP_ORDER.length - 1 && <span aria-hidden="true">→</span>}
          </div>
        ))}
      </div>

      <div className="min-h-0 flex-1">
        {subStep === 'locate' && (
          <PropertySubStepLocate
            client={client}
            contractId={contractId}
            boundary={boundary}
            capturePath={capturePath}
            initialViewport={viewport}
            mapUnavailable={mapUnavailable}
            onMapError={setMapError}
            onCaptured={handleCaptured}
            onGeocoded={handleGeocoded}
            onContinue={() => setSubStep('delineate')}
            onNavChange={onNavChange}
          />
        )}
        {subStep === 'delineate' && (
          <PropertySubStepDelineate
            center={center}
            boundary={boundary}
            capturePath={capturePath}
            initialViewport={viewport}
            mapUnavailable={mapUnavailable}
            onMapError={setMapError}
            zones={zones}
            onAddZone={addZone}
            onAddZones={addZones}
            onUpdateZone={updateZone}
            onRemoveZone={removeZone}
            onContinue={() => setSubStep('validate')}
            onNavChange={onNavChange}
          />
        )}
        {subStep === 'validate' && (
          <PropertySubStepValidate
            zones={zones}
            capturePath={capturePath}
            contractId={contractId}
            photos={photos}
            onAddPhoto={addPhoto}
            onRemovePhoto={removePhoto}
          />
        )}
      </div>
    </div>
  )
}
