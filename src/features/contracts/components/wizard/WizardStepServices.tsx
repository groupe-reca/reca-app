import type { UseFormRegister } from 'react-hook-form'
import { Card } from '@/components/ui/Card'
import { SERVICE_OPTIONS } from '../../constants/wizardOptions'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'

type WizardStepServicesProps = {
  register: UseFormRegister<ContractCreationFormValues>
}

/** Étape 3 — sélection des services offerts, chacun avec un champ "précisions" optionnel. */
export function WizardStepServices({ register }: WizardStepServicesProps) {
  return (
    <Card>
      <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Services</h2>
      <div className="flex flex-col gap-3">
        {SERVICE_OPTIONS.map((service, index) => (
          <div
            key={service.code}
            className="flex items-center gap-3 rounded-control border border-reca-gray-light p-3"
          >
            <label className="flex items-center gap-2 text-body font-medium text-reca-black">
              <input
                type="checkbox"
                className="size-4 rounded border-reca-gray-light text-reca-red focus:ring-reca-red/30"
                {...register(`services.${index}.active`)}
              />
              {service.label}
            </label>
            <input
              type="text"
              placeholder="Précisions (optionnel)"
              className="ml-auto h-9 w-64 rounded-control border border-reca-gray-light bg-white px-3 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
              {...register(`services.${index}.precisions`)}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}
