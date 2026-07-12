import type { UseFormRegister } from 'react-hook-form'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'

type TextareaFieldProps = {
  id: keyof ContractCreationFormValues
  label: string
  rows?: number
  register: UseFormRegister<ContractCreationFormValues>
  error?: string
}

export function TextareaField({ id, label, rows = 3, register, error }: TextareaFieldProps) {
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
