import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ClientSearchPicker } from '@/features/clients/components/ClientSearchPicker'
import type { Client } from '@/features/clients/types/client.types'
import { ContractBasicInfoFields } from '../ContractBasicInfoFields'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'

type WizardStepClientProps = {
  client: Client | null
  onClientChange: (client: Client) => void
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
}

/** Étape 1 — sélection/création du client + informations générales du contrat. */
export function WizardStepClient({ client, onClientChange, register, errors }: WizardStepClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <ClientSearchPicker value={client} onChange={onClientChange} />
      <ContractBasicInfoFields register={register} errors={errors} />
    </div>
  )
}
