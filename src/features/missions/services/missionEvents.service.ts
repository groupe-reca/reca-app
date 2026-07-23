import { supabase } from '@/lib/supabaseClient'
import type { MissionEvent, MissionEventPayload, MissionEventRow, MissionEventType } from '../types/missionEvent.types'

const SELECT_WITH_AUTHOR = '*, author:users(id, nom)'

function mapMissionEvent(row: MissionEventRow): MissionEvent {
  return {
    id: row.id,
    missionId: row.mission_id,
    type: row.type,
    payload: row.payload,
    createdAt: row.created_at,
    author: row.author,
  }
}

export async function listMissionEvents(missionId: string): Promise<MissionEvent[]> {
  const { data, error } = await supabase
    .from('mission_events')
    .select(SELECT_WITH_AUTHOR)
    .eq('mission_id', missionId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as MissionEventRow[]).map(mapMissionEvent)
}

export async function createMissionEvent(
  missionId: string,
  type: MissionEventType,
  payload: MissionEventPayload = null,
): Promise<MissionEvent> {
  const { data, error } = await supabase
    .from('mission_events')
    .insert({ mission_id: missionId, type, payload } as never)
    .select(SELECT_WITH_AUTHOR)
    .single()

  if (error) throw error
  return mapMissionEvent(data as unknown as MissionEventRow)
}
