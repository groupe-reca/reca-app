import { supabase } from '@/lib/supabaseClient'
import type { ContractNote, ContractNoteRow } from '../types/contractNote.types'

const SELECT_WITH_AUTHOR = '*, author:users(id, nom)'

function mapContractNote(row: ContractNoteRow): ContractNote {
  return {
    id: row.id,
    contractId: row.contract_id,
    message: row.message,
    createdAt: row.created_at,
    author: row.author,
  }
}

export async function listContractNotes(contractId: string): Promise<ContractNote[]> {
  const { data, error } = await supabase
    .from('contract_notes')
    .select(SELECT_WITH_AUTHOR)
    .eq('contract_id', contractId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as ContractNoteRow[]).map(mapContractNote)
}

export async function createContractNote(contractId: string, message: string): Promise<ContractNote> {
  const { data, error } = await supabase
    .from('contract_notes')
    .insert({ contract_id: contractId, message } as never)
    .select(SELECT_WITH_AUTHOR)
    .single()

  if (error) throw error
  return mapContractNote(data as unknown as ContractNoteRow)
}
