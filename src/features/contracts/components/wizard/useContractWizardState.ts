import { useCallback, useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import type { WizardStep, WizardStepStatus } from '@/components/layout/WizardProgress'
import { useClient } from '@/features/clients/hooks/useClient'
import type { Client } from '@/features/clients/types/client.types'
import { toast } from '@/stores/toastStore'
import { useContractDraft } from '../../hooks/useContractDraft'
import { useCreateContractWithInvoices } from '../../hooks/useCreateContractWithInvoices'
import { useSaveContractDraft } from '../../hooks/useSaveContractDraft'
import { contractCreationSchema, contractDraftSchema } from '../../schemas/contractCreation.schema'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'
import { contractToFormValues } from '../../utils/draftMapping'
import type { PropertyNav } from './WizardStepProperty'

export type WizardStepId = 'client' | 'property' | 'terms' | 'review'

export const STEP_ORDER: WizardStepId[] = ['client', 'property', 'terms', 'review']
export const STEP_LABELS: Record<WizardStepId, string> = {
  client: 'Client & Propriété',
  property: 'Analyse & Zones',
  terms: 'Modalités de paiement',
  review: 'Révision',
}

const CLIENT_TYPE_LABELS: Record<string, string> = {
  residentiel: 'Résidentiel',
  commercial: 'Commercial',
}

const DEFAULT_VALUES: ContractCreationFormValues = {
  adresseGeocodee: '',
  latitude: null,
  longitude: null,
  zones: [],
  photos: [],
  prix: '',
  modePaiement: '',
  modalitesPaiement: [],
  notes: '',
}

/**
 * Extraction de l'état/la logique de `ContractWizard.tsx` (sprint012) — indépendante
 * de tout JSX, pour être consommée à l'identique par le Wizard Desktop (`WizardLayout`/
 * `WizardFooter`, inchangé) et le nouveau `MobileContractWizard` (`MobileWizard`/
 * `FloatingActionBar`), sans dupliquer ni faire dériver deux copies de la gating logic.
 *
 * Tâche 5 : 5 étapes → 4 (l'étape "Services" est retirée, ses champs migrent vers les
 * paramètres par défaut du Wizard ou l'étape "Modalités de paiement" ; "Analyse & Zones"
 * devient optionnelle — skip automatique dans `goNext`/`goBack` tant que l'utilisateur
 * n'a jamais appuyé sur "Outil de mesure", cf. `propertyAnalysisRequested`).
 */
export function useContractWizardState() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const draftId = searchParams.get('draftId') ?? ''
  const isResuming = Boolean(draftId)

  const [contractId] = useState(() => draftId || crypto.randomUUID())
  const {
    contract: draftContract,
    zones: draftZones,
    photos: draftPhotos,
    isError: isDraftError,
  } = useContractDraft(draftId)

  const preselectedClientId = draftContract?.clientId ?? searchParams.get('clientId') ?? ''
  const { data: preselectedClient } = useClient(preselectedClientId)

  const [manuallySelectedClient, setManuallySelectedClient] = useState<Client | null>(null)
  const selectedClient = manuallySelectedClient ?? preselectedClient ?? null
  const clientTypeLabel = selectedClient?.typeClient ? (CLIENT_TYPE_LABELS[selectedClient.typeClient] ?? null) : null

  const [activeStepId, setActiveStepId] = useState<WizardStepId>('client')
  const [propertyStepComplete, setPropertyStepComplete] = useState(false)
  const [propertyAnalysisRequested, setPropertyAnalysisRequested] = useState(false)
  const [propertyNav, setPropertyNav] = useState<PropertyNav | null>(null)

  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContractCreationFormValues>({
    resolver: zodResolver(contractCreationSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_VALUES,
  })

  // Reprise de brouillon : dès que le contrat + ses zones + ses photos + le client
  // complet sont chargés, on réinjecte tout dans le formulaire une seule fois
  // (`isDraftHydrated` empêche un reset() répété à chaque re-rendu/refetch).
  const [isDraftHydrated, setIsDraftHydrated] = useState(!isResuming)
  useEffect(() => {
    if (!isResuming || isDraftHydrated) return
    if (draftContract && draftZones && draftPhotos && preselectedClient) {
      // `queueMicrotask` : pattern déjà établi dans ce projet pour respecter la règle
      // eslint `set-state-in-effect` (voir `useMapboxMap.ts`) — différer le `setState`
      // hors du corps synchrone de l'effet, pas un `useState`/`ref` alternatif ici.
      queueMicrotask(() => {
        reset(contractToFormValues(draftContract, draftZones, draftPhotos))
        // Un brouillon qui a déjà des zones tracées doit garder l'étape "Analyse &
        // Zones" accessible/non sautée à la reprise, même si l'utilisateur n'a pas
        // encore ré-appuyé sur "Outil de mesure" dans cette session.
        if (draftZones.length > 0) setPropertyAnalysisRequested(true)
        setIsDraftHydrated(true)
      })
    }
  }, [isResuming, isDraftHydrated, draftContract, draftZones, draftPhotos, preselectedClient, reset])

  const isLoadingDraft = isResuming && !isDraftHydrated && !isDraftError

  const createMutation = useCreateContractWithInvoices(contractId, selectedClient?.id ?? '', clientTypeLabel)
  const draftMutation = useSaveContractDraft(contractId, selectedClient?.id ?? '', clientTypeLabel)
  const modalitesPaiement = useWatch({ control, name: 'modalitesPaiement' })
  const modePaiement = useWatch({ control, name: 'modePaiement' })
  const prix = useWatch({ control, name: 'prix' })

  const STEP_COMPLETION: Record<WizardStepId, boolean> = {
    client: Boolean(selectedClient),
    property: propertyStepComplete,
    terms: (modalitesPaiement?.length ?? 0) > 0 && Boolean(modePaiement),
    review: false,
  }

  const activeIndex = STEP_ORDER.indexOf(activeStepId)
  const canGoNext = STEP_COMPLETION[activeStepId]

  // "Analyse & Zones" est optionnelle (tâche 5) : tant que l'utilisateur n'a jamais
  // appuyé sur "Outil de mesure" (AddressPreviewCard, étape "Client"),
  // goNext/goBack sautent purement son index dans STEP_ORDER — l'étape reste
  // accessible uniquement via ce bouton, jamais via la navigation séquentielle.
  const nextSkippingProperty = useCallback(
    (fromIndex: number, step: 1 | -1): number => {
      let index = fromIndex + step
      if (STEP_ORDER[index] === 'property' && !propertyAnalysisRequested) index += step
      return index
    },
    [propertyAnalysisRequested],
  )

  // Mémoïsé : passé à WizardStepProperty (prop onAdvanceStep) qui le redonne au Footer via
  // un effet — une identité instable ici (ex: fonction recréée à chaque rendu) reboucle à
  // l'infini (l'effet se redéclenche sur chaque nouveau goNext, qui redéclenche un rendu).
  const goNext = useCallback(() => {
    if (!canGoNext) return
    const nextIndex = nextSkippingProperty(activeIndex, 1)
    if (nextIndex >= STEP_ORDER.length) return
    setActiveStepId(STEP_ORDER[nextIndex])
  }, [canGoNext, activeIndex, nextSkippingProperty])

  // Sur l'étape "Analyse & Zones", le Footer unique (sprint008.5) est piloté par
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
    // afficheraient ✓ à tort.
    else if (index < activeIndex && STEP_COMPLETION[id]) status = 'done'
    return { id, label: STEP_LABELS[id], status }
  })

  function goBack() {
    const prevIndex = nextSkippingProperty(activeIndex, -1)
    if (prevIndex < 0) return
    setActiveStepId(STEP_ORDER[prevIndex])
  }

  function goToStep(id: string) {
    setActiveStepId(id as WizardStepId)
  }

  /** Ouvre l'étape "Analyse & Zones" à la demande (bouton "Outil de mesure") — sinon elle reste sautée. */
  function openPropertyAnalysis() {
    setPropertyAnalysisRequested(true)
    setActiveStepId('property')
  }

  const canFinalize = useMemo(
    () =>
      Boolean(selectedClient) &&
      (modalitesPaiement?.length ?? 0) > 0 &&
      (!modalitesPaiement?.some((entry) => entry.type === 'pourcentage') || Boolean(prix)),
    [selectedClient, modalitesPaiement, prix],
  )

  const handleCreate = handleSubmit((values) => {
    if (!selectedClient) return
    if (values.modalitesPaiement.length === 0) {
      toast.error('Au moins une échéance est requise pour créer les factures.')
      return
    }
    if (values.modalitesPaiement.some((entry) => entry.type === 'pourcentage') && !values.prix) {
      toast.error('Le prix du contrat est requis pour calculer les échéances en pourcentage.')
      return
    }
    createMutation.mutate(values, { onSuccess: (result) => navigate(`/contracts/${result.contract.id}`) })
  })

  // "Enregistrer le brouillon" — disponible dès l'étape 1, contrairement à "Créer" ne
  // passe jamais par `handleSubmit` (schéma strict) : `contractDraftSchema` (zones/
  // modePaiement optionnels) valide les valeurs courantes via `safeParse`, ce qui
  // fonctionne même à l'étape 1 sans zone tracée ni échéancier renseigné.
  function handleSaveDraft() {
    if (!selectedClient) {
      toast.error('Sélectionnez un client avant d\'enregistrer un brouillon.')
      return
    }
    const parsed = contractDraftSchema.safeParse(getValues())
    if (!parsed.success) {
      toast.error('Certaines valeurs du formulaire sont invalides.')
      return
    }
    draftMutation.mutate(parsed.data)
  }

  const isSubmitting = createMutation.isPending || draftMutation.isPending

  return {
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
    canGoNext,
    canFinalize,
    isPropertyActive,
    propertyNav,
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
    createDisabled: !canFinalize || isSubmitting,
    handleSaveDraft,
    draftDisabled: !selectedClient || isSubmitting,
  }
}
