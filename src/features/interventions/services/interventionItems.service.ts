import { supabase } from '@/lib/supabaseClient'
import type { InterventionItemUpdateFormValues } from '../schemas/interventionItemUpdate.schema'
import type {
  InterventionItem,
  InterventionItemClientRef,
  InterventionItemRow,
} from '../types/interventionItem.types'

const SELECT_WITH_CLIENT = '*, client:clients(id, prenom, nom, adresse, telephone, latitude, longitude)'

type InterventionItemRowWithClient = InterventionItemRow & { client: InterventionItemClientRef | null }

function mapInterventionItem(row: InterventionItemRowWithClient): InterventionItem {
  return {
    id: row.id,
    interventionId: row.intervention_id,
    clientId: row.client_id,
    ordre: row.ordre,
    statut: row.statut,
    notes: row.notes,
    codeProbleme: row.code_probleme,
    heureDebut: row.heure_debut,
    heureFin: row.heure_fin,
    tempsDeplacementSecondes: row.temps_deplacement_secondes,
    tempsInterventionSecondes: row.temps_intervention_secondes,
    client: row.client,
  }
}

export async function listInterventionItems(interventionId: string): Promise<InterventionItem[]> {
  const { data, error } = await supabase
    .from('intervention_items')
    .select(SELECT_WITH_CLIENT)
    .eq('intervention_id', interventionId)
    .is('deleted_at', null)
    .order('ordre', { ascending: true })

  if (error) throw error
  return ((data ?? []) as unknown as InterventionItemRowWithClient[]).map(mapInterventionItem)
}

/**
 * Stand-in manuel pour ce que RECA Operator reportera directement plus tard (statut
 * modifiable à la main tant que l'app terrain n'existe pas — décision confirmée). Pose
 * heure_debut la 1ère fois que le statut quitte "planifiee", heure_fin en passant à
 * "terminee" — jamais réécrasées si déjà posées, pour ne pas fausser un aller-retour de
 * statut ultérieur.
 */
export async function updateInterventionItemStatus(
  id: string,
  values: InterventionItemUpdateFormValues,
): Promise<InterventionItem> {
  const { data: current, error: currentError } = await supabase
    .from('intervention_items')
    .select('heure_debut, heure_fin')
    .eq('id', id)
    .single()
  if (currentError) throw currentError

  const currentRow = current as { heure_debut: string | null; heure_fin: string | null }
  const patch: Partial<InterventionItemRow> = {
    statut: values.statut,
    notes: values.notes || null,
    code_probleme: values.codeProbleme || null,
  }
  if (values.statut !== 'planifiee' && !currentRow.heure_debut) {
    patch.heure_debut = new Date().toISOString()
  }
  if (values.statut === 'terminee' && !currentRow.heure_fin) {
    patch.heure_fin = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('intervention_items')
    .update(patch as never)
    .eq('id', id)
    .select(SELECT_WITH_CLIENT)
    .single()

  if (error) throw error
  return mapInterventionItem(data as unknown as InterventionItemRowWithClient)
}
