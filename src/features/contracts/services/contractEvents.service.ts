import { supabase } from '@/lib/supabaseClient'
import type { ContractEvent, ContractEventPayload, ContractEventRow, ContractEventType } from '../types/contractEvent.types'

const SELECT_WITH_AUTHOR = '*, author:users(id, nom)'

function mapContractEvent(row: ContractEventRow): ContractEvent {
  return {
    id: row.id,
    contractId: row.contract_id,
    type: row.type,
    payload: row.payload,
    createdAt: row.created_at,
    author: row.author,
  }
}

export async function listContractEvents(contractId: string): Promise<ContractEvent[]> {
  const { data, error } = await supabase
    .from('contract_events')
    .select(SELECT_WITH_AUTHOR)
    .eq('contract_id', contractId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as ContractEventRow[]).map(mapContractEvent)
}

export async function createContractEvent(
  contractId: string,
  type: ContractEventType,
  payload: ContractEventPayload = null,
): Promise<ContractEvent> {
  const { data, error } = await supabase
    .from('contract_events')
    .insert({ contract_id: contractId, type, payload } as never)
    .select(SELECT_WITH_AUTHOR)
    .single()

  if (error) throw error
  return mapContractEvent(data as unknown as ContractEventRow)
}
