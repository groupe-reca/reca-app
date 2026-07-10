import { createCrudService } from '@/lib/supabaseCrud'
import type { LeadFormValues } from '../schemas/lead.schema'
import type { Lead, LeadRow, LeadStatus } from '../types/lead.types'

const leadsCrud = createCrudService<LeadRow>('leads')

function mapLead(row: LeadRow): Lead {
  return {
    id: row.id,
    numero: row.numero,
    prenom: row.prenom,
    nom: row.nom,
    telephone: row.telephone,
    courriel: row.courriel,
    adresse: row.adresse,
    ville: row.ville,
    codePostal: row.code_postal,
    typeService: row.type_service,
    message: row.message,
    source: row.source,
    statut: row.statut,
    assigneA: row.assigne_a,
    rappelLe: row.rappel_le,
    rappelNote: row.rappel_note,
    createdAt: row.created_at,
  }
}

function toRowInput(values: LeadFormValues): Partial<LeadRow> {
  return {
    prenom: values.prenom,
    nom: values.nom,
    telephone: values.telephone || null,
    courriel: values.courriel || null,
    adresse: values.adresse || null,
    ville: values.ville || null,
    code_postal: values.codePostal || null,
    type_service: values.typeService || null,
    message: values.message || null,
    source: values.source || null,
  }
}

export async function listLeads(): Promise<Lead[]> {
  const rows = await leadsCrud.list()
  return rows.map(mapLead)
}

export async function getLead(id: string): Promise<Lead> {
  const row = await leadsCrud.getById(id)
  return mapLead(row)
}

export async function createLead(values: LeadFormValues): Promise<Lead> {
  const row = await leadsCrud.create(toRowInput(values))
  return mapLead(row)
}

export async function updateLead(id: string, values: LeadFormValues): Promise<Lead> {
  const row = await leadsCrud.update(id, toRowInput(values))
  return mapLead(row)
}

export async function updateLeadStatus(id: string, statut: LeadStatus): Promise<Lead> {
  const row = await leadsCrud.update(id, { statut })
  return mapLead(row)
}

export async function softDeleteLead(id: string): Promise<void> {
  await leadsCrud.softDelete(id)
}

export async function scheduleReminder(id: string, rappelLe: string, rappelNote: string): Promise<Lead> {
  const row = await leadsCrud.update(id, { rappel_le: rappelLe, rappel_note: rappelNote || null })
  return mapLead(row)
}
