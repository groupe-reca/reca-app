// Edge Function — Détection automatique du stationnement (Wizard Contrats, étape
// "Délimiter"). Analyse l'image satellite déjà capturée (Storage privé
// `contract-captures`) via Gemini (modèle flash) et renvoie des bounding boxes
// suggérées.
//
// Modèle : `gemini-flash-latest` (alias maintenu par Google, pointe vers le modèle
// flash courant — actuellement gemini-3.5-flash) plutôt qu'un nom de modèle figé
// (`gemini-2.5-flash`, demandé initialement) — confirmé en test réel (2026-07-17,
// curl direct sur l'API Gemini) que `gemini-2.5-flash` renvoie 404 "no longer
// available to new users" malgré son apparition dans `models.list`. Utiliser l'alias
// `-latest` évite de revivre cette même panne à la prochaine dépréciation.
//
// Gemini ne calcule jamais de superficie ni de limites de propriété — il ne fait que
// suggérer un point de départ visuel, le tracé final ajusté par l'utilisateur (côté
// client, Mapbox GL Draw + Turf.js) reste la seule source de vérité pour le calcul.
//
// La clé Gemini (GEMINI_API_KEY) ne doit jamais être exposée côté client — cette
// fonction est le seul endroit qui la lit. JWT utilisateur vérifié par défaut par la
// plateforme (comportement standard Edge Functions, cohérent avec le reste de l'app).

import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@3'

const SATELLITE_ANALYSIS_SYSTEM_PROMPT = `
Tu analyses une image satellite d'une propriété résidentielle ou commerciale au
Québec, dans le but d'aider une entreprise de déneigement à identifier le
stationnement à déneiger.

Ta tâche :
1. Identifier chaque zone de stationnement distincte (aire pavée/carrossable utilisée
   pour garer des véhicules) — PAS les entrées piétonnes, allées, trottoirs ou la rue.
2. Pour chaque zone de stationnement : une bounding box approximative (elle servira
   uniquement de point de départ visuel — l'utilisateur retracera le contour précis
   lui-même).
3. Évaluer la qualité de l'image pour cette tâche :
   - "insuffisante" si la zone est couverte de neige, floue, trop sombre, ou si la
     résolution ne permet pas de distinguer les contours.
   - "moyenne" si l'analyse est possible mais incertaine (ombres partielles, angle
     limite, résolution basse).
   - "bonne" sinon.
   Si "moyenne" ou "insuffisante", explique brièvement pourquoi dans raison_qualite.

Règles strictes :
- Ne PAS estimer de superficie en m² ou pi² — ce calcul est fait ailleurs à partir du
  tracé réel de l'utilisateur.
- Ne PAS tenter de déterminer les limites de propriété exactes.
- Ne PAS halluciner de zones si l'image ne le permet pas clairement : dans le doute,
  indique "insuffisante" plutôt que d'inventer un contour. Zéro zone est une réponse
  valide s'il n'y a visiblement aucun stationnement.
- Réponds uniquement selon le schéma JSON fourni, sans texte hors du JSON.
`.trim()

const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    nombre_zones_detectees: { type: 'INTEGER' },
    zones: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          bounding_box: {
            type: 'ARRAY',
            items: { type: 'NUMBER' },
            description: '[ymin, xmin, ymax, xmax] normalisé 0-1000',
          },
        },
        required: ['bounding_box'],
      },
    },
    qualite_image: { type: 'STRING', enum: ['bonne', 'moyenne', 'insuffisante'] },
    raison_qualite: { type: 'STRING', nullable: true },
  },
  required: ['nombre_zones_detectees', 'zones', 'qualite_image'],
} as const

const satelliteAnalysisSchema = z.object({
  nombre_zones_detectees: z.number().int().min(0),
  zones: z.array(z.object({ bounding_box: z.tuple([z.number(), z.number(), z.number(), z.number()]) })),
  qualite_image: z.enum(['bonne', 'moyenne', 'insuffisante']),
  raison_qualite: z.string().nullable().optional(),
})

const requestSchema = z.object({ storagePath: z.string().min(1) })

// Requis pour tout appel depuis le navigateur (supabase-js envoie un préflight OPTIONS avec
// les headers Authorization/apikey/content-type) — sans ça, le navigateur bloque la réponse
// avant même qu'elle atteigne le code applicatif (échec silencieux côté client, "Failed to
// fetch"), peu importe que la fonction elle-même fonctionne correctement.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
  if (!geminiApiKey) {
    return jsonResponse({ error: 'GEMINI_API_KEY non configurée sur le projet Supabase.' }, 500)
  }

  let storagePath: string
  try {
    const body = await req.json()
    storagePath = requestSchema.parse(body).storagePath
  } catch {
    return jsonResponse({ error: 'Corps de requête invalide (storagePath requis).' }, 400)
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const { data: imageBlob, error: downloadError } = await supabase.storage
    .from('contract-captures')
    .download(storagePath)
  if (downloadError || !imageBlob) {
    return jsonResponse({ error: "Impossible de récupérer l'image satellite capturée." }, 404)
  }

  const imageBase64 = arrayBufferToBase64(await imageBlob.arrayBuffer())

  let rawText: string
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SATELLITE_ANALYSIS_SYSTEM_PROMPT }] },
          contents: [
            {
              role: 'user',
              parts: [
                { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } },
                { text: 'Analyse cette image satellite selon les instructions.' },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: GEMINI_RESPONSE_SCHEMA,
          },
        }),
      },
    )
    if (!response.ok) {
      return jsonResponse({ error: `Gemini API error: ${response.status}` }, 502)
    }
    const data = await response.json()
    rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) return jsonResponse({ error: 'Réponse Gemini vide ou mal formée.' }, 502)
  } catch {
    return jsonResponse({ error: "Échec de l'appel à Gemini." }, 502)
  }

  try {
    const parsed = satelliteAnalysisSchema.parse(JSON.parse(rawText))
    return jsonResponse(parsed, 200)
  } catch {
    return jsonResponse({ error: 'Réponse Gemini hors-schéma.' }, 502)
  }
})

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}
