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
  /**
   * Tâche 7 : la sous-étape courante demande le mode plein écran immersif (carte
   * visible, tout le chrome — fil d'Ariane global, en-tête/progression du Wizard,
   * bandeau de sous-étapes — disparaît). `false`/absent tant que la carte n'est pas
   * réellement disponible (repli manuel) ou sur Valider (pas de carte à maximiser).
   */
  immersive?: boolean
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

  // Tâche 7 : le bandeau de sous-étapes fait partie du chrome masqué en mode plein
  // écran — mêmes conditions que l'`immersive` rapporté par les sous-étapes elles-mêmes
  // (carte réellement disponible, pas la sous-étape Valider qui n'a pas de carte).
  const showSubStepBar = subStep === 'validate' || mapUnavailable

  return (
    <div className="flex h-full flex-col gap-3">
      {showSubStepBar && (
        <div className="flex shrink-0 items-center gap-2 px-4 pt-3 text-label text-reca-gray-medium sm:px-6 lg:px-8">
          {SUB_STEP_ORDER.map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <span className={index <= currentIndex ? 'font-medium text-reca-red' : ''}>{SUB_STEP_LABELS[step]}</span>
              {index < SUB_STEP_ORDER.length - 1 && <span aria-hidden="true">→</span>}
            </div>
          ))}
        </div>
      )}

      <div className={subStep === 'validate' ? 'min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6 lg:px-8' : 'min-h-0 flex-1'}>
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
            contractId={contractId}
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
            onCaptured={handleCaptured}
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
