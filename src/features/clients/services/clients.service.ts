import { supabase } from '@/lib/supabaseClient'
import { createCrudService } from '@/lib/supabaseCrud'
import type { ClientFormValues } from '../schemas/client.schema'
import type { Client, ClientEditorRef, ClientRow } from '../types/client.types'

const clientsCrud = createCrudService<ClientRow>('clients')

const SELECT_WITH_EDITOR = '*, updated_by_user:users(id, nom)'

type ClientRowWithEditor = ClientRow & { updated_by_user: ClientEditorRef | null }

function mapClient(row: ClientRow, updatedBy: ClientEditorRef | null = null): Client {
  return {
    id: row.id,
    numero: row.numero,
    prenom: row.prenom,
    nom: row.nom,
    entreprise: row.entreprise,
    telephone: row.telephone,
    courriel: row.courriel,
    adresse: row.adresse,
    ville: row.ville,
    codePostal: row.code_postal,
    latitude: row.latitude,
    longitude: row.longitude,
    typeClient: row.type_client,
    notes: row.notes,
    statut: row.statut,
    langue: row.langue,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    updatedBy,
  }
}

function toRowInput(values: ClientFormValues): Partial<ClientRow> {
  return {
    prenom: values.prenom,
    nom: values.nom,
    entreprise: values.entreprise || null,
    telephone: values.telephone || null,
    courriel: values.courriel || null,
    adresse: values.adresse || null,
    ville: values.ville || null,
    code_postal: values.codePostal || null,
    latitude: values.latitude ? Number(values.latitude) : null,
    longitude: values.longitude ? Number(values.longitude) : null,
    type_client: values.typeClient || null,
    notes: values.notes || null,
    statut: values.statut,
    langue: values.langue,
  }
}

export async function listClients(): Promise<Client[]> {
  const rows = await clientsCrud.list()
  return rows.map((row) => mapClient(row))
}

/**
 * Requête dédiée (pas `clientsCrud.getById`) — embarque l'éditeur pour "Dernière modification".
 * Replié sur un `select('*')` simple si l'embed échoue (FK `clients.updated_by → users` pas encore
 * appliquée, migration `20260719010000`) — la fiche reste consultable, seule "Dernière modification"
 * perd le nom de l'éditeur en attendant, plutôt que de faire échouer toute la page.
 */
export async function getClient(id: string): Promise<Client> {
  const { data, error } = await supabase.from('clients').select(SELECT_WITH_EDITOR).eq('id', id).single()
  if (!error) {
    const row = data as unknown as ClientRowWithEditor
    return mapClient(row, row.updated_by_user)
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()
  if (fallbackError) throw fallbackError
  return mapClient(fallbackData as ClientRow, null)
}

export async function createClient(values: ClientFormValues): Promise<Client> {
  const row = await clientsCrud.create(toRowInput(values))
  return mapClient(row)
}

export async function updateClient(id: string, values: ClientFormValues): Promise<Client> {
  const row = await clientsCrud.update(id, toRowInput(values))
  return mapClient(row)
}

export async function softDeleteClient(id: string): Promise<void> {
  await clientsCrud.softDelete(id)
}
