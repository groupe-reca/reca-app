import { supabase } from '@/lib/supabaseClient'
import type {
  InterventionEvent,
  InterventionEventPayload,
  InterventionEventRow,
  InterventionEventType,
} from '../types/interventionEvent.types'

const SELECT_WITH_AUTHOR = '*, author:users(id, nom)'

function mapInterventionEvent(row: InterventionEventRow): InterventionEvent {
  return {
    id: row.id,
    interventionId: row.intervention_id,
    type: row.type,
    payload: row.payload,
    createdAt: row.created_at,
    author: row.author,
  }
}

export async function listInterventionEvents(interventionId: string): Promise<InterventionEvent[]> {
  const { data, error } = await supabase
    .from('intervention_events')
    .select(SELECT_WITH_AUTHOR)
    .eq('intervention_id', interventionId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as InterventionEventRow[]).map(mapInterventionEvent)
}

export async function createInterventionEvent(
  interventionId: string,
  type: InterventionEventType,
  payload: InterventionEventPayload = null,
): Promise<InterventionEvent> {
  const { data, error } = await supabase
    .from('intervention_events')
    .insert({ intervention_id: interventionId, type, payload } as never)
    .select(SELECT_WITH_AUTHOR)
    .single()

  if (error) throw error
  return mapInterventionEvent(data as unknown as InterventionEventRow)
}
