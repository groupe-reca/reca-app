import { Loader2 } from 'lucide-react'
import { WizardLayout } from '@/components/layout/WizardLayout'
import { WizardFooter } from '@/components/layout/WizardFooter'
import { Button } from '@/components/ui/Button'
import { useContractWizardState } from './useContractWizardState'
import { WizardStepClient } from './WizardStepClient'
import { WizardStepProperty } from './WizardStepProperty'
import { WizardStepTerms } from './WizardStepTerms'
import { WizardStepValidation } from './WizardStepValidation'
import { ContractSummaryPanel } from './ContractSummaryPanel'

/** Wizard Desktop/Tablette — inchangé, consomme désormais `useContractWizardState` (extraction sprint012) au lieu de porter sa propre logique. */
export function ContractWizard() {
  const {
    navigate,
    contractId,
    selectedClient,
    setManuallySelectedClient,
    isLoadingDraft,
    isDraftError,
    activeStepId,
    activeIndex,
    steps,
    goNext,
    goBack,
    goToStep,
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

  if (isLoadingDraft) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-reca-gray-medium" aria-hidden="true" />
      </div>
    )
  }

  if (isDraftError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <p className="text-body text-reca-black">Impossible de charger ce brouillon.</p>
        <Button variant="secondary" onClick={() => navigate('/contracts')}>
          Retour aux contrats
        </Button>
      </div>
    )
  }

  return (
    <WizardLayout
      steps={steps}
      onStepClick={goToStep}
      sidePanel={
        activeStepId === 'property' ? undefined : <ContractSummaryPanel client={selectedClient} control={control} />
      }
      headerActions={
        <>
          <Button type="button" variant="ghost" onClick={() => navigate('/contracts')}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={draftDisabled}
            isLoading={isSubmitting}
            onClick={handleSaveDraft}
          >
            Enregistrer le brouillon
          </Button>
        </>
      }
      footer={
        <WizardFooter
          onCancel={() => navigate('/contracts')}
          onBack={activeIndex > 0 ? goBack : undefined}
          isLastStep={activeStepId === 'review'}
          onNext={footerOnNext}
          nextDisabled={footerNextDisabled}
          action={footerAction}
          onCreate={handleCreate}
          createDisabled={createDisabled}
          isSubmitting={isSubmitting}
        />
      }
    >
      {activeStepId === 'client' && (
        <WizardStepClient
          client={selectedClient}
          onClientChange={setManuallySelectedClient}
          onOpenMeasurementTool={openPropertyAnalysis}
          control={control}
          register={register}
          errors={errors}
          setValue={setValue}
        />
      )}
      {activeStepId === 'property' && selectedClient && (
        <WizardStepProperty
          client={selectedClient}
          contractId={contractId}
          control={control}
          setValue={setValue}
          onCompletionChange={setPropertyStepComplete}
          onNavChange={setPropertyNav}
          onAdvanceStep={goNext}
        />
      )}
      {activeStepId === 'terms' && (
        <WizardStepTerms control={control} register={register} errors={errors} setValue={setValue} />
      )}
      {activeStepId === 'review' && selectedClient && (
        <WizardStepValidation client={selectedClient} control={control} />
      )}
    </WizardLayout>
  )
}
