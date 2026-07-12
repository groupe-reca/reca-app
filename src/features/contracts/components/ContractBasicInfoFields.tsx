import { Calendar, DollarSign, Snowflake, Tag } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'

type ContractBasicInfoFieldsProps = {
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
}

export function ContractBasicInfoFields({ register, errors }: ContractBasicInfoFieldsProps) {
  return (
    <Card>
      <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Informations générales</h2>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Type" icon={Tag} error={errors.type?.message} {...register('type')}>
            <option value="">Sélectionner...</option>
            <option value="Résidentiel">Résidentiel</option>
            <option value="Commercial">Commercial</option>
          </Select>
          <Input label="Saison" icon={Snowflake} error={errors.saison?.message} {...register('saison')} />
        </div>

        <Input
          label="Prix total (avant taxes)"
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
            className="rounded-control border border-reca-gray-light bg-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
            {...register('notes')}
          />
        </div>
      </div>
    </Card>
  )
}
