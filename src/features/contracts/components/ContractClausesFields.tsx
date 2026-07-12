import { Clock, Ruler, Shield, Thermometer } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'

type ContractClausesFieldsProps = {
  register: UseFormRegister<ContractCreationFormValues>
  errors: FieldErrors<ContractCreationFormValues>
}

function TextareaField({
  id,
  label,
  rows = 3,
  register,
  error,
}: {
  id: keyof ContractCreationFormValues
  label: string
  rows?: number
  register: UseFormRegister<ContractCreationFormValues>
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label font-medium text-reca-gray-medium">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`rounded-control border bg-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 ${
          error ? 'border-red-400 focus:ring-red-200' : 'border-reca-gray-light focus:ring-reca-red/30'
        }`}
        {...register(id)}
      />
      {error && <p className="text-label text-red-600">{error}</p>}
    </div>
  )
}

export function ContractClausesFields({ register, errors }: ContractClausesFieldsProps) {
  return (
    <>
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
    </>
  )
}
