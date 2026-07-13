import { useCallback, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import { WizardLayout } from '@/components/layout/WizardLayout'
import { WizardFooter } from '@/components/layout/WizardFooter'
import type { WizardStep, WizardStepStatus } from '@/components/layout/WizardProgress'
import { useClient } from '@/features/clients/hooks/useClient'
import type { Client } from '@/features/clients/types/client.types'
import { useCreateContractWithInvoices } from '../../hooks/useCreateContractWithInvoices'
import { contractCreationSchema } from '../../schemas/contractCreation.schema'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'
import { SERVICE_OPTIONS } from '../../constants/wizardOptions'
import { toast } from '@/stores/toastStore'
import { WizardStepClient } from './WizardStepClient'
import { WizardStepProperty } from './WizardStepProperty'
import type { PropertyNav } from './WizardStepProperty'
import { WizardStepServices } from './WizardStepServices'
import { WizardStepObligations } from './WizardStepObligations'
import { WizardStepPayment } from './WizardStepPayment'
import { WizardStepValidation } from './WizardStepValidation'

type WizardStepId = 'client' | 'property' | 'services' | 'obligations' | 'payment' | 'validation'

const STEP_ORDER: WizardStepId[] = ['client', 'property', 'services', 'obligations', 'payment', 'validation']
const STEP_LABELS: Record<WizardStepId, string> = {
  client: 'Client',
  property: 'Analyse de la propriété',
  services: 'Services',
  obligations: 'Obligations',
  payment: 'Paiement',
  validation: 'Validation',
}

const DEFAULT_VALUES: ContractCreationFormValues = {
  renouvellement: false,
  adresseGeocodee: '',
  latitude: null,
  longitude: null,
  zones: [],
  services: SERVICE_OPTIONS.map((service) => ({ code: service.code, label: service.label, active: false, precisions: null })),
  obligations: {
    balisesRequises: true,
    seuilDeclenchementCm: 5,
    accumulationMaximaleCm: null,
    entreeLibreObligatoire: true,
    animaux: false,
    portail: false,
    autresParticularites: '',
  },
  modePaiement: '',
  modalitesPaiement: [],
}

export function ContractWizard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedClientId = searchParams.get('clientId') ?? ''
  const { data: preselectedClient } = useClient(preselectedClientId)

  const [contractId] = useState(() => crypto.randomUUID())
  const [manuallySelectedClient, setManuallySelectedClient] = useState<Client | null>(null)
  const selectedClient = manuallySelectedClient ?? preselectedClient ?? null

  const [activeStepId, setActiveStepId] = useState<WizardStepId>('client')
  const [propertyStepComplete, setPropertyStepComplete] = useState(false)
  const [propertyNav, setPropertyNav] = useState<PropertyNav | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContractCreationFormValues>({
    resolver: zodResolver(contractCreationSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_VALUES,
  })

  const mutation = useCreateContractWithInvoices(contractId, selectedClient?.id ?? '')
  const services = useWatch({ control, name: 'services' })
  const modalitesPaiement = useWatch({ control, name: 'modalitesPaiement' })
  const modePaiement = useWatch({ control, name: 'modePaiement' })
  const prix = useWatch({ control, name: 'prix' })

  const STEP_COMPLETION: Record<WizardStepId, boolean> = {
    client: Boolean(selectedClient),
    property: propertyStepComplete,
    services: services?.some((service) => service.active) ?? false,
    obligations: true,
    payment: (modalitesPaiement?.length ?? 0) > 0 && Boolean(modePaiement),
    validation: false,
  }

  const activeIndex = STEP_ORDER.indexOf(activeStepId)
  const canGoNext = STEP_COMPLETION[activeStepId]

  // Mémoïsé : passé à WizardStepProperty (prop onAdvanceStep) qui le redonne au Footer via
  // un effet — une identité instable ici (ex: fonction recréée à chaque rendu) reboucle à
  // l'infini (l'effet se redéclenche sur chaque nouveau goNext, qui redéclenche un rendu).
  const goNext = useCallback(() => {
    if (!canGoNext || activeIndex >= STEP_ORDER.length - 1) return
    setActiveStepId(STEP_ORDER[activeIndex + 1])
  }, [canGoNext, activeIndex])

  // Sur l'étape "Analyse de la propriété", le Footer unique (sprint008.5) est piloté par
  // la nav rapportée par la sous-étape courante (Localiser/Délimiter/Valider) plutôt que
  // par le goNext/canGoNext du wizard — les boutons ne sont plus rendus dans la carte.
  const isPropertyActive = activeStepId === 'property'
  const footerOnNext = isPropertyActive ? (propertyNav?.onNext ?? undefined) : goNext
  const footerNextDisabled = isPropertyActive ? (propertyNav?.nextDisabled ?? true) : !canGoNext
  const footerAction = isPropertyActive ? propertyNav?.action : null

  const steps: WizardStep[] = STEP_ORDER.map((id, index) => {
    let status: WizardStepStatus = 'todo'
    if (id === activeStepId) status = 'current'
    // Une étape "done" doit avoir été dépassée (index < étape courante) — sinon des
    // étapes jamais visitées dont le critère de complétion est trivialement vrai
    // (ex: Obligations, qui a des valeurs par défaut valides) afficheraient ✓ à tort.
    else if (index < activeIndex && STEP_COMPLETION[id]) status = 'done'
    return { id, label: STEP_LABELS[id], status }
  })

  function goBack() {
    if (activeIndex <= 0) return
    setActiveStepId(STEP_ORDER[activeIndex - 1])
  }

  function goToStep(id: string) {
    setActiveStepId(id as WizardStepId)
  }

  const canFinalize = useMemo(
    () =>
      Boolean(selectedClient) &&
      (modalitesPaiement?.length ?? 0) > 0 &&
      (!modalitesPaiement?.some((entry) => entry.type === 'pourcentage') || Boolean(prix)),
    [selectedClient, modalitesPaiement, prix],
  )

  function submitAs(finalize: boolean) {
    return handleSubmit((values) => {
      if (!selectedClient) return
      if (finalize) {
        if (values.modalitesPaiement.length === 0) {
          toast.error('Au moins une échéance est requise pour créer les factures.')
          return
        }
        if (values.modalitesPaiement.some((entry) => entry.type === 'pourcentage') && !values.prix) {
          toast.error('Le prix du contrat est requis pour calculer les échéances en pourcentage.')
          return
        }
      }
      mutation.mutate({ values, finalize }, { onSuccess: (result) => navigate(`/contracts/${result.contract.id}`) })
    })
  }

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
