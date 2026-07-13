import { supabase } from '@/lib/supabaseClient'
import { generateClauses } from '../utils/generateClauses'
import type { ContractFormValues } from '../schemas/contract.schema'
import type { ContractCreationFormValues } from '../schemas/contractCreation.schema'
import type {
  Contract,
  ContractClientRef,
  ContractRow,
  ContractStatus,
  ContractZoneRow,
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
    adresseGeocodee: row.adresse_geocodee,
    latitude: row.latitude,
    longitude: row.longitude,
    modePaiement: row.mode_paiement,
    services: row.services,
    obligationsReponses: row.obligations_reponses,
    accumulationMaximaleCm: row.accumulation_maximale_cm,
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

function toWizardRowInput(values: ContractCreationFormValues): Partial<ContractRow> {
  const generated = generateClauses(values.obligations)
  const superficie = Math.round(values.zones.reduce((sum, zone) => sum + zone.surfaceM2, 0) * 100) / 100

  return {
    type: values.type || null,
    saison: values.saison || null,
    prix: values.prix ? Number(values.prix) : null,
    date_signature: values.dateSignature || null,
    date_debut: values.dateDebut || null,
    date_fin: values.dateFin || null,
    renouvellement: values.renouvellement ?? false,
    notes: values.notes || null,
    superficie,
    exclusions: generated.exclusions,
    seuil_declenchement_cm: values.obligations.seuilDeclenchementCm,
    nettoyage_final: generated.nettoyageFinal,
    balises_requises: values.obligations.balisesRequises,
    obligations_client: generated.obligationsClient,
    responsabilites: generated.responsabilites,
    modalites_paiement: values.modalitesPaiement.map((entry) => ({
      description: entry.description,
      type: entry.type,
      valeur: Number(entry.valeur),
      dateEcheance: entry.dateEcheance,
    })),
    adresse_geocodee: values.adresseGeocodee || null,
    latitude: values.latitude ?? null,
    longitude: values.longitude ?? null,
    mode_paiement: values.modePaiement,
    services: values.services,
    obligations_reponses: values.obligations,
    accumulation_maximale_cm: values.obligations.accumulationMaximaleCm,
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

export async function listContractZones(contractId: string): Promise<ContractZoneRow[]> {
  const { data, error } = await supabase
    .from('contract_zones')
    .select('*')
    .eq('contract_id', contractId)
    .is('deleted_at', null)
    .order('ordre', { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown as ContractZoneRow[]
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

/**
 * Crée le contrat du Wizard (id fourni par l'appelant — généré au début du parcours,
 * pour que les captures satellite puissent être stockées avant même que le contrat
 * n'existe en base) ainsi que ses zones tracées, puis génère les factures si finalisé.
 */
export async function createContractWithZones(
  contractId: string,
  values: ContractCreationFormValues,
  clientId: string,
  finalize: boolean,
): Promise<{ contract: Contract; invoicesGenerated: number; invoicesTotal: number }> {
  const input = {
    ...toWizardRowInput(values),
    id: contractId,
    client_id: clientId,
    statut: (finalize ? 'actif' : 'en_attente') as ContractStatus,
  }

  const { data, error } = await supabase.from('contracts').insert(input as never).select(SELECT_WITH_CLIENT).single()
  if (error) throw error
  const contract = mapContract(data as unknown as ContractRowWithClient)

  const zoneRows = values.zones.map((zone) => ({
    id: zone.id,
    contract_id: contractId,
    label: zone.label,
    geojson: zone.geojson,
    surface_m2: zone.surfaceM2,
    image_storage_path: zone.imageStoragePath,
    ordre: zone.ordre,
    captured_at: zone.capturedAt,
  }))
  const { error: zonesError } = await supabase.from('contract_zones').insert(zoneRows as never)
  if (zonesError) throw zonesError

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
