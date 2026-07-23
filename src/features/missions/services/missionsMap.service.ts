import { supabase } from '@/lib/supabaseClient'
import type { ContractZoneRow } from '@/features/contracts/types/contract.types'
import { computeContractPoint } from '@/features/routes/utils/contractPoint'
import { MISSION_ITEM_STATUS_HEX } from '../constants/missionItemStatusColors'
import type { MissionItemStatus } from '../types/missionItem.types'
import type { MissionMapPoint } from '../types/missionMapPoint.types'

type MapMissionItemRow = {
  id: string
  contract_id: string
  statut: MissionItemStatus
  contract: {
    id: string
    numero: string
    adresse_geocodee: string | null
    latitude: number | null
    longitude: number | null
    client: { prenom: string; nom: string; entreprise: string | null } | null
  } | null
}

/** Mirror de `getRoutesMapData` (module Routes), scopé à une seule Mission et coloré par statut de MissionItem. */
export async function getMissionMapData(missionId: string): Promise<MissionMapPoint[]> {
  const { data: itemsData, error: itemsError } = await supabase
    .from('mission_items')
    .select(
      `id, contract_id, statut,
       contract:contracts(id, numero, adresse_geocodee, latitude, longitude, client:clients(prenom, nom, entreprise))`,
    )
    .eq('mission_id', missionId)
    .is('deleted_at', null)
  if (itemsError) throw itemsError
  const items = (itemsData ?? []) as unknown as MapMissionItemRow[]

  const contractIds = items.map((item) => item.contract_id)
  let zones: ContractZoneRow[] = []
  if (contractIds.length > 0) {
    const { data: zonesData, error: zonesError } = await supabase
      .from('contract_zones')
      .select('*')
      .in('contract_id', contractIds)
      .is('deleted_at', null)
    if (zonesError) throw zonesError
    zones = (zonesData ?? []) as ContractZoneRow[]
  }
  const zonesByContract = new Map<string, ContractZoneRow[]>()
  for (const zone of zones) {
    const list = zonesByContract.get(zone.contract_id) ?? []
    list.push(zone)
    zonesByContract.set(zone.contract_id, list)
  }

  const points: MissionMapPoint[] = []
  for (const item of items) {
    const contract = item.contract
    if (!contract) continue
    const point = computeContractPoint(zonesByContract.get(item.contract_id) ?? [], contract)
    if (!point) continue
    const client = contract.client
    points.push({
      missionItemId: item.id,
      contractId: item.contract_id,
      missionId,
      itemStatus: item.statut,
      color: MISSION_ITEM_STATUS_HEX[item.statut],
      lng: point[0],
      lat: point[1],
      numero: contract.numero,
      clientName: client ? client.entreprise || `${client.prenom} ${client.nom}` : '—',
      adresse: contract.adresse_geocodee,
    })
  }

  return points
}
