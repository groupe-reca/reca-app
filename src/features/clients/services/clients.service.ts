import { createCrudService } from '@/lib/supabaseCrud'
import type { ClientFormValues } from '../schemas/client.schema'
import type { Client, ClientRow } from '../types/client.types'

const clientsCrud = createCrudService<ClientRow>('clients')

function mapClient(row: ClientRow): Client {
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
    createdAt: row.created_at,
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
  }
}

export async function listClients(): Promise<Client[]> {
  const rows = await clientsCrud.list()
  return rows.map(mapClient)
}

export async function getClient(id: string): Promise<Client> {
  const row = await clientsCrud.getById(id)
  return mapClient(row)
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
