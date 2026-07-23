import { supabase } from '@/lib/supabaseClient'
import type { MissionNote, MissionNoteRow } from '../types/missionNote.types'

const SELECT_WITH_AUTHOR = '*, author:users(id, nom)'

function mapMissionNote(row: MissionNoteRow): MissionNote {
  return {
    id: row.id,
    missionId: row.mission_id,
    message: row.message,
    createdAt: row.created_at,
    author: row.author,
  }
}

export async function listMissionNotes(missionId: string): Promise<MissionNote[]> {
  const { data, error } = await supabase
    .from('mission_notes')
    .select(SELECT_WITH_AUTHOR)
    .eq('mission_id', missionId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as MissionNoteRow[]).map(mapMissionNote)
}

export async function createMissionNote(missionId: string, message: string): Promise<MissionNote> {
  const { data, error } = await supabase
    .from('mission_notes')
    .insert({ mission_id: missionId, message } as never)
    .select(SELECT_WITH_AUTHOR)
    .single()

  if (error) throw error
  return mapMissionNote(data as unknown as MissionNoteRow)
}

export async function updateMissionNote(id: string, message: string): Promise<MissionNote> {
  const { data, error } = await supabase
    .from('mission_notes')
    .update({ message } as never)
    .eq('id', id)
    .select(SELECT_WITH_AUTHOR)
    .single()

  if (error) throw error
  return mapMissionNote(data as unknown as MissionNoteRow)
}

export async function softDeleteMissionNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('mission_notes')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}
