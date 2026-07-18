import { supabase } from '@/lib/supabaseClient'
import { generateClauses } from '../utils/generateClauses'
import { computeInstallmentAmount } from '../utils/paymentPresets'
import { createContractEvent } from './contractEvents.service'
import { SERVICE_OPTIONS } from '../constants/wizardOptions'
import { DEFAULT_CONTRACT_WIZARD_DEFAULTS } from '../types/contractWizardDefaults.types'
import type { ContractWizardDefaults } from '../types/contractWizardDefaults.types'
import type { ContractFormValues } from '../schemas/contract.schema'
import type {
  ContractCreationFormValues,
  ContractDraftFormValues,
  ContractPhotoFormValues,
  ContractZoneFormValues,
} from '../schemas/contractCreation.schema'
import type {
  Contract,
  ContractClientRef,
  ContractPhotoRow,
  ContractRow,
  ContractStatus,
  ContractZoneRow,
  ObligationsAnswers,
  ServiceEntry,
} from '../types/contract.types'

const SELECT_WITH_CLIENT =
  '*, client:clients(id, numero, prenom, nom, telephone, courriel, adresse, ville, code_postal)'
const SELECT_LIST_WITH_INVOICES = `${SELECT_WITH_CLIENT}, invoices(statut)`
const TPS_RATE = 0.05
const TVQ_RATE = 0.09975

type ContractClientJoinRow = {
  id: string
  numero: string
  prenom: string
  nom: string
  telephone: string | null
  courriel: string | null
  adresse: string | null
  ville: string | null
  code_postal: string | null
}
type ContractRowWithClient = ContractRow & { client: ContractClientJoinRow | null }
type ContractRowWithClientAndInvoices = ContractRowWithClient & { invoices: { statut: string }[] }
type WizardValues = ContractCreationFormValues | ContractDraftFormValues

function mapContractClient(client: ContractClientJoinRow | null): ContractClientRef | null {
  if (!client) return null
  return {
    id: client.id,
    numero: client.numero,
    prenom: client.prenom,
    nom: client.nom,
    telephone: client.telephone,
    courriel: client.courriel,
    adresse: client.adresse,
    ville: client.ville,
    codePostal: client.code_postal,
  }
}

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
    modeConclusion: row.mode_conclusion,
    depotNeige: row.depot_neige,
    permisMunicipalObtenu: row.permis_municipal_obtenu,
    clauseAnnulation: row.clause_annulation,
    clausePrix: row.clause_prix,
    clauseExecution: row.clause_execution,
    clauseAssurance: row.clause_assurance,
    prixTaxes: row.prix_taxes,
    obstaclesConnus: row.obstacles_connus,
    messageOperateur: row.message_operateur,
    consignesSpeciales: row.consignes_speciales,
    createdAt: row.created_at,
    client: mapContractClient(row.client),
    hasOverdueInvoice: false,
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

type ContractWizardSettings = {
  assurancePoliceNo: string | null
  defaults: ContractWizardDefaults
}

/**
 * Tâche 5 : la plupart des champs "généraux" du contrat (saison, dates, services,
 * seuil d'intervention, heure limite de dégagement, dépôt de la neige, mode de
 * conclusion) ne sont plus saisis par contrat — ils sont "toujours les mêmes pour
 * tout le monde" et proviennent des paramètres par défaut du Wizard
 * (`settings.contract_wizard_defaults`, éditables via le menu de configuration du
 * module Contrats), lus ici à chaque sauvegarde/finalisation plutôt qu'une seule
 * fois côté formulaire, pour qu'un changement de défaut s'applique immédiatement.
 */
async function fetchContractWizardSettings(): Promise<ContractWizardSettings> {
  const { data, error } = await supabase
    .from('settings')
    .select('assurance_police_no, contract_wizard_defaults')
    .eq('id', true)
    .single()
  if (error) throw error
  const row = data as { assurance_police_no: string | null; contract_wizard_defaults: Partial<ContractWizardDefaults> | null }
  return {
    assurancePoliceNo: row.assurance_police_no,
    defaults: { ...DEFAULT_CONTRACT_WIZARD_DEFAULTS, ...row.contract_wizard_defaults },
  }
}

