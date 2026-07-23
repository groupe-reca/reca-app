import { supabase } from '@/lib/supabaseClient'
import type { ContractZoneRow } from '@/features/contracts/types/contract.types'
import { computeContractPoint } from '../utils/contractPoint'
import type { RouteMapData, RouteMapPoint } from '../types/routeMapPoint.types'

type MapRouteRow = { id: string; nom: string; couleur: string }

type MapRouteContractRow = {
  route_id: string
  contract_id: string
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

export async function getRoutesMapData(): Promise<RouteMapData> {
  const { data: routesData, error: routesError } = await supabase
    .from('routes')
    .select('id, nom, couleur')
    .is('deleted_at', null)
  if (routesError) throw routesError
  const routes = (routesData ?? []) as MapRouteRow[]
  const routeById = new Map(routes.map((route) => [route.id, route]))

  const { data: rcsData, error: rcsError } = await supabase
    .from('route_contracts')
    .select(
      `route_id, contract_id,
       contract:contracts(id, numero, statut, adresse_geocodee, latitude, longitude, client:clients(prenom, nom, entreprise))`,
    )
    .is('deleted_at', null)
  if (rcsError) throw rcsError
  const rcs = (rcsData ?? []) as unknown as MapRouteContractRow[]

  const contractIds = rcs.map((rc) => rc.contract_id)
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

  const points: RouteMapPoint[] = []
  for (const rc of rcs) {
    const contract = rc.contract
    const route = routeById.get(rc.route_id)
    if (!contract || !route) continue
    const point = computeContractPoint(zonesByContract.get(rc.contract_id) ?? [], contract)
    if (!point) continue
    const client = contract.client
    points.push({
      contractId: rc.contract_id,
      routeId: rc.route_id,
      routeName: route.nom,
      routeColor: route.couleur,
      lng: point[0],
      lat: point[1],
      numero: contract.numero,
      clientName: client ? client.entreprise || `${client.prenom} ${client.nom}` : '—',
      adresse: contract.adresse_geocodee,
      statut: contract.statut,
    })
  }

  return {
    routes: routes.map((route) => ({ id: route.id, nom: route.nom, couleur: route.couleur })),
    points,
  }
}
