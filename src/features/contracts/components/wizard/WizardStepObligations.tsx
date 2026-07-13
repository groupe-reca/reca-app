import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Snowflake, Thermometer } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SEUIL_DECLENCHEMENT_OPTIONS } from '../../constants/wizardOptions'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'

type WizardStepObligationsProps = {
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
}

/** Étape 4 — questions/réponses structurées ; les clauses du contrat sont générées automatiquement. */
export function WizardStepObligations({ register, errors }: WizardStepObligationsProps) {
  return (
    <Card>
      <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Obligations</h2>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Seuil d'intervention"
            icon={Thermometer}
            error={errors.obligations?.seuilDeclenchementCm?.message}
            {...register('obligations.seuilDeclenchementCm', { valueAsNumber: true })}
          >
            {SEUIL_DECLENCHEMENT_OPTIONS.map((cm) => (
              <option key={cm} value={cm}>
                {cm} cm
              </option>
            ))}
          </Select>
          <Input
            label="Accumulation maximale (cm)"
            type="number"
            step="0.5"
            icon={Snowflake}
            error={errors.obligations?.accumulationMaximaleCm?.message}
            {...register('obligations.accumulationMaximaleCm', {
              setValueAs: (value) => (value === '' ? null : Number(value)),
            })}
          />
        </div>

        <label className="flex items-center gap-2 text-body text-reca-black">
          <input
            type="checkbox"
            className="size-4 rounded border-reca-gray-light text-reca-red focus:ring-reca-red/30"
            {...register('obligations.balisesRequises')}
          />
          Installation de balises requise
        </label>
        <label className="flex items-center gap-2 text-body text-reca-black">
          <input
            type="checkbox"
            className="size-4 rounded border-reca-gray-light text-reca-red focus:ring-reca-red/30"
            {...register('obligations.entreeLibreObligatoire')}
          />
          Entrée libre obligatoire
        </label>
        <label className="flex items-center gap-2 text-body text-reca-black">
          <input
            type="checkbox"
            className="size-4 rounded border-reca-gray-light text-reca-red focus:ring-reca-red/30"
            {...register('obligations.animaux')}
          />
          Présence d'animaux sur le terrain
        </label>
        <label className="flex items-center gap-2 text-body text-reca-black">
          <input
            type="checkbox"
            className="size-4 rounded border-reca-gray-light text-reca-red focus:ring-reca-red/30"
            {...register('obligations.portail')}
          />
          Portail sur le terrain
        </label>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="autresParticularites" className="text-label font-medium text-reca-gray-medium">
            Autres particularités
          </label>
          <textarea
            id="autresParticularites"
            rows={3}
            className="rounded-control border border-reca-gray-light bg-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
            {...register('obligations.autresParticularites')}
          />
        </div>
      </div>
    </Card>
  )
}
