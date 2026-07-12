import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '@/components/ui/Button'
import { PageLayout } from '@/components/layout/PageLayout'
import type { PageTab } from '@/components/layout/PageTabs'
import { useClient } from '@/features/clients/hooks/useClient'
import { ClientSearchPicker } from '@/features/clients/components/ClientSearchPicker'
import { toast } from '@/stores/toastStore'
import type { Client } from '@/features/clients/types/client.types'
import { ContractBasicInfoFields } from '../components/ContractBasicInfoFields'
import { ContractServiceDescriptionFields } from '../components/ContractServiceDescriptionFields'
import { ContractThresholdFields } from '../components/ContractThresholdFields'
import { ContractObligationsFields } from '../components/ContractObligationsFields'
import { PaymentScheduleBuilder } from '../components/PaymentScheduleBuilder'
import { CONTRACT_CLAUSE_DEFAULTS, DEFAULT_PAYMENT_SCHEDULE } from '../constants/contractClauseDefaults'
import { useCreateContractWithInvoices } from '../hooks/useCreateContractWithInvoices'
import { contractCreationSchema } from '../schemas/contractCreation.schema'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'

type ContractTabId = 'general' | 'services' | 'thresholds' | 'obligations' | 'payment'

const TAB_FIELDS: Record<ContractTabId, (keyof ContractCreationFormValues)[]> = {
  general: ['type', 'saison', 'prix', 'dateSignature', 'dateDebut', 'dateFin', 'renouvellement', 'notes'],
  services: ['zoneDesservie', 'superficie', 'exclusions'],
  thresholds: ['seuilDeclenchementCm', 'heurePremierPassage', 'nettoyageFinal'],
  obligations: ['distanceSecuriteCm', 'balisesRequises', 'obligationsClient', 'responsabilites'],
  payment: ['modalitesPaiement'],
}

const TAB_LABELS: Record<ContractTabId, string> = {
  general: 'Informations générales',
  services: 'Description des services',
  thresholds: 'Seuils et heures d\'intervention',
  obligations: 'Obligations et responsabilités',
  payment: 'Modalités de paiement',
}

export function ContractCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedClientId = searchParams.get('clientId') ?? ''
  const { data: preselectedClient } = useClient(preselectedClientId)

  const [manuallySelectedClient, setManuallySelectedClient] = useState<Client | null>(null)
  const selectedClient = manuallySelectedClient ?? preselectedClient ?? null
  const [activeTab, setActiveTab] = useState<ContractTabId>('general')

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractCreationFormValues>({
    resolver: zodResolver(contractCreationSchema),
    mode: 'onTouched',
    defaultValues: {
      renouvellement: false,
      ...CONTRACT_CLAUSE_DEFAULTS,
      modalitesPaiement: DEFAULT_PAYMENT_SCHEDULE,
    },
  })

  const mutation = useCreateContractWithInvoices(selectedClient?.id ?? '')
  const schedule = useWatch({ control, name: 'modalitesPaiement' })
  const prix = useWatch({ control, name: 'prix' })

  const canFinalize =
    Boolean(selectedClient) &&
    schedule.length > 0 &&
    (!schedule.some((entry) => entry.type === 'pourcentage') || Boolean(prix))

  const tabs: PageTab[] = (Object.keys(TAB_LABELS) as ContractTabId[]).map((id) => ({
    id,
    label: TAB_LABELS[id],
    hasError: TAB_FIELDS[id].some((field) => Boolean(errors[field])),
  }))

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
      mutation.mutate(
        { values, finalize },
        { onSuccess: (result) => navigate(`/contracts/${result.contract.id}`) },
      )
    })
  }

  return (
    <PageLayout
      title="Nouveau contrat"
      subtitle="Recherchez un client existant ou ajoutez-en un nouveau, puis complétez les clauses du contrat."
      tabs={tabs}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as ContractTabId)}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={() => navigate('/contracts')}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!selectedClient || mutation.isPending}
            isLoading={mutation.isPending}
            onClick={submitAs(false)}
          >
            Brouillon
          </Button>
          <Button type="button" disabled={!canFinalize || mutation.isPending} isLoading={mutation.isPending} onClick={submitAs(true)}>
            Créer
          </Button>
        </>
      }
    >
      {activeTab === 'general' && (
        <div className="flex flex-col gap-6">
          <ClientSearchPicker value={selectedClient} onChange={setManuallySelectedClient} />
          <ContractBasicInfoFields register={register} errors={errors} />
        </div>
      )}
      {activeTab === 'services' && <ContractServiceDescriptionFields register={register} errors={errors} />}
      {activeTab === 'thresholds' && <ContractThresholdFields register={register} errors={errors} />}
      {activeTab === 'obligations' && <ContractObligationsFields register={register} errors={errors} />}
      {activeTab === 'payment' && <PaymentScheduleBuilder control={control} register={register} errors={errors} />}
    </PageLayout>
  )
}
