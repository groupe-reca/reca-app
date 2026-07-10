import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Calendar, DollarSign, Hash } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { paymentSchema } from '../schemas/payment.schema'
import type { PaymentFormValues } from '../schemas/payment.schema'
import { PAYMENT_METHODS } from '../types/payment.types'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

type PaymentFormProps = {
  isSubmitting: boolean
  onSubmit: (values: PaymentFormValues) => void
  onCancel: () => void
}

export function PaymentForm({ isSubmitting, onSubmit, onCancel }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    mode: 'onTouched',
    defaultValues: { date: today() },
  })

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Montant"
          type="number"
          step="0.01"
          icon={DollarSign}
          error={errors.montant?.message}
          {...register('montant')}
        />
        <Input label="Date" type="date" icon={Calendar} error={errors.date?.message} {...register('date')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select label="Méthode" icon={DollarSign} error={errors.methode?.message} {...register('methode')}>
          <option value="">Sélectionner...</option>
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </Select>
        <Input label="Référence" icon={Hash} error={errors.reference?.message} {...register('reference')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-label font-medium text-reca-gray-medium">
          Notes
        </label>
        <textarea
          id="notes"
          rows={2}
          className="rounded-control border border-reca-gray-light bg-white px-3 py-2 text-body text-reca-black focus:outline-none focus:ring-2 focus:ring-reca-red/30"
          {...register('notes')}
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Enregistrer le paiement
        </Button>
      </div>
    </form>
  )
}
