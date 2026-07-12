import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import { Button } from '@/components/ui/Button'
import { useClient } from '@/features/clients/hooks/useClient'
import { ClientSearchPicker } from '@/features/clients/components/ClientSearchPicker'
import { toast } from '@/stores/toastStore'
import type { Client } from '@/features/clients/types/client.types'
import { ContractBasicInfoFields } from '../components/ContractBasicInfoFields'
import { ContractClausesFields } from '../components/ContractClausesFields'
import { PaymentScheduleBuilder } from '../components/PaymentScheduleBuilder'
import { CONTRACT_CLAUSE_DEFAULTS, DEFAULT_PAYMENT_SCHEDULE } from '../constants/contractClauseDefaults'
import { useCreateContractWithInvoices } from '../hooks/useCreateContractWithInvoices'
import { contractCreationSchema } from '../schemas/contractCreation.schema'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'

export function ContractCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedClientId = searchParams.get('clientId') ?? ''
  const { data: preselectedClient } = useClient(preselectedClientId)

  const [manuallySelectedClient, setManuallySelectedClient] = useState<Client | null>(null)
  const selectedClient = manuallySelectedClient ?? preselectedClient ?? null

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
    <div className="flex flex-col gap-6 pb-24">
      <div>
        <h1 className="text-section font-semibold text-reca-black">Nouveau contrat</h1>
        <p className="text-body text-reca-gray-medium">
          Recherchez un client existant ou ajoutez-en un nouveau, puis complétez les clauses du contrat.
        </p>
      </div>

      <ClientSearchPicker value={selectedClient} onChange={setManuallySelectedClient} />
      <ContractBasicInfoFields register={register} errors={errors} />
      <ContractClausesFields register={register} errors={errors} />
      <PaymentScheduleBuilder control={control} register={register} errors={errors} />

      <div className="fixed inset-x-0 bottom-0 flex justify-end gap-3 border-t border-reca-gray-light bg-white px-6 py-4">
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
      </div>
    </div>
  )
}