function toWizardRowInput(
  values: WizardValues,
  clientTypeLabel: string | null,
  settings: ContractWizardSettings,
): Partial<ContractRow> {
  const { defaults } = settings
  const obligations: ObligationsAnswers = {
    seuilDeclenchementCm: defaults.seuilDeclenchementCm,
    heurePremierPassage: defaults.heurePremierPassage,
    depotNeige: defaults.depotNeige,
    permisMunicipalObtenu: false,
  }
  const generated = generateClauses(obligations, {
    type: clientTypeLabel,
    modeConclusion: defaults.modeConclusion,
    assurancePoliceNo: settings.assurancePoliceNo,
  })
  const services: ServiceEntry[] = SERVICE_OPTIONS.map((option) => ({
    code: option.code,
    label: option.label,
    active: defaults.serviceCodes.includes(option.code),
    precisions: null,
  }))
  const superficie = values.zones.length
    ? Math.round(values.zones.reduce((sum, zone) => sum + zone.surfaceM2, 0) * 100) / 100
    : null

  return {
    type: clientTypeLabel,
    saison: defaults.saison,
    prix: values.prix ? Number(values.prix) : null,
    date_debut: defaults.dateDebut,
    date_fin: defaults.dateFin,
    notes: values.notes || null,
    superficie,
    exclusions: generated.exclusions,
    seuil_declenchement_cm: obligations.seuilDeclenchementCm,
    heure_premier_passage: obligations.heurePremierPassage,
    nettoyage_final: generated.nettoyageFinal,
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
    mode_paiement: values.modePaiement || null,
    services,
    obligations_reponses: obligations,
    mode_conclusion: defaults.modeConclusion,
    depot_neige: obligations.depotNeige,
    permis_municipal_obtenu: obligations.permisMunicipalObtenu,
    clause_annulation: generated.clauseAnnulation,
    clause_prix: generated.clausePrix,
    clause_execution: generated.clauseExecution,
    clause_assurance: generated.clauseAssurance,
    prix_taxes: defaults.prixTaxes,
  }
}

