import { supabase } from '@/lib/supabaseClient'
import type { ClientNote, ClientNoteRow } from '../types/clientNote.types'

const SELECT_WITH_AUTHOR = '*, author:users(id, nom)'

function mapClientNote(row: ClientNoteRow): ClientNote {
  return {
    id: row.id,
    clientId: row.client_id,
    message: row.message,
    createdAt: row.created_at,
    author: row.author,
  }
}

export async function listClientNotes(clientId: string): Promise<ClientNote[]> {
  const { data, error } = await supabase
    .from('client_notes')
    .select(SELECT_WITH_AUTHOR)
    .eq('client_id', clientId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as ClientNoteRow[]).map(mapClientNote)
}

export async function createClientNote(clientId: string, message: string): Promise<ClientNote> {
  const { data, error } = await supabase
    .from('client_notes')
    .insert({ client_id: clientId, message } as never)
    .select(SELECT_WITH_AUTHOR)
    .single()

  if (error) throw error
  return mapClientNote(data as unknown as ClientNoteRow)
}

export async function updateClientNote(id: string, message: string): Promise<ClientNote> {
  const { data, error } = await supabase
    .from('client_notes')
    .update({ message } as never)
    .eq('id', id)
    .select(SELECT_WITH_AUTHOR)
    .single()

  if (error) throw error
  return mapClientNote(data as unknown as ClientNoteRow)
}

export async function softDeleteClientNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('client_notes')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}
