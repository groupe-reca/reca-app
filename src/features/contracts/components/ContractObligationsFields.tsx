import { Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { TextareaField } from './TextareaField'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'

type ContractObligationsFieldsProps = {
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
}

export function ContractObligationsFields({ register, errors }: ContractObligationsFieldsProps) {
  return (
    <Card>
      <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Obligations et responsabilités</h2>
      <div className="flex flex-col gap-4">
        <Input
          label="Distance de sécurité (cm)"
          type="number"
          step="1"
          icon={Shield}
          error={errors.distanceSecuriteCm?.message}
          {...register('distanceSecuriteCm')}
        />
        <label className="flex items-center gap-2 text-body text-reca-black">
          <input
            type="checkbox"
            className="size-4 rounded border-reca-gray-light text-reca-red focus:ring-reca-red/30"
            {...register('balisesRequises')}
          />
          Installation de balises requise
        </label>
        <TextareaField
          id="obligationsClient"
          label="Obligations du client"
          register={register}
          error={errors.obligationsClient?.message}
        />
        <TextareaField
          id="responsabilites"
          label="Responsabilités et dommages"
          register={register}
          error={errors.responsabilites?.message}
        />
      </div>
    </Card>
  )
}
