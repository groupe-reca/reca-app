import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Calendar, DollarSign, Snowflake, Tag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { contractSchema } from '../schemas/contract.schema'
import type { ContractFormValues } from '../schemas/contract.schema'
import type { Contract } from '../types/contract.types'

type ContractFormProps = {
  contract?: Contract
  isSubmitting: boolean
  disabled?: boolean
  onSubmit: (values: ContractFormValues) => void
  onCancel: () => void
}

export function ContractForm({ contract, isSubmitting, disabled, onSubmit, onCancel }: ContractFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    mode: 'onTouched',
    defaultValues: contract
      ? {
          type: contract.type ?? '',
          saison: contract.saison ?? '',
          prix: contract.prix?.toString() ?? '',
          dateSignature: contract.dateSignature ?? '',
          dateDebut: contract.dateDebut ?? '',
          dateFin: contract.dateFin ?? '',
          renouvellement: contract.renouvellement,
          notes: contract.notes ?? '',
        }
      : { renouvellement: false },
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Type" icon={Tag} error={errors.type?.message} {...register('type')}>
          <option value="">Sélectionner...</option>
          <option value="Résidentiel">Résidentiel</option>
          <option value="Commercial">Commercial</option>
        </Select>
        <Input label="Saison" icon={Snowflake} error={errors.saison?.message} {...register('saison')} />
      </div>

      <Input
        label="Prix"
        type="number"
        step="0.01"
        icon={DollarSign}
        error={errors.prix?.message}
        {...register('prix')}
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Signature"
          type="date"
          icon={Calendar}
          error={errors.dateSignature?.message}
          {...register('dateSignature')}
        />
        <Input
          label="Début"
          type="date"
          icon={Calendar}
          error={errors.dateDebut?.message}
          {...register('dateDebut')}
        />
        <Input
          label="Fin"
          type="date"
          icon={Calendar}
          error={errors.dateFin?.message}
          {...register('dateFin')}
        />
      </div>

      <label className="flex items-center gap-2 text-body text-reca-black">
        <input
          type="checkbox"
          className="size-4 rounded border-reca-gray-light text-reca-red focus:ring-reca-red/30"
          {...register('renouvellement')}
        />
        Renouvellement automatique
      </label>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-label font-medium text-reca-gray-medium">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          className="rounded-control border border-reca-gray-light bg-reca-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('notes')}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={disabled}>
          {contract ? 'Enregistrer' : 'Créer le contrat'}
        </Button>
      </div>
    </form>
  )
}
