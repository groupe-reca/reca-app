import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import type { SatelliteAnalysisResult } from '../types/satelliteAnalysis.types'
import type { AiModel, AiProvider } from '../types/contractWizardDefaults.types'

/**
 * Envoie l'image satellite déjà capturée (chemin Storage `contract-captures`) à
 * l'Edge Function `analyze-satellite-image`, qui appelle le fournisseur IA choisi côté
 * serveur (clé API jamais exposée côté client) — `aiProvider`/`aiModel` (paramètres
 * admin, voir `ContractWizardDefaultsForm.tsx`) sélectionnent Google (Flash/Pro) ou
 * TokenRouter, l'Edge Function route vers le bon endpoint. Lève une erreur sur échec —
 * laissé à l'appelant de la transformer en toast (même convention que
 * `geocoding.service.ts`).
 *
 * Sur une erreur HTTP de l'Edge Function (`FunctionsHttpError`), le message précis
 * (`{ error: string }`, ex: "Quota Gemini dépassé…") est extrait du corps de la réponse
 * plutôt que d'afficher un message générique — diagnostiqué le 2026-07-17 : un échec
 * "Impossible d'analyser l'image satellite." générique masquait des causes très
 * différentes (503 Gemini surchargé vs 429 quota dépassé), impossibles à distinguer
 * sans lire les logs serveur.
 */
export async function analyzeSatelliteImage(
  storagePath: string,
  aiProvider: AiProvider,
  aiModel: AiModel,
  systemPrompt: string,
): Promise<SatelliteAnalysisResult> {
  const { data, error } = await supabase.functions.invoke<SatelliteAnalysisResult>('analyze-satellite-image', {
    body: { storagePath, aiProvider, aiModel, systemPrompt },
  })
  if (error) {
    if (error instanceof FunctionsHttpError) {
      const body = await error.context.json().catch(() => null)
      throw new Error(typeof body?.error === 'string' ? body.error : "Échec de l'analyse satellite automatique.")
    }
    throw new Error("Échec de l'analyse satellite automatique.")
  }
  if (!data) throw new Error("Échec de l'analyse satellite automatique.")
  return data
}
