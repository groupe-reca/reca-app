import { supabase } from '@/lib/supabaseClient'
import type { InterventionNote, InterventionNoteRow } from '../types/interventionNote.types'

const SELECT_WITH_AUTHOR = '*, author:users(id, nom)'

function mapInterventionNote(row: InterventionNoteRow): InterventionNote {
  return {
    id: row.id,
    interventionId: row.intervention_id,
    message: row.message,
    createdAt: row.created_at,
    author: row.author,
  }
}

export async function listInterventionNotes(interventionId: string): Promise<InterventionNote[]> {
  const { data, error } = await supabase
    .from('intervention_notes')
    .select(SELECT_WITH_AUTHOR)
    .eq('intervention_id', interventionId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as InterventionNoteRow[]).map(mapInterventionNote)
}

export async function createInterventionNote(interventionId: string, message: string): Promise<InterventionNote> {
  const { data, error } = await supabase
    .from('intervention_notes')
    .insert({ intervention_id: interventionId, message } as never)
    .select(SELECT_WITH_AUTHOR)
    .single()

  if (error) throw error
  return mapInterventionNote(data as unknown as InterventionNoteRow)
}

export async function updateInterventionNote(id: string, message: string): Promise<InterventionNote> {
  const { data, error } = await supabase
    .from('intervention_notes')
    .update({ message } as never)
    .eq('id', id)
    .select(SELECT_WITH_AUTHOR)
    .single()

  if (error) throw error
  return mapInterventionNote(data as unknown as InterventionNoteRow)
}

export async function softDeleteInterventionNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('intervention_notes')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}
