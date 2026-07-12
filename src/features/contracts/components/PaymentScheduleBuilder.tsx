import { useFieldArray, useWatch } from 'react-hook-form'
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { Calendar, DollarSign, Percent, Plus, Tag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { formatCurrency } from '@/lib/format'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'

type PaymentScheduleBuilderProps = {
  control: Control<ContractCreationFormValues>
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
}

export function PaymentScheduleBuilder({ control, register, errors }: PaymentScheduleBuilderProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'modalitesPaiement' })
  const prix = Number(useWatch({ control, name: 'prix' }) || 0)
  const schedule = useWatch({ control, name: 'modalitesPaiement' }) ?? []

  const total = schedule.reduce((sum, entry) => {
    const valeur = Number(entry?.valeur || 0)
    return sum + (entry?.type === 'pourcentage' ? (prix * valeur) / 100 : valeur)
  }, 0)

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-subtitle font-semibold text-reca-black">Modalités de paiement</h2>
        <Button
          type="button"
          variant="secondary"
          onClick={() => append({ description: '', type: 'pourcentage', valeur: '', dateEcheance: '' })}
        >
          <Plus className="size-4" aria-hidden="true" />
          Ajouter une échéance
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-body text-reca-gray-medium">Aucune échéance — le contrat n'aura pas de facture générée.</p>
      )}

      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-end gap-3">
            <Input
              label="Description"
              icon={Tag}
              error={errors.modalitesPaiement?.[index]?.description?.message}
              {...register(`modalitesPaiement.${index}.description`)}
            />
            <Select
              label="Type"
              icon={Percent}
              error={errors.modalitesPaiement?.[index]?.type?.message}
              {...register(`modalitesPaiement.${index}.type`)}
            >
              <option value="pourcentage">%</option>
              <option value="montant">$</option>
            </Select>
            <Input
              label="Valeur"
              type="number"
              step="0.01"
              icon={DollarSign}
              error={errors.modalitesPaiement?.[index]?.valeur?.message}
              {...register(`modalitesPaiement.${index}.valeur`)}
            />
            <Input
              label="Date d'échéance"
              type="date"
              icon={Calendar}
              error={errors.modalitesPaiement?.[index]?.dateEcheance?.message}
              {...register(`modalitesPaiement.${index}.dateEcheance`)}
            />
            <Button type="button" variant="ghost" onClick={() => remove(index)} aria-label="Supprimer l'échéance">
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>

      {fields.length > 0 && (
        <p className="mt-4 text-label text-reca-gray-medium">
          Total de l'échéancier : {formatCurrency(total)}
          {prix > 0 && ` (prix du contrat : ${formatCurrency(prix)})`}
        </p>
      )}
    </Card>
  )
}
