import { supabase } from '@/lib/supabaseClient'
import type { ContractFormValues } from '../schemas/contract.schema'
import type { Contract, ContractClientRef, ContractRow, ContractStatus } from '../types/contract.types'

const SELECT_WITH_CLIENT = '*, client:clients(id, numero, prenom, nom)'

type ContractRowWithClient = ContractRow & { client: ContractClientRef | null }

function mapContract(row: ContractRowWithClient): Contract {
  return {
    id: row.id,
    numero: row.numero,
    clientId: row.client_id,
    type: row.type,
    saison: row.saison,
    prix: row.prix,
    statut: row.statut,
    dateSignature: row.date_signature,
    dateDebut: row.date_debut,
    dateFin: row.date_fin,
    renouvellement: row.renouvellement,
    notes: row.notes,
    createdAt: row.created_at,
    client: row.client,
  }
}

function toRowInput(values: ContractFormValues): Partial<ContractRow> {
  return {
    type: values.type || null,
    saison: values.saison || null,
    prix: values.prix ? Number(values.prix) : null,
    date_signature: values.dateSignature || null,
    date_debut: values.dateDebut || null,
    date_fin: values.dateFin || null,
    renouvellement: values.renouvellement ?? false,
    notes: values.notes || null,
  }
}

export async function listContracts(): Promise<Contract[]> {
  const { data, error } = await supabase
    .from('contracts')
    .select(SELECT_WITH_CLIENT)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as ContractRowWithClient[]).map(mapContract)
}

export async function listContractsByClient(clientId: string): Promise<Contract[]> {
  const { data, error } = await supabase
    .from('contracts')
    .select(SELECT_WITH_CLIENT)
    .eq('client_id', clientId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as ContractRowWithClient[]).map(mapContract)
}

export async function getContract(id: string): Promise<Contract> {
  const { data, error } = await supabase.from('contracts').select(SELECT_WITH_CLIENT).eq('id', id).single()
  if (error) throw error
  return mapContract(data as unknown as ContractRowWithClient)
}

export async function createContract(values: ContractFormValues, clientId: string): Promise<Contract> {
  const input = { ...toRowInput(values), client_id: clientId }
  const { data, error } = await supabase
    .from('contracts')
    .insert(input as never)
    .select(SELECT_WITH_CLIENT)
    .single()

  if (error) throw error
  return mapContract(data as unknown as ContractRowWithClient)
}

export async function updateContract(id: string, values: ContractFormValues): Promise<Contract> {
  const { data, error } = await supabase
    .from('contracts')
    .update(toRowInput(values) as never)
    .eq('id', id)
    .select(SELECT_WITH_CLIENT)
    .single()

  if (error) throw error
  return mapContract(data as unknown as ContractRowWithClient)
}

export async function updateContractStatus(id: string, statut: ContractStatus): Promise<Contract> {
  const { data, error } = await supabase
    .from('contracts')
    .update({ statut } as never)
    .eq('id', id)
    .select(SELECT_WITH_CLIENT)
    .single()

  if (error) throw error
  return mapContract(data as unknown as ContractRowWithClient)
}

export async function softDeleteContract(id: string): Promise<void> {
  const { error } = await supabase
    .from('contracts')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}
