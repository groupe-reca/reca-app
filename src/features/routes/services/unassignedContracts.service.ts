import { supabase } from '@/lib/supabaseClient'
import type { UnassignedContract } from '../types/unassignedContract.types'
import type { ContractStatus } from '@/features/contracts/types/contract.types'

type UnassignedContractJoinRow = {
  id: string
  numero: string
  type: string | null
  statut: ContractStatus
  adresse_geocodee: string | null
  client: { prenom: string; nom: string; entreprise: string | null } | null
}

function mapUnassignedContract(row: UnassignedContractJoinRow): UnassignedContract {
  const client = row.client
  const clientName = client ? client.entreprise || `${client.prenom} ${client.nom}` : '—'
  return {
    id: row.id,
    numero: row.numero,
    clientName,
    adresse: row.adresse_geocodee,
    type: row.type,
    statut: row.statut,
  }
}

/**
 * Contrats de la saison courante, Actif/Suspendu, n'appartenant à aucune Route — anti-join
 * orchestré côté client (2 requêtes séquentielles), même style que `hasOverdueInvoice` dans
 * `contracts.service.ts`.
 */
export async function listUnassignedContracts(season: string | null): Promise<UnassignedContract[]> {
  const { data: routed, error: routedError } = await supabase
    .from('route_contracts')
    .select('contract_id')
    .is('deleted_at', null)
  if (routedError) throw routedError
  const routedIds = (routed ?? []).map((row) => row.contract_id as string)

  let query = supabase
    .from('contracts')
    .select('id, numero, type, statut, adresse_geocodee, client:clients(prenom, nom, entreprise)')
    .is('deleted_at', null)
    .in('statut', ['actif', 'suspendu'])

  if (season) query = query.eq('saison', season)
  if (routedIds.length > 0) query = query.not('id', 'in', `(${routedIds.join(',')})`)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return ((data ?? []) as unknown as UnassignedContractJoinRow[]).map(mapUnassignedContract)
}
