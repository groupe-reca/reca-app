import { useState } from 'react'
import { MobileWizard } from '@/components/layout/mobile/MobileWizard'
import { MobileStepLayout } from '@/components/layout/mobile/MobileStepLayout'
import { FloatingActionBar } from '@/components/layout/mobile/FloatingActionBar'
import { useContractWizardState, STEP_ORDER } from '../useContractWizardState'
import { WizardStepClient } from '../WizardStepClient'
import { WizardStepServices } from '../WizardStepServices'
import { WizardStepObligations } from '../WizardStepObligations'
import { WizardStepPayment } from '../WizardStepPayment'
import { WizardStepValidation } from '../WizardStepValidation'
import { MobileWizardStepProperty } from '../../mobile/MobileWizardStepProperty'

/**
 * Wizard Contrats mobile plein écran (sprint012) — consomme la même
 * `useContractWizardState()` que le Desktop (`ContractWizard.tsx`, inchangé), donc la
 * même logique de progression/validation, avec une présentation entièrement différente
 * (une étape à la fois, transition horizontale, barre d'action flottante). L'étape
 * "Analyse de la propriété" (`MobileWizardStepProperty`, Phase D) est rendue plein bord
 * — SANS `MobileStepLayout` (pas de padding ni d'indicateur d'étape par-dessus la
 * carte, "aucune distraction" pendant le dessin, demandé par le brief) — toutes les
 * autres étapes passent par `MobileStepLayout` (indicateur "Étape X/6" + padding).
 */
export function MobileContractWizard() {
  const {
    contractId,
    selectedClient,
    setManuallySelectedClient,
    activeStepId,
    activeIndex,
    goNext,
    goBack,
    canFinalize,
    setPropertyNav,
    setPropertyStepComplete,
    footerOnNext,
    footerNextDisabled,
    footerAction,
    register,
    control,
    setValue,
    errors,
    mutation,
    submitAs,
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

  return (
    <MobileWizard
      activeKey={activeStepId}
      direction={direction}
      footer={
        <FloatingActionBar
          onBack={activeIndex > 0 ? goBack : undefined}
          isLastStep={activeStepId === 'validation'}
          onNext={footerOnNext}
          nextDisabled={footerNextDisabled}
          action={footerAction}
          onDraft={submitAs(false)}
          draftDisabled={!selectedClient || mutation.isPending}
          onCreate={submitAs(true)}
          createDisabled={!canFinalize || mutation.isPending}
          isSubmitting={mutation.isPending}
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
              register={register}
              errors={errors}
            />
          )}
          {activeStepId === 'services' && <WizardStepServices register={register} />}
          {activeStepId === 'obligations' && <WizardStepObligations register={register} errors={errors} />}
          {activeStepId === 'payment' && (
            <WizardStepPayment control={control} register={register} errors={errors} setValue={setValue} />
          )}
          {activeStepId === 'validation' && selectedClient && (
            <WizardStepValidation client={selectedClient} control={control} />
          )}
        </MobileStepLayout>
      )}
    </MobileWizard>
  )
}
