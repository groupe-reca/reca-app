import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { MobileWizard } from '@/components/layout/mobile/MobileWizard'
import { MobileStepLayout } from '@/components/layout/mobile/MobileStepLayout'
import { FloatingActionBar } from '@/components/layout/mobile/FloatingActionBar'
import { Button } from '@/components/ui/Button'
import { useContractWizardState, STEP_ORDER } from '../useContractWizardState'
import { WizardStepClient } from '../WizardStepClient'
import { WizardStepTerms } from '../WizardStepTerms'
import { WizardStepValidation } from '../WizardStepValidation'
import { MobileWizardStepProperty } from '../../mobile/MobileWizardStepProperty'

/**
 * Wizard Contrats mobile plein écran (sprint012) — consomme la même
 * `useContractWizardState()` que le Desktop (`ContractWizard.tsx`, inchangé), donc la
 * même logique de progression/validation, avec une présentation entièrement différente
 * (une étape à la fois, transition horizontale, barre d'action flottante). L'étape
 * "Analyse & Zones" (`MobileWizardStepProperty`, Phase D sprint012) est rendue plein bord
 * — SANS `MobileStepLayout` (pas de padding ni d'indicateur d'étape par-dessus la
 * carte, "aucune distraction" pendant le dessin, demandé par le brief) — toutes les
 * autres étapes passent par `MobileStepLayout` (indicateur "Étape X/5" + padding).
 */
export function MobileContractWizard() {
  const {
    navigate,
    contractId,
    selectedClient,
    setManuallySelectedClient,
    isLoadingDraft,
    isDraftError,
    activeStepId,
    activeIndex,
    goNext,
    goBack,
    openPropertyAnalysis,
    setPropertyNav,
    setPropertyStepComplete,
    footerOnNext,
    footerNextDisabled,
    footerAction,
    register,
    control,
    setValue,
    errors,
    isSubmitting,
    handleCreate,
    createDisabled,
    handleSaveDraft,
    draftDisabled,
  } = useContractWizardState()

  // Sens du glissement entre étapes — dérivé de activeIndex pendant le rendu (pattern
  // React "adjuster un state à partir d'un changement de valeur" avec du state, pas une
  // ref — la règle eslint react-hooks/refs de ce projet interdit toute lecture/écriture
  // de ref pendant le rendu, pas seulement le setState-in-effect classique).
  const [direction, setDirection] = useState<1 | -1>(1)
  const [prevIndex, setPrevIndex] = useState(activeIndex)
  if (activeIndex !== prevIndex) {
    setDirection(activeIndex >= prevIndex ? 1 : -1)
    setPrevIndex(activeIndex)
  }

  const isPropertyActive = activeStepId === 'property'

  if (isLoadingDraft) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-reca-gray-medium" aria-hidden="true" />
      </div>
    )
  }

  if (isDraftError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center p-4">
        <p className="text-body text-reca-black">Impossible de charger ce brouillon.</p>
        <Button variant="secondary" onClick={() => navigate('/contracts')}>
          Retour aux contrats
        </Button>
      </div>
    )
  }

  return (
    <MobileWizard
      activeKey={activeStepId}
      direction={direction}
      footer={
        <FloatingActionBar
          onBack={activeIndex > 0 ? goBack : undefined}
          isLastStep={activeStepId === 'review'}
          onNext={footerOnNext}
          nextDisabled={footerNextDisabled}
          action={footerAction}
          onDraft={handleSaveDraft}
          draftDisabled={draftDisabled}
          onCreate={handleCreate}
          createDisabled={createDisabled}
          isSubmitting={isSubmitting}
        />
      }
    >
      {isPropertyActive && selectedClient ? (
        <MobileWizardStepProperty
          client={selectedClient}
          contractId={contractId}
          control={control}
          setValue={setValue}
          onCompletionChange={setPropertyStepComplete}
          onNavChange={setPropertyNav}
          onAdvanceStep={goNext}
        />
      ) : (
        <MobileStepLayout stepIndex={activeIndex} totalSteps={STEP_ORDER.length}>
          {activeStepId === 'client' && (
            <WizardStepClient
              client={selectedClient}
              onClientChange={setManuallySelectedClient}
              onOpenMeasurementTool={openPropertyAnalysis}
            />
          )}
          {activeStepId === 'terms' && (
            <WizardStepTerms control={control} register={register} errors={errors} setValue={setValue} />
          )}
          {activeStepId === 'review' && selectedClient && (
            <WizardStepValidation client={selectedClient} control={control} />
          )}
        </MobileStepLayout>
      )}
    </MobileWizard>
  )
}
