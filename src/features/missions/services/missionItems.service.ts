import { supabase } from '@/lib/supabaseClient'
import type { MissionItem, MissionItemRow, MissionItemStatus, MissionItemSummary } from '../types/missionItem.types'

const missionItemsCrud = {
  async update(id: string, statut: MissionItemStatus): Promise<MissionItemRow> {
    const { data, error } = await supabase
      .from('mission_items')
      .update({ statut } as never)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as MissionItemRow
  },
}

const SELECT_WITH_CONTRACT = `
  *,
  contract:contracts(id, numero, statut, adresse_geocodee, latitude, longitude, client:clients(prenom, nom, entreprise))
`

type MissionItemJoinRow = MissionItemRow & {
  contract: {
    id: string
    numero: string
    statut: string
    adresse_geocodee: string | null
    latitude: number | null
    longitude: number | null
    client: { prenom: string; nom: string; entreprise: string | null } | null
  } | null
}

function mapMissionItem(row: MissionItemRow): MissionItem {
  return {
    id: row.id,
    missionId: row.mission_id,
    contractId: row.contract_id,
    statut: row.statut,
    createdAt: row.created_at,
  }
}

function mapMissionItemSummary(row: MissionItemJoinRow): MissionItemSummary {
  const contract = row.contract
  const client = contract?.client
  return {
    ...mapMissionItem(row),
    contractNumero: contract?.numero ?? '—',
    contractStatut: (contract?.statut ?? 'actif') as MissionItemSummary['contractStatut'],
    clientName: client ? client.entreprise || `${client.prenom} ${client.nom}` : '—',
    adresse: contract?.adresse_geocodee ?? null,
    lat: contract?.latitude ?? null,
    lng: contract?.longitude ?? null,
  }
}

export async function listMissionItems(missionId: string): Promise<MissionItemSummary[]> {
  const { data, error } = await supabase
    .from('mission_items')
    .select(SELECT_WITH_CONTRACT)
    .eq('mission_id', missionId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true })

  if (error) throw error
  return ((data ?? []) as unknown as MissionItemJoinRow[]).map(mapMissionItemSummary)
}

export async function updateMissionItemStatus(id: string, statut: MissionItemStatus): Promise<MissionItem> {
  const row = await missionItemsCrud.update(id, statut)
  return mapMissionItem(row)
}

/**
 * Copie automatique à la création d'une Mission : tous les contrats ACTIFS (et seulement
 * ceux-là — suspendus/résiliés/expirés exclus) actuellement assignés à la Route deviennent des
 * MissionItems `en_attente`. Séquentiel, pas de transaction DB (comme partout ailleurs dans
 * cette app, ex. `createContractWithZones`).
 */
export async function copyActiveContractsToMission(missionId: string, routeId: string): Promise<void> {
  const { data, error } = await supabase
    .from('route_contracts')
    .select('contract_id, contract:contracts(statut)')
    .eq('route_id', routeId)
    .is('deleted_at', null)
  if (error) throw error

  const rows = (data ?? []) as unknown as { contract_id: string; contract: { statut: string } | null }[]
  const activeContractIds = rows.filter((row) => row.contract?.statut === 'actif').map((row) => row.contract_id)

  if (activeContractIds.length === 0) return

  const { error: insertError } = await supabase.from('mission_items').insert(
    activeContractIds.map((contractId) => ({
      mission_id: missionId,
      contract_id: contractId,
      statut: 'en_attente',
    })) as never,
  )
  if (insertError) throw insertError
}