export async function listContracts(): Promise<Contract[]> {
  const { data, error } = await supabase
    .from('contracts')
    .select(SELECT_LIST_WITH_INVOICES)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return ((data ?? []) as unknown as ContractRowWithClientAndInvoices[]).map((row) => ({
    ...mapContract(row),
    hasOverdueInvoice: row.invoices?.some((invoice) => invoice.statut === 'en_retard') ?? false,
  }))
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

/** Pont entre `listContractZones` (DB, snake_case) et `PolygonCard`/`ZoneAreaSummary` (camelCase, forme du Wizard). */
export function mapZoneRowToFormValues(row: ContractZoneRow): ContractZoneFormValues {
  return {
    id: row.id,
    type: row.type,
    label: row.label,
    geojson: row.geojson,
    surfaceM2: row.surface_m2,
    imageStoragePath: row.image_storage_path,
    ordre: row.ordre,
    capturedAt: row.captured_at,
  }
}

export async function listContractPhotos(contractId: string): Promise<ContractPhotoRow[]> {
  const { data, error } = await supabase
    .from('contract_photos')
    .select('*')
    .eq('contract_id', contractId)
    .is('deleted_at', null)
    .order('ordre', { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown as ContractPhotoRow[]
}

/**
 * Resynchronise les zones d'un contrat avec le tableau courant du formulaire —
 * jamais un `.delete()` (aucune policy DELETE en RLS, cf. 20260709143718_rls_policies.sql :
 * un delete brut supprimerait silencieusement 0 ligne et dupliquerait les zones à
 * chaque cycle brouillon→reprise→re-sauvegarde). Les lignes existantes sont
 * soft-supprimées, puis un `upsert` (par `id`, stable côté client depuis le tracé)
 * réactive/actualise les zones toujours présentes ; celles retirées par
 * l'utilisateur restent soft-supprimées.
 */
async function syncContractZones(contractId: string, zones: ContractZoneFormValues[]): Promise<void> {
  const { error: softDeleteError } = await supabase
    .from('contract_zones')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('contract_id', contractId)
    .is('deleted_at', null)
  if (softDeleteError) throw softDeleteError

  if (zones.length === 0) return

  const zoneRows = zones.map((zone) => ({
    id: zone.id,
    contract_id: contractId,
    type: zone.type,
    label: zone.label,
    geojson: zone.geojson,
    surface_m2: zone.surfaceM2,
    image_storage_path: zone.imageStoragePath,
    ordre: zone.ordre,
    captured_at: zone.capturedAt,
    deleted_at: null,
  }))
  const { error } = await supabase.from('contract_zones').upsert(zoneRows as never, { onConflict: 'id' })
  if (error) throw error
}

/** Même principe que `syncContractZones`, pour les photos de propriété (sprint014). */
async function syncContractPhotos(contractId: string, photos: ContractPhotoFormValues[]): Promise<void> {
  const { error: softDeleteError } = await supabase
    .from('contract_photos')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('contract_id', contractId)
    .is('deleted_at', null)
  if (softDeleteError) throw softDeleteError

  if (photos.length === 0) return

  const photoRows = photos.map((photo) => ({
    id: photo.id,
    contract_id: contractId,
    storage_path: photo.storagePath,
    ordre: photo.ordre,
    deleted_at: null,
  }))
  const { error } = await supabase.from('contract_photos').upsert(photoRows as never, { onConflict: 'id' })
  if (error) throw error
}

/**
 * Tâche 6 : `entry`/`computeInstallmentAmount` donnent toujours un montant en
 * dollars pour cette échéance — sa nature dépend de `prixTaxes` : une portion
 * du sous-total (avant taxes, comportement d'origine) ou une portion du total
 * taxes incluses (après taxes, auquel cas le sous-total est retrouvé par
 * division plutôt que multiplication, pour que sous-total+TPS+TVQ = ce montant).
 */
function computeInstallmentTaxes(
  amount: number,
  prixTaxes: Contract['prixTaxes'],
): { sousTotal: number; tps: number; tvq: number; total: number } {
  if (prixTaxes === 'apres_taxes') {
    const sousTotal = Math.round((amount / (1 + TPS_RATE + TVQ_RATE)) * 100) / 100
    const tps = Math.round(sousTotal * TPS_RATE * 100) / 100
    const tvq = Math.round(sousTotal * TVQ_RATE * 100) / 100
    return { sousTotal, tps, tvq, total: amount }
  }
  const tps = Math.round(amount * TPS_RATE * 100) / 100
  const tvq = Math.round(amount * TVQ_RATE * 100) / 100
  return { sousTotal: amount, tps, tvq, total: amount + tps + tvq }
}

async function generateInvoicesFromSchedule(contract: Contract): Promise<{ generated: number }> {
  let generated = 0
  for (const entry of contract.modalitesPaiement) {
    const amount = computeInstallmentAmount(entry, contract.prix)
    const { sousTotal, tps, tvq, total } = computeInstallmentTaxes(amount, contract.prixTaxes)
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
 * Fonction interne commune brouillon/finalisation — `upsert` (jamais `insert` seul)
 * sur `id: contractId` (généré côté client à l'ouverture du Wizard, avant même que la
 * ligne n'existe) : un contrat déjà sauvegardé en brouillon peut ainsi être resauvegardé
 * ou finalisé sans conflit de clé primaire.
 */
async function upsertContractWithZones(
  contractId: string,
  values: WizardValues,
  clientId: string,
  clientTypeLabel: string | null,
  statut: ContractStatus,
  options: { generateInvoices: boolean },
): Promise<{ contract: Contract; invoicesGenerated: number; invoicesTotal: number }> {
  const settings = await fetchContractWizardSettings()
  const input = {
    ...toWizardRowInput(values, clientTypeLabel, settings),
    id: contractId,
    client_id: clientId,
    statut,
  }

  // Distingue insertion vs mise à jour de brouillon avant l'upsert (Supabase ne le
  // renvoie pas) — nécessaire pour journaler le bon type d'événement réel :
  // 'contrat_cree' à la 1ère écriture, 'statut_modifie' si un brouillon existant
  // passe à 'actif' (finalisation), rien si un brouillon reste un brouillon.
  const { data: existing } = await supabase.from('contracts').select('id').eq('id', contractId).maybeSingle()

  const { data, error } = await supabase
    .from('contracts')
    .upsert(input as never, { onConflict: 'id' })
    .select(SELECT_WITH_CLIENT)
    .single()
  if (error) throw error
  const contract = mapContract(data as unknown as ContractRowWithClient)

  if (!existing) {
    await createContractEvent(contractId, 'contrat_cree')
  } else if (statut === 'actif') {
    await createContractEvent(contractId, 'statut_modifie', { statut: 'actif' })
  }

  await syncContractZones(contractId, values.zones)
  await syncContractPhotos(contractId, values.photos)

  if (!options.generateInvoices || contract.modalitesPaiement.length === 0) {
    return { contract, invoicesGenerated: 0, invoicesTotal: 0 }
  }
  const { generated } = await generateInvoicesFromSchedule(contract)
  return { contract, invoicesGenerated: generated, invoicesTotal: contract.modalitesPaiement.length }
}

/** Finalisation ("Créer") — statut `actif`, factures générées si des échéances existent. */
export async function createContractWithZones(
  contractId: string,
  values: ContractCreationFormValues,
  clientId: string,
  clientTypeLabel: string | null,
): Promise<{ contract: Contract; invoicesGenerated: number; invoicesTotal: number }> {
  return upsertContractWithZones(contractId, values, clientId, clientTypeLabel, 'actif', { generateInvoices: true })
}

/**
 * Brouillon ("Enregistrer le brouillon", disponible dès l'étape 1) — statut
 * `brouillon`, jamais de facture générée. Utilise le schéma allégé
 * (`contractDraftSchema`, validé en amont via `safeParse`, pas `handleSubmit`) —
 * fonctionne avec zéro zone/échéancier, contrairement à la finalisation.
 */
export async function saveContractDraft(
  contractId: string,
  values: ContractDraftFormValues,
  clientId: string,
  clientTypeLabel: string | null,
): Promise<{ contract: Contract }> {
  const { contract } = await upsertContractWithZones(contractId, values, clientId, clientTypeLabel, 'brouillon', {
    generateInvoices: false,
  })
  return { contract }
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

/** "Notes spécifiques à la résidence" — édition ciblée d'un des 4 champs (3 nouveaux + `notes` existant). */
export async function updateContractOperatorInfo(
  id: string,
  patch: Partial<Pick<ContractRow, 'obstacles_connus' | 'message_operateur' | 'consignes_speciales' | 'notes'>>,
): Promise<Contract> {
  const { data, error } = await supabase
    .from('contracts')
    .update(patch as never)
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
  await createContractEvent(id, 'statut_modifie', { statut })
  return mapContract(data as unknown as ContractRowWithClient)
}

export async function softDeleteContract(id: string): Promise<void> {
  const { error } = await supabase
    .from('contracts')
    .update({ deleted_at: new Date().toISOString() } as never)
    .eq('id', id)

  if (error) throw error
}
