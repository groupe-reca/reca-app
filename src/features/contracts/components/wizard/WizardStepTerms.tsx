import { useWatch } from 'react-hook-form'
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { AlertTriangle, CreditCard } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { useContractWizardDefaults } from '../../hooks/useContractWizardDefaults'
import { MODE_PAIEMENT_OPTIONS } from '../../constants/wizardOptions'
import { computeSoftWarnings } from '../../utils/computeSoftWarnings'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'

type WizardStepTermsProps = {
  control: Control<ContractCreationFormValues>
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
  setValue: UseFormSetValue<ContractCreationFormValues>
}

/**
 * Étape "Paiement" — mode de paiement + notes. Tâche 11 : prix et échéancier
 * (Annuel/Bi-paiement) sont désormais saisis à l'étape "Client & Propriété"
 * (voir `WizardStepClient.tsx`) ; le tableau détaillé d'échéances
 * (`PaymentScheduleBuilder`, retiré) n'existe plus — l'échéancier généré par le
 * sélecteur n'est plus modifiable par contrat.
 */
export function WizardStepTerms({ control, register, errors }: WizardStepTermsProps) {
  const modePaiement = useWatch({ control, name: 'modePaiement' }) ?? ''
  const modalitesPaiement = useWatch({ control, name: 'modalitesPaiement' }) ?? []
  const { data: defaults } = useContractWizardDefaults()

  const warnings = defaults
    ? computeSoftWarnings({
        modeConclusion: defaults.modeConclusion,
        modePaiement,
        dateSignature: '',
        dateDebut: defaults.dateDebut,
        modalitesPaiement,
      })
    : []

  return (
    <div className="flex flex-col gap-6">
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

      <Card>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-label font-medium text-reca-gray-medium">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            className="rounded-control border border-reca-gray-light bg-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
            {...register('notes')}
          />
        </div>
      </Card>

      {warnings.length > 0 && (
        <Card className="border border-orange-200 bg-orange-50">
          <div className="flex flex-col gap-2">
            {warnings.map((warning) => (
              <p key={warning} className="flex items-start gap-2 text-label text-reca-warning">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {warning}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
