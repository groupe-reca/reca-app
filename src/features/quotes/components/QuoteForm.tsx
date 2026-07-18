import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Calendar, DollarSign, Percent } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/lib/format'
import { quoteSchema } from '../schemas/quote.schema'
import type { QuoteFormValues } from '../schemas/quote.schema'
import type { Quote } from '../types/quote.types'

type QuoteFormProps = {
  quote?: Quote
  isSubmitting: boolean
  onSubmit: (values: QuoteFormValues) => void
  onCancel: () => void
}

export function QuoteForm({ quote, isSubmitting, onSubmit, onCancel }: QuoteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    mode: 'onTouched',
    defaultValues: quote
      ? {
          montant: String(quote.montant),
          taxes: String(quote.taxes),
          expiration: quote.expiration ?? '',
          notes: quote.notes ?? '',
        }
      : { montant: '0', taxes: '0' },
  })

  const montant = Number(useWatch({ control, name: 'montant' })) || 0
  const taxes = Number(useWatch({ control, name: 'taxes' })) || 0

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
        <Input
          label="Taxes"
          type="number"
          step="0.01"
          icon={Percent}
          error={errors.taxes?.message}
          {...register('taxes')}
        />
      </div>

      <Input label="Expiration" type="date" icon={Calendar} error={errors.expiration?.message} {...register('expiration')} />

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

      <div className="rounded-control bg-reca-snow px-4 py-3 text-body text-reca-black">
        Total : <span className="font-semibold">{formatCurrency(montant + taxes)}</span>
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {quote ? 'Enregistrer' : 'Créer la soumission'}
        </Button>
      </div>
    </form>
  )
}
