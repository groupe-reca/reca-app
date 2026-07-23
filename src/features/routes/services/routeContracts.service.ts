import { supabase } from '@/lib/supabaseClient'
import type { RouteContract } from '../types/routeContract.types'
import type { ContractStatus } from '@/features/contracts/types/contract.types'

const SELECT_ROUTE_CONTRACTS = `
  id, route_id, contract_id, ordre,
  contract:contracts(id, numero, adresse_geocodee, statut)
`

type RouteContractJoinRow = {
  id: string
  route_id: string
  contract_id: string
  ordre: number
  contract: { id: string; numero: string; adresse_geocodee: string | null; statut: ContractStatus } | null
}

function mapRouteContract(row: RouteContractJoinRow): RouteContract | null {
  if (!row.contract) return null
  return {
    id: row.id,
    routeId: row.route_id,
    contractId: row.contract_id,
    ordre: row.ordre,
    numero: row.contract.numero,
    adresseGeocodee: row.contract.adresse_geocodee,
    statut: row.contract.statut,
  }
}

export async function listRouteContracts(routeId: string): Promise<RouteContract[]> {
  const { data, error } = await supabase
    .from('route_contracts')
    .select(SELECT_ROUTE_CONTRACTS)
    .eq('route_id', routeId)
    .is('deleted_at', null)
    .order('ordre', { ascending: true })
  if (error) throw error
  return ((data ?? []) as unknown as RouteContractJoinRow[])
    .map(mapRouteContract)
    .filter((rc): rc is RouteContract => rc !== null)
}

/**
 * Fonction unique partagée par l'assignation rapide (onglet Contrats), "Ajouter un contrat"
 * (fiche Route) et "Transférer" — retire toute ligne active existante pour ce contrat (peu
 * importe la route) puis l'insère en fin de la route cible.
 */
export async function assignContractToRoute(contractId: string, routeId: string): Promise<void> {
  const { error: removeError } = await supabase
    .from('route_contracts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('contract_id', contractId)
    .is('deleted_at', null)
  if (removeError) throw removeError

  const { data: existing, error: maxError } = await supabase
    .from('route_contracts')
    .select('ordre')
    .eq('route_id', routeId)
    .is('deleted_at', null)
    .order('ordre', { ascending: false })
    .limit(1)
  if (maxError) throw maxError
  const nextOrdre = (existing?.[0]?.ordre ?? -1) + 1

  const { error: insertError } = await supabase
    .from('route_contracts')
    .insert({ route_id: routeId, contract_id: contractId, ordre: nextOrdre } as never)
  if (insertError) throw insertError
}

export async function removeContractFromRoute(routeContractId: string): Promise<void> {
  const { error } = await supabase
    .from('route_contracts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', routeContractId)
  if (error) throw error
}

export async function reorderRouteContract(
  routeContractId: string,
  direction: 'up' | 'down',
): Promise<void> {
  const { error } = await supabase.rpc('reorder_route_contract', {
    p_route_contract_id: routeContractId,
    p_direction: direction,
  })
  if (error) throw error
}
