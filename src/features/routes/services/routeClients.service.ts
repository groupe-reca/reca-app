import { supabase } from '@/lib/supabaseClient'

export type RouteClient = {
  id: string
  clientId: string
  ordre: number
  numero: string
  prenom: string
  nom: string
  adresse: string | null
}

type RouteClientRow = {
  id: string
  client_id: string
  ordre: number
  client: { id: string; numero: string; prenom: string; nom: string; adresse: string | null } | null
}

export async function listRouteClients(routeId: string): Promise<RouteClient[]> {
  const { data, error } = await supabase
    .from('route_clients')
    .select('id, client_id, ordre, client:clients(id, numero, prenom, nom, adresse)')
    .eq('route_id', routeId)
    .is('deleted_at', null)
    .order('ordre', { ascending: true })

  if (error) throw error

  return ((data ?? []) as unknown as RouteClientRow[])
    .filter((row) => row.client !== null)
    .map((row) => ({
      id: row.id,
      clientId: row.client_id,
      ordre: row.ordre,
      numero: row.client!.numero,
      prenom: row.client!.prenom,
      nom: row.client!.nom,
      adresse: row.client!.adresse,
    }))
}

export async function addClientToRoute(routeId: string, clientId: string): Promise<void> {
  const { data: existing, error: existingError } = await supabase
    .from('route_clients')
    .select('ordre')
    .eq('route_id', routeId)
    .is('deleted_at', null)
    .order('ordre', { ascending: false })
    .limit(1)

  if (existingError) throw existingError
  const nextOrdre = ((existing?.[0] as { ordre: number } | undefined)?.ordre ?? -1) + 1

  const { error } = await supabase
    .from('route_clients')
    .insert({ route_id: routeId, client_id: clientId, ordre: nextOrdre } as never)

  if (error) throw error
}

export async function removeClientFromRoute(id: string): Promise<void> {
  const { error } = await supabase
    .from('route_clients')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}

export async function swapClientOrder(
  firstId: string,
  firstOrdre: number,
  secondId: string,
  secondOrdre: number,
): Promise<void> {
  const { error: firstError } = await supabase
    .from('route_clients')
    .update({ ordre: secondOrdre } as never)
    .eq('id', firstId)
  if (firstError) throw firstError

  const { error: secondError } = await supabase
    .from('route_clients')
    .update({ ordre: firstOrdre } as never)
    .eq('id', secondId)
  if (secondError) throw secondError
}
