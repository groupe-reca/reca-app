import { supabase } from '@/lib/supabaseClient'
import { createCrudService } from '@/lib/supabaseCrud'
import { createMissionEvent } from './missionEvents.service'
import type { MissionEventType } from '../types/missionEvent.types'
import type { Mission, MissionRow, MissionStatus, MissionSummary } from '../types/mission.types'
import type { MissionFormValues } from '../schemas/mission.schema'

const missionsCrud = createCrudService<MissionRow>('missions')

const SELECT_SUMMARY = `
  *,
  route:routes(id, nom, couleur),
  operator:employees(id, prenom, nom),
  equipment:equipments(id, nom),
  mission_items(id, statut, deleted_at)
`

type MissionSummaryJoinRow = MissionRow & {
  route: { id: string; nom: string; couleur: string } | null
  operator: { id: string; prenom: string; nom: string } | null
  equipment: { id: string; nom: string } | null
  mission_items: { id: string; statut: string; deleted_at: string | null }[]
}

function mapMission(row: MissionRow): Mission {
  return {
    id: row.id,
    numero: row.numero,
    routeId: row.route_id,
    date: row.date,
    heurePrevue: row.heure_prevue,
    heureDebut: row.heure_debut,
    heureFin: row.heure_fin,
    operatorId: row.operator_id,
    equipmentId: row.equipment_id,
    notes: row.notes,
    statut: row.statut,
    createdAt: row.created_at,
  }
}

function mapMissionSummary(row: MissionSummaryJoinRow): MissionSummary {
  const activeItems = row.mission_items.filter((item) => item.deleted_at === null)
  return {
    ...mapMission(row),
    routeName: row.route?.nom ?? '—',
    routeColor: row.route?.couleur ?? '#94A3B8',
    operatorName: row.operator ? `${row.operator.prenom} ${row.operator.nom}` : null,
    equipmentName: row.equipment ? row.equipment.nom : null,
    itemCount: activeItems.length,
    itemsEnAttente: activeItems.filter((item) => item.statut === 'en_attente').length,
    itemsEnCours: activeItems.filter((item) => item.statut === 'en_cours').length,
    itemsTerminee: activeItems.filter((item) => item.statut === 'terminee').length,
    itemsAReprendre: activeItems.filter((item) => item.statut === 'a_reprendre').length,
    itemsImpossible: activeItems.filter((item) => item.statut === 'impossible').length,
  }
}

function toRowInput(values: MissionFormValues): Partial<MissionRow> {
  return {
    route_id: values.routeId,
    date: values.date,
    heure_prevue: values.heurePrevue,
    operator_id: values.operatorId,
    equipment_id: values.equipmentId,
    notes: values.notes || null,
  }
}

export async function listMissionsSummary(): Promise<MissionSummary[]> {
  const { data, error } = await supabase
    .from('missions')
    .select(SELECT_SUMMARY)
    .is('deleted_at', null)
    .order('date', { ascending: false })
    .order('heure_prevue', { ascending: false })
  if (error) throw error
  return ((data ?? []) as unknown as MissionSummaryJoinRow[]).map(mapMissionSummary)
}

export async function getMission(id: string): Promise<MissionSummary> {
  const { data, error } = await supabase.from('missions').select(SELECT_SUMMARY).eq('id', id).single()
  if (error) throw error
  return mapMissionSummary(data as unknown as MissionSummaryJoinRow)
}

export async function createMission(values: MissionFormValues): Promise<Mission> {
  const row = await missionsCrud.create(toRowInput(values))
  return mapMission(row)
}

/**
 * Journalise l'événement adéquat de façon atomique avec la transition (même pattern que
 * `updateContractStatus`). `force` distingue une fermeture forcée admin (`terminee_avec_anomalies`
 * sans que tous les MissionItems soient terminés) d'une fermeture "normale avec anomalies".
 */
export async function updateMissionStatus(
  id: string,
  statut: MissionStatus,
  options: { force?: boolean } = {},
): Promise<Mission> {
  const patch: Partial<MissionRow> = { statut }
  if (statut === 'en_cours' && !options.force) patch.heure_debut = new Date().toISOString()
  if (statut === 'terminee' || statut === 'terminee_avec_anomalies') patch.heure_fin = new Date().toISOString()

  const row = await missionsCrud.update(id, patch)

  const eventType: MissionEventType =
    statut === 'en_cours'
      ? 'mission_debutee'
      : statut === 'annulee'
        ? 'mission_annulee'
        : statut === 'terminee_avec_anomalies' && options.force
          ? 'mission_fermee_de_force'
          : statut === 'terminee_avec_anomalies'
            ? 'mission_terminee_avec_anomalies'
            : 'mission_terminee'

  await createMissionEvent(id, eventType, { statut })
  return mapMission(row)
}
