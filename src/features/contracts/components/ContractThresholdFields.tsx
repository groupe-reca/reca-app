import { Clock, Thermometer } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { TextareaField } from './TextareaField'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'

type ContractThresholdFieldsProps = {
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
}

export function ContractThresholdFields({ register, errors }: ContractThresholdFieldsProps) {
  return (
    <Card>
      <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Seuil et heures d'intervention</h2>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Seuil de déclenchement (cm)"
            type="number"
            step="0.5"
            icon={Thermometer}
            error={errors.seuilDeclenchementCm?.message}
            {...register('seuilDeclenchementCm')}
          />
          <Input
            label="Heure garantie du premier passage"
            type="time"
            icon={Clock}
            error={errors.heurePremierPassage?.message}
            {...register('heurePremierPassage')}
          />
        </div>
        <TextareaField
          id="nettoyageFinal"
          label="Nettoyage final"
          register={register}
          error={errors.nettoyageFinal?.message}
        />
      </div>
    </Card>
  )
}
