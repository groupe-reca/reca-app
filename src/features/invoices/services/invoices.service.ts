import { supabase } from '@/lib/supabaseClient'
import type { InvoiceFormValues } from '../schemas/invoice.schema'
import type {
  Invoice,
  InvoiceClientRef,
  InvoiceContractRef,
  InvoiceRow,
  InvoiceStatus,
} from '../types/invoice.types'

const SELECT_WITH_RELATIONS = '*, client:clients(id, numero, prenom, nom), contract:contracts(id, numero)'

type InvoiceRowWithRelations = InvoiceRow & {
  client: InvoiceClientRef | null
  contract: InvoiceContractRef | null
}

function mapInvoice(row: InvoiceRowWithRelations): Invoice {
  return {
    id: row.id,
    numero: row.numero,
    clientId: row.client_id,
    contratId: row.contrat_id,
    date: row.date,
    sousTotal: row.sous_total,
    tps: row.tps,
    tvq: row.tvq,
    total: row.total,
    solde: row.solde,
    statut: row.statut,
    createdAt: row.created_at,
    client: row.client,
    contract: row.contract,
  }
}

// solde is reset to the recomputed total on every create/edit — module F
// (Paiements) will be responsible for decrementing it once payments exist.
function toRowInput(values: InvoiceFormValues): Partial<InvoiceRow> {
  const sousTotal = Number(values.sousTotal)
  const tps = Number(values.tps)
  const tvq = Number(values.tvq)
  const total = sousTotal + tps + tvq

  return {
    date: values.date,
    sous_total: sousTotal,
    tps,
    tvq,
    total,
    solde: total,
  }
}

export async function listInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select(SELECT_WITH_RELATIONS)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as InvoiceRowWithRelations[]).map(mapInvoice)
}

export async function listInvoicesByClient(clientId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select(SELECT_WITH_RELATIONS)
    .eq('client_id', clientId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as InvoiceRowWithRelations[]).map(mapInvoice)
}

export async function listInvoicesByContract(contratId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select(SELECT_WITH_RELATIONS)
    .eq('contrat_id', contratId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as InvoiceRowWithRelations[]).map(mapInvoice)
}

export async function getInvoice(id: string): Promise<Invoice> {
  const { data, error } = await supabase.from('invoices').select(SELECT_WITH_RELATIONS).eq('id', id).single()
  if (error) throw error
  return mapInvoice(data as unknown as InvoiceRowWithRelations)
}

export async function createInvoice(
  values: InvoiceFormValues,
  clientId: string,
  contratId?: string,
): Promise<Invoice> {
  const input = { ...toRowInput(values), client_id: clientId, contrat_id: contratId ?? null }
  const { data, error } = await supabase
    .from('invoices')
    .insert(input as never)
    .select(SELECT_WITH_RELATIONS)
    .single()

  if (error) throw error
  return mapInvoice(data as unknown as InvoiceRowWithRelations)
}

export async function updateInvoice(id: string, values: InvoiceFormValues): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .update(toRowInput(values) as never)
    .eq('id', id)
    .select(SELECT_WITH_RELATIONS)
    .single()

  if (error) throw error
  return mapInvoice(data as unknown as InvoiceRowWithRelations)
}

export async function updateInvoiceStatus(id: string, statut: InvoiceStatus): Promise<Invoice> {
  const { data, error } = await supabase
    .from('invoices')
    .update({ statut } as never)
    .eq('id', id)
    .select(SELECT_WITH_RELATIONS)
    .single()

  if (error) throw error
  return mapInvoice(data as unknown as InvoiceRowWithRelations)
}

export async function softDeleteInvoice(id: string): Promise<void> {
  const { error } = await supabase
    .from('invoices')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}
