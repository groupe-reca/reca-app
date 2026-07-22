import { supabase } from '@/lib/supabaseClient'
import { listRouteClients } from '@/features/routes/services/routeClients.service'
import * as interventionEventsService from './interventionEvents.service'
import type { InterventionFormValues } from '../schemas/intervention.schema'
import type {
  Intervention,
  InterventionEmployeeRef,
  InterventionEquipmentRef,
  InterventionRouteRef,
  InterventionRow,
} from '../types/intervention.types'
import type { InterventionItemStatus } from '../types/interventionItem.types'

const SELECT_WITH_RELATIONS =
  '*, route:routes(id, numero, nom, couleur), employee:employees(id, prenom, nom), equipment:equipments(id, numero, nom)'
const SELECT_LIST = `${SELECT_WITH_RELATIONS}, items:intervention_items(statut, deleted_at)`

type InterventionRowWithRelations = InterventionRow & {
  route: InterventionRouteRef | null
  employee: InterventionEmployeeRef | null
  equipment: InterventionEquipmentRef | null
}

type InterventionListRow = InterventionRowWithRelations & {
  items: { statut: InterventionItemStatus; deleted_at: string | null }[] | null
}

function mapIntervention(row: InterventionRowWithRelations): Intervention {
  return {
    id: row.id,
    numero: row.numero,
    routeId: row.route_id,
    employeeId: row.employee_id,
    equipmentId: row.equipment_id,
    date: row.date,
    heurePrevue: row.heure_prevue,
    heureDebut: row.heure_debut,
    heureFin: row.heure_fin,
    statut: row.statut,
    commentaires: row.commentaires,
    createdAt: row.created_at,
    route: row.route,
    employee: row.employee,
    equipment: row.equipment,
    residencesTotal: 0,
    residencesCompleted: 0,
  }
}

function toRowInput(values: InterventionFormValues): Partial<InterventionRow> {
  return {
    route_id: values.routeId,
    employee_id: values.employeeId,
    equipment_id: values.equipmentId || null,
    date: values.date,
    heure_prevue: values.heurePrevue || null,
    commentaires: values.commentaires || null,
  }
}

/** `residencesTotal`/`residencesCompleted` calculés ici (jointure `intervention_items`) pour
 * la colonne "Résidences"/"Progression" de la page liste — même approche que
 * `hasOverdueInvoice` sur `listContracts()`. */
export async function listInterventions(): Promise<Intervention[]> {
  const { data, error } = await supabase
    .from('interventions')
    .select(SELECT_LIST)
    .is('deleted_at', null)
    .order('date', { ascending: false })
    .order('heure_prevue', { ascending: false, nullsFirst: false })

  if (error) throw error
  return ((data ?? []) as unknown as InterventionListRow[]).map((row) => {
    const activeItems = (row.items ?? []).filter((item) => item.deleted_at === null)
    return {
      ...mapIntervention(row),
      residencesTotal: activeItems.length,
      residencesCompleted: activeItems.filter((item) => item.statut === 'terminee').length,
    }
  })
}

export async function getIntervention(id: string): Promise<Intervention> {
  const { data, error } = await supabase.from('interventions').select(SELECT_WITH_RELATIONS).eq('id', id).single()
  if (error) throw error
  return mapIntervention(data as unknown as InterventionRowWithRelations)
}

/**
 * Crée l'intervention puis, pour chaque client de la route sélectionnée (`route_clients`),
 * une ligne `intervention_items` à statut `planifiee` — génération automatique demandée par
 * le brief. Pas de RPC transactionnelle dans ce repo (convention déjà établie, ex.
 * `createContractWithZones`) : insertions séquentielles côté client.
 */
export async function createInterventionWithItems(values: InterventionFormValues): Promise<Intervention> {
  const { data: insertedRow, error: insertError } = await supabase
    .from('interventions')
    .insert(toRowInput(values) as never)
    .select(SELECT_WITH_RELATIONS)
    .single()

  if (insertError) throw insertError
  const intervention = mapIntervention(insertedRow as unknown as InterventionRowWithRelations)

  await interventionEventsService.createInterventionEvent(intervention.id, 'creee')

  const routeClients = await listRouteClients(values.routeId)
  if (routeClients.length > 0) {
    const itemsInput = routeClients.map((routeClient) => ({
      intervention_id: intervention.id,
      client_id: routeClient.clientId,
      route_client_id: routeClient.id,
      ordre: routeClient.ordre,
      statut: 'planifiee',
    }))
    const { error: itemsError } = await supabase.from('intervention_items').insert(itemsInput as never)
    if (itemsError) throw itemsError
  }

  return intervention
}

export async function updateIntervention(id: string, values: InterventionFormValues): Promise<Intervention> {
  const { data, error } = await supabase
    .from('interventions')
    .update(toRowInput(values) as never)
    .eq('id', id)
    .select(SELECT_WITH_RELATIONS)
    .single()

  if (error) throw error
  return mapIntervention(data as unknown as InterventionRowWithRelations)
}

async function updateStatus(
  id: string,
  patch: Partial<Pick<InterventionRow, 'statut' | 'heure_debut' | 'heure_fin'>>,
): Promise<Intervention> {
  const { data, error } = await supabase
    .from('interventions')
    .update(patch as never)
    .eq('id', id)
    .select(SELECT_WITH_RELATIONS)
    .single()

  if (error) throw error
  return mapIntervention(data as unknown as InterventionRowWithRelations)
}

export async function startIntervention(id: string): Promise<Intervention> {
  return updateStatus(id, { statut: 'en_cours', heure_debut: new Date().toISOString() })
}

export async function closeIntervention(id: string): Promise<Intervention> {
  return updateStatus(id, { statut: 'terminee', heure_fin: new Date().toISOString() })
}

export async function forceCloseIntervention(id: string): Promise<Intervention> {
  return updateStatus(id, { statut: 'terminee_avec_anomalies', heure_fin: new Date().toISOString() })
}

export async function cancelIntervention(id: string): Promise<Intervention> {
  return updateStatus(id, { statut: 'annulee' })
}
