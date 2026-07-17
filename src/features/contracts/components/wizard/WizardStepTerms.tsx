import { useWatch } from 'react-hook-form'
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { AlertTriangle, CreditCard, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useContractWizardDefaults } from '../../hooks/useContractWizardDefaults'
import { MODE_PAIEMENT_OPTIONS } from '../../constants/wizardOptions'
import { computeSoftWarnings } from '../../utils/computeSoftWarnings'
import { PAYMENT_PRESET_LABELS, buildPaymentSchedule, detectPreset } from '../../utils/paymentPresets'
import type { PaymentPresetId } from '../../utils/paymentPresets'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'

type WizardStepTermsProps = {
  control: Control<ContractCreationFormValues>
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
  setValue: UseFormSetValue<ContractCreationFormValues>
}

const PRESETS: PaymentPresetId[] = ['annuel', 'deux_versements']

/**
 * Étape "Paiement" — prix, échéancier, mode de paiement et notes. Tâche 5
 * (2026-07-17, nom de fichier réutilisé, `.input/tache5.md`) : prix et échéancier
 * reviennent ici depuis l'étape "Client & Propriété", où la tâche 11 (2026-07-16)
 * les avait déplacés — le tableau détaillé d'échéances (`PaymentScheduleBuilder`,
 * retiré à l'époque) n'est toujours pas réintroduit, l'échéancier généré par le
 * sélecteur Annuel/Bi-paiement n'est pas modifiable par contrat.
 */
export function WizardStepTerms({ control, register, errors, setValue }: WizardStepTermsProps) {
  const modePaiement = useWatch({ control, name: 'modePaiement' }) ?? ''
  const modalitesPaiement = useWatch({ control, name: 'modalitesPaiement' }) ?? []
  const { data: defaults } = useContractWizardDefaults()
  const selectedPreset = detectPreset(modalitesPaiement)

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
        <Input
          label="Prix total (avant taxes)"
          type="number"
          step="0.01"
          icon={DollarSign}
          error={errors.prix?.message}
          {...register('prix')}
        />
      </Card>

      <Card>
        <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Échéancier</h2>
        <div className="flex gap-3">
          {PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant={selectedPreset === preset ? 'primary' : 'secondary'}
              onClick={() =>
                setValue(
                  'modalitesPaiement',
                  buildPaymentSchedule(preset, defaults?.dateDebut ?? '', defaults?.dateDeuxiemeVersement ?? ''),
                  { shouldValidate: true },
                )
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
