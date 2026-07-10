import { supabase } from '@/lib/supabaseClient'
import type { InvoiceStatus } from '@/features/invoices/types/invoice.types'
import type { PaymentFormValues } from '../schemas/payment.schema'
import type { Payment, PaymentInvoiceRef, PaymentRow } from '../types/payment.types'

const SELECT_WITH_INVOICE = '*, invoice:invoices(id, numero, total, solde)'

type PaymentRowWithInvoice = PaymentRow & { invoice: PaymentInvoiceRef | null }

function mapPayment(row: PaymentRowWithInvoice): Payment {
  return {
    id: row.id,
    factureId: row.facture_id,
    montant: row.montant,
    methode: row.methode,
    reference: row.reference,
    date: row.date,
    notes: row.notes,
    createdAt: row.created_at,
    invoice: row.invoice,
  }
}

function toRowInput(values: PaymentFormValues): Partial<PaymentRow> {
  return {
    montant: Number(values.montant),
    methode: values.methode || null,
    reference: values.reference || null,
    date: values.date,
    notes: values.notes || null,
  }
}

// Payments have no status of their own — recording or voiding one recomputes
// the parent invoice's solde/statut from the sum of its active payments,
// since doc 07 makes this recalculation module F's job, not a stored field.
async function recalcInvoiceBalance(factureId: string): Promise<void> {
  const { data: invoiceRow, error: invoiceError } = await supabase
    .from('invoices')
    .select('total, statut')
    .eq('id', factureId)
    .single()
  if (invoiceError) throw invoiceError

  const { data: paymentRows, error: paymentsError } = await supabase
    .from('payments')
    .select('montant')
    .eq('facture_id', factureId)
    .is('deleted_at', null)
  if (paymentsError) throw paymentsError

  const { total, statut } = invoiceRow as { total: number; statut: InvoiceStatus }
  const totalPaid = ((paymentRows ?? []) as { montant: number }[]).reduce((sum, row) => sum + row.montant, 0)
  const solde = Math.max(Math.round((total - totalPaid) * 100) / 100, 0)

  let nextStatut: InvoiceStatus = statut
  if (totalPaid <= 0) {
    if (statut === 'payee' || statut === 'partiellement_payee') nextStatut = 'envoyee'
  } else if (solde <= 0) {
    nextStatut = 'payee'
  } else {
    nextStatut = 'partiellement_payee'
  }

  const { error: updateError } = await supabase
    .from('invoices')
    .update({ solde, statut: nextStatut } as never)
    .eq('id', factureId)
  if (updateError) throw updateError
}

export async function listPayments(): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select(SELECT_WITH_INVOICE)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as PaymentRowWithInvoice[]).map(mapPayment)
}

export async function listPaymentsByInvoice(factureId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payments')
    .select(SELECT_WITH_INVOICE)
    .eq('facture_id', factureId)
    .is('deleted_at', null)
    .order('date', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as PaymentRowWithInvoice[]).map(mapPayment)
}

export async function createPayment(values: PaymentFormValues, factureId: string): Promise<Payment> {
  const input = { ...toRowInput(values), facture_id: factureId }
  const { data, error } = await supabase
    .from('payments')
    .insert(input as never)
    .select(SELECT_WITH_INVOICE)
    .single()

  if (error) throw error
  await recalcInvoiceBalance(factureId)
  return mapPayment(data as unknown as PaymentRowWithInvoice)
}

export async function softDeletePayment(id: string, factureId: string): Promise<void> {
  const { error } = await supabase
    .from('payments')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
  await recalcInvoiceBalance(factureId)
}
