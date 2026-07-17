import { useWatch } from 'react-hook-form'
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { ClientSearchPicker } from '@/features/clients/components/ClientSearchPicker'
import type { Client } from '@/features/clients/types/client.types'
import { AddressPreviewCard } from './AddressPreviewCard'
import { useContractWizardDefaults } from '../../hooks/useContractWizardDefaults'
import { PAYMENT_PRESET_LABELS, buildPaymentSchedule, detectPreset } from '../../utils/paymentPresets'
import type { PaymentPresetId } from '../../utils/paymentPresets'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'

type WizardStepClientProps = {
  client: Client | null
  onClientChange: (client: Client) => void
  onOpenMeasurementTool: () => void
  control: Control<ContractCreationFormValues>
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
  setValue: UseFormSetValue<ContractCreationFormValues>
}

const PRESETS: PaymentPresetId[] = ['annuel', 'deux_versements']

/**
 * Étape 1 "Client & Propriété" — sélection/création du client, validation de
 * l'adresse, prix et échéancier. L'analyse complète de la propriété (tracé de
 * zones) est optionnelle (tâche 5) : elle ne s'ouvre que si l'utilisateur appuie
 * sur "Outil de mesure" dans `AddressPreviewCard`. Tâche 11 : prix et échéancier
 * (simple sélecteur Annuel/Bi-paiement) déplacés ici depuis l'ancienne étape
 * "Modalités de paiement" — le détail des dates par échéance n'est plus
 * modifiable par contrat, la date du 2e versement vient des paramètres par
 * défaut du Wizard (`ContractWizardDefaults.dateDeuxiemeVersement`).
 */
export function WizardStepClient({
  client,
  onClientChange,
  onOpenMeasurementTool,
  control,
  register,
  errors,
  setValue,
}: WizardStepClientProps) {
  const modalitesPaiement = useWatch({ control, name: 'modalitesPaiement' }) ?? []
  const { data: defaults } = useContractWizardDefaults()
  const selectedPreset = detectPreset(modalitesPaiement)

  return (
    <div className="flex flex-col gap-6">
      <ClientSearchPicker value={client} onChange={onClientChange} />
      {client && <AddressPreviewCard client={client} onOpenMeasurementTool={onOpenMeasurementTool} />}

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
    </div>
  )
}
