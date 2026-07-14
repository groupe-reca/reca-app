import { WizardLayout } from '@/components/layout/WizardLayout'
import { WizardFooter } from '@/components/layout/WizardFooter'
import { useContractWizardState } from './useContractWizardState'
import { WizardStepClient } from './WizardStepClient'
import { WizardStepProperty } from './WizardStepProperty'
import { WizardStepServices } from './WizardStepServices'
import { WizardStepObligations } from './WizardStepObligations'
import { WizardStepPayment } from './WizardStepPayment'
import { WizardStepValidation } from './WizardStepValidation'

/** Wizard Desktop/Tablette — inchangé, consomme désormais `useContractWizardState` (extraction sprint012) au lieu de porter sa propre logique. */
export function ContractWizard() {
  const {
    navigate,
    contractId,
    selectedClient,
    setManuallySelectedClient,
    activeStepId,
    activeIndex,
    steps,
    goNext,
    goBack,
    goToStep,
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

  return (
    <WizardLayout
      steps={steps}
      onStepClick={goToStep}
      footer={
        <WizardFooter
          onCancel={() => navigate('/contracts')}
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
      {activeStepId === 'client' && (
        <WizardStepClient
          client={selectedClient}
          onClientChange={setManuallySelectedClient}
          register={register}
          errors={errors}
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
      {activeStepId === 'services' && <WizardStepServices register={register} />}
      {activeStepId === 'obligations' && <WizardStepObligations register={register} errors={errors} />}
      {activeStepId === 'payment' && (
        <WizardStepPayment control={control} register={register} errors={errors} setValue={setValue} />
      )}
      {activeStepId === 'validation' && selectedClient && (
        <WizardStepValidation client={selectedClient} control={control} />
      )}
    </WizardLayout>
  )
}
