import { supabase } from '@/lib/supabaseClient'
import type { ContractFormValues } from '../schemas/contract.schema'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'
import type {
  Contract,
  ContractClientRef,
  ContractRow,
  ContractStatus,
  PaymentScheduleEntry,
} from '../types/contract.types'

const SELECT_WITH_CLIENT = '*, client:clients(id, numero, prenom, nom)'
const TPS_RATE = 0.05
const TVQ_RATE = 0.09975

type ContractRowWithClient = ContractRow & { client: ContractClientRef | null }

function mapContract(row: ContractRowWithClient): Contract {
  return {
    id: row.id,
    numero: row.numero,
    clientId: row.client_id,
    type: row.type,
    saison: row.saison,
    prix: row.prix,
    statut: row.statut,
    dateSignature: row.date_signature,
    dateDebut: row.date_debut,
    dateFin: row.date_fin,
    renouvellement: row.renouvellement,
    notes: row.notes,
    zoneDesservie: row.zone_desservie,
    superficie: row.superficie,
    exclusions: row.exclusions,
    seuilDeclenchementCm: row.seuil_declenchement_cm,
    heurePremierPassage: row.heure_premier_passage,
    nettoyageFinal: row.nettoyage_final,
    distanceSecuriteCm: row.distance_securite_cm,
    balisesRequises: row.balises_requises,
    obligationsClient: row.obligations_client,
    responsabilites: row.responsabilites,
    modalitesPaiement: row.modalites_paiement,
    createdAt: row.created_at,
    client: row.client,
  }
}

function toRowInput(values: ContractFormValues): Partial<ContractRow> {
  return {
    type: values.type || null,
    saison: values.saison || null,
    prix: values.prix ? Number(values.prix) : null,
    date_signature: values.dateSignature || null,
    date_debut: values.dateDebut || null,
    date_fin: values.dateFin || null,
    renouvellement: values.renouvellement ?? false,
    notes: values.notes || null,
  }
}

function toCreationRowInput(values: ContractCreationFormValues): Partial<ContractRow> {
  return {
    type: values.type || null,
    saison: values.saison || null,
    prix: values.prix ? Number(values.prix) : null,
    date_signature: values.dateSignature || null,
    date_debut: values.dateDebut || null,
    date_fin: values.dateFin || null,
    renouvellement: values.renouvellement ?? false,
    notes: values.notes || null,
    zone_desservie: values.zoneDesservie,
    superficie: values.superficie ? Number(values.superficie) : null,
    exclusions: values.exclusions,
    seuil_declenchement_cm: Number(values.seuilDeclenchementCm),
    heure_premier_passage: values.heurePremierPassage,
    nettoyage_final: values.nettoyageFinal,
    distance_securite_cm: Number(values.distanceSecuriteCm),
    balises_requises: values.balisesRequises ?? true,
    obligations_client: values.obligationsClient,
    responsabilites: values.responsabilites,
    modalites_paiement: values.modalitesPaiement.map((entry) => ({
      description: entry.description,
      type: entry.type,
      valeur: Number(entry.valeur),
      dateEcheance: entry.dateEcheance,
    })),
  }
}

export async function listContracts(): Promise<Contract[]> {
  const { data, error } = await supabase
    .from('contracts')
    .select(SELECT_WITH_CLIENT)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as ContractRowWithClient[]).map(mapContract)
}

export async function listContractsByClient(clientId: string): Promise<Contract[]> {
  const { data, error } = await supabase
    .from('contracts')
    .select(SELECT_WITH_CLIENT)
    .eq('client_id', clientId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as ContractRowWithClient[]).map(mapContract)
}

export async function getContract(id: string): Promise<Contract> {
  const { data, error } = await supabase.from('contracts').select(SELECT_WITH_CLIENT).eq('id', id).single()
  if (error) throw error
  return mapContract(data as unknown as ContractRowWithClient)
}

export async function createContract(
  values: ContractCreationFormValues,
  clientId: string,
  statut: ContractStatus,
): Promise<Contract> {
  const input = { ...toCreationRowInput(values), client_id: clientId, statut }
  const { data, error } = await supabase
    .from('contracts')
    .insert(input as never)
    .select(SELECT_WITH_CLIENT)
    .single()

  if (error) throw error
  return mapContract(data as unknown as ContractRowWithClient)
}

function computeInstallmentAmount(entry: PaymentScheduleEntry, prix: number | null): number {
  if (entry.type === 'pourcentage') return Math.round((((prix ?? 0) * entry.valeur) / 100) * 100) / 100
  return entry.valeur
}

async function generateInvoicesFromSchedule(contract: Contract): Promise<{ generated: number }> {
  let generated = 0
  for (const entry of contract.modalitesPaiement) {
    const sousTotal = computeInstallmentAmount(entry, contract.prix)
    const tps = Math.round(sousTotal * TPS_RATE * 100) / 100
    const tvq = Math.round(sousTotal * TVQ_RATE * 100) / 100
    const total = sousTotal + tps + tvq
    const { error } = await supabase.from('invoices').insert({
      client_id: contract.clientId,
      contrat_id: contract.id,
      date: entry.dateEcheance,
      sous_total: sousTotal,
      tps,
      tvq,
      total,
      solde: total,
    } as never)
    if (!error) generated += 1
  }
  return { generated }
}

export async function createContractWithInvoices(
  values: ContractCreationFormValues,
  clientId: string,
  finalize: boolean,
): Promise<{ contract: Contract; invoicesGenerated: number; invoicesTotal: number }> {
  const contract = await createContract(values, clientId, finalize ? 'actif' : 'en_attente')
  if (!finalize || contract.modalitesPaiement.length === 0) {
    return { contract, invoicesGenerated: 0, invoicesTotal: 0 }
  }
  const { generated } = await generateInvoicesFromSchedule(contract)
  return { contract, invoicesGenerated: generated, invoicesTotal: contract.modalitesPaiement.length }
}

export async function updateContract(id: string, values: ContractFormValues): Promise<Contract> {
  const { data, error } = await supabase
    .from('contracts')
    .update(toRowInput(values) as never)
    .eq('id', id)
    .select(SELECT_WITH_CLIENT)
    .single()

  if (error) throw error
  return mapContract(data as unknown as ContractRowWithClient)
}

export async function updateContractStatus(id: string, statut: ContractStatus): Promise<Contract> {
  const { data, error } = await supabase
    .from('contracts')
    .update({ statut } as never)
    .eq('id', id)
    .select(SELECT_WITH_CLIENT)
    .single()

  if (error) throw error
  return mapContract(data as unknown as ContractRowWithClient)
}

export async function softDeleteContract(id: string): Promise<void> {
  const { error } = await supabase
    .from('contracts')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}
