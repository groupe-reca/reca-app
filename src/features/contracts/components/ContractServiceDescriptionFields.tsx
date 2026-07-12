import { Ruler } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { TextareaField } from './TextareaField'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'

type ContractServiceDescriptionFieldsProps = {
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
}

export function ContractServiceDescriptionFields({ register, errors }: ContractServiceDescriptionFieldsProps) {
  return (
    <Card>
      <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Description des services</h2>
      <div className="flex flex-col gap-4">
        <TextareaField
          id="zoneDesservie"
          label="Zone desservie"
          register={register}
          error={errors.zoneDesservie?.message}
        />
        <Input
          label="Superficie (pi²)"
          type="number"
          step="0.01"
          icon={Ruler}
          error={errors.superficie?.message}
          {...register('superficie')}
        />
        <TextareaField id="exclusions" label="Exclusions" register={register} error={errors.exclusions?.message} />
      </div>
    </Card>
  )
}
