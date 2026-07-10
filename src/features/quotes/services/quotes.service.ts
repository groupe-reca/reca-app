import { supabase } from '@/lib/supabaseClient'
import type { QuoteFormValues } from '../schemas/quote.schema'
import type { Quote, QuoteClientRef, QuoteLeadRef, QuoteRow, QuoteStatus } from '../types/quote.types'

const SELECT_WITH_LEAD =
  '*, lead:leads(id, numero, prenom, nom), client:clients(id, numero, prenom, nom)'

type QuoteRowWithLead = QuoteRow & { lead: QuoteLeadRef | null; client: QuoteClientRef | null }

function mapQuote(row: QuoteRowWithLead): Quote {
  return {
    id: row.id,
    numero: row.numero,
    leadId: row.lead_id,
    clientId: row.client_id,
    montant: row.montant,
    taxes: row.taxes,
    total: row.total,
    statut: row.statut,
    expiration: row.expiration,
    notes: row.notes,
    createdAt: row.created_at,
    lead: row.lead,
    client: row.client,
  }
}

function toRowInput(values: QuoteFormValues): Partial<QuoteRow> {
  const montant = Number(values.montant)
  const taxes = Number(values.taxes)

  return {
    montant,
    taxes,
    total: montant + taxes,
    expiration: values.expiration || null,
    notes: values.notes || null,
  }
}

export async function listQuotes(): Promise<Quote[]> {
  const { data, error } = await supabase
    .from('quotes')
    .select(SELECT_WITH_LEAD)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as QuoteRowWithLead[]).map(mapQuote)
}

export async function getQuote(id: string): Promise<Quote> {
  const { data, error } = await supabase.from('quotes').select(SELECT_WITH_LEAD).eq('id', id).single()
  if (error) throw error
  return mapQuote(data as unknown as QuoteRowWithLead)
}

export async function createQuote(values: QuoteFormValues, leadId?: string): Promise<Quote> {
  const input = { ...toRowInput(values), lead_id: leadId ?? null }
  const { data, error } = await supabase.from('quotes').insert(input as never).select(SELECT_WITH_LEAD).single()
  if (error) throw error
  return mapQuote(data as unknown as QuoteRowWithLead)
}

export async function updateQuote(id: string, values: QuoteFormValues): Promise<Quote> {
  const { data, error } = await supabase
    .from('quotes')
    .update(toRowInput(values) as never)
    .eq('id', id)
    .select(SELECT_WITH_LEAD)
    .single()

  if (error) throw error
  return mapQuote(data as unknown as QuoteRowWithLead)
}

export async function updateQuoteStatus(id: string, statut: QuoteStatus): Promise<Quote> {
  const { data, error } = await supabase
    .from('quotes')
    .update({ statut } as never)
    .eq('id', id)
    .select(SELECT_WITH_LEAD)
    .single()

  if (error) throw error
  return mapQuote(data as unknown as QuoteRowWithLead)
}

export async function convertQuoteToClient(id: string, clientId: string): Promise<Quote> {
  const { data, error } = await supabase
    .from('quotes')
    .update({ client_id: clientId, statut: 'acceptee' } as never)
    .eq('id', id)
    .select(SELECT_WITH_LEAD)
    .single()

  if (error) throw error
  return mapQuote(data as unknown as QuoteRowWithLead)
}

export async function softDeleteQuote(id: string): Promise<void> {
  const { error } = await supabase
    .from('quotes')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}
