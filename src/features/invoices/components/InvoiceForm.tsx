import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Calendar, DollarSign, Percent } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/lib/format'
import { invoiceSchema } from '../schemas/invoice.schema'
import type { InvoiceFormValues } from '../schemas/invoice.schema'
import type { Invoice } from '../types/invoice.types'

const TPS_RATE = 0.05
const TVQ_RATE = 0.09975

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

type InvoiceFormProps = {
  invoice?: Invoice
  isSubmitting: boolean
  disabled?: boolean
  onSubmit: (values: InvoiceFormValues) => void
  onCancel: () => void
}

export function InvoiceForm({ invoice, isSubmitting, disabled, onSubmit, onCancel }: InvoiceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    mode: 'onTouched',
    defaultValues: invoice
      ? {
          date: invoice.date,
          sousTotal: String(invoice.sousTotal),
          tps: String(invoice.tps),
          tvq: String(invoice.tvq),
        }
      : { date: today(), sousTotal: '0', tps: '0', tvq: '0' },
  })

  const sousTotal = Number(useWatch({ control, name: 'sousTotal' })) || 0
  const tps = Number(useWatch({ control, name: 'tps' })) || 0
  const tvq = Number(useWatch({ control, name: 'tvq' })) || 0

  function applyStandardTaxes() {
    setValue('tps', (sousTotal * TPS_RATE).toFixed(2))
    setValue('tvq', (sousTotal * TVQ_RATE).toFixed(2))
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input label="Date" type="date" icon={Calendar} error={errors.date?.message} {...register('date')} />

      <Input
        label="Sous-total"
        type="number"
        step="0.01"
        icon={DollarSign}
        error={errors.sousTotal?.message}
        {...register('sousTotal')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input label="TPS" type="number" step="0.01" icon={Percent} error={errors.tps?.message} {...register('tps')} />
        <Input label="TVQ" type="number" step="0.01" icon={Percent} error={errors.tvq?.message} {...register('tvq')} />
      </div>

      <button
        type="button"
        onClick={applyStandardTaxes}
        className="self-start text-label font-medium text-reca-red hover:underline"
      >
        Appliquer les taux standards (TPS 5 % · TVQ 9,975 %)
      </button>

      <div className="rounded-control bg-reca-snow px-4 py-3 text-body text-reca-black">
        Total : <span className="font-semibold">{formatCurrency(sousTotal + tps + tvq)}</span>
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={disabled}>
          {invoice ? 'Enregistrer' : 'Créer la facture'}
        </Button>
      </div>
    </form>
  )
}
