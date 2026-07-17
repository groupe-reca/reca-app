import { supabase } from '@/lib/supabaseClient'
import type { SatelliteAnalysisResult } from '../types/satelliteAnalysis.types'

/**
 * Envoie l'image satellite déjà capturée (chemin Storage `contract-captures`) à
 * l'Edge Function `analyze-satellite-image`, qui appelle Gemini 2.5 Flash côté serveur
 * (clé API jamais exposée côté client). Lève une erreur sur échec — laissé à l'appelant
 * de la transformer en toast (même convention que `geocoding.service.ts`).
 */
export async function analyzeSatelliteImage(storagePath: string): Promise<SatelliteAnalysisResult> {
  const { data, error } = await supabase.functions.invoke<SatelliteAnalysisResult>('analyze-satellite-image', {
    body: { storagePath },
  })
  if (error || !data) throw new Error("Échec de l'analyse satellite automatique.")
  return data
}
