import { useWatch } from 'react-hook-form'
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { PaymentScheduleBuilder } from '../PaymentScheduleBuilder'
import { MODE_PAIEMENT_OPTIONS } from '../../constants/wizardOptions'
import { PAYMENT_PRESET_LABELS, buildPaymentSchedule } from '../../utils/paymentPresets'
import type { PaymentPresetId } from '../../utils/paymentPresets'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'

type WizardStepPaymentProps = {
  control: Control<ContractCreationFormValues>
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
  setValue: UseFormSetValue<ContractCreationFormValues>
}

const PRESETS: PaymentPresetId[] = ['annuel', 'deux_versements', 'mensuel']

/** Étape 5 — presets d'échéancier (pré-remplissent le même échéancier que PaymentScheduleBuilder) + mode de paiement. */
export function WizardStepPayment({ control, register, errors, setValue }: WizardStepPaymentProps) {
  const dateDebut = useWatch({ control, name: 'dateDebut' }) ?? ''

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Échéancier</h2>
        <div className="flex gap-3">
          {PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant="secondary"
              onClick={() =>
                setValue('modalitesPaiement', buildPaymentSchedule(preset, dateDebut), { shouldValidate: true })
              }
            >
              {PAYMENT_PRESET_LABELS[preset]}
            </Button>
          ))}
        </div>
      </Card>

      <Card>
        <Select
          label="Mode de paiement"
          icon={CreditCard}
          error={errors.modePaiement?.message}
          {...register('modePaiement')}
        >
          <option value="">Sélectionner...</option>
          {MODE_PAIEMENT_OPTIONS.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </Select>
      </Card>

      <PaymentScheduleBuilder control={control} register={register} errors={errors} />
    </div>
  )
}
