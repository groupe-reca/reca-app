// Edge Function — Détection automatique des surfaces à déneiger (Wizard Contrats,
// étape "Délimiter"). Analyse l'image satellite déjà capturée (Storage privé
// `contract-captures`) via Gemini (Flash ou Pro au choix, prompté comme un estimateur
// en déneigement) et renvoie, pour chaque surface asphaltée/bétonnée détectée
// (stationnement, entrée carrossable — jamais la maison, la pelouse, un trottoir
// public ou la rue), un contour (liste de points, un par coin) suggéré. Le type de
// zone créé côté client reste fixé à `'stationnement'` (voir
// `useDelineateState.ts`) — la détection Gemini est plus large que ce seul mot, mais
// l'app n'a qu'un type de zone auto-détectable pour l'instant (portée resserrée, voir
// `memory/memory.md`).
//
// Fournisseur/Modèle : choix exposé aux paramètres du Wizard Contrats
// (`ContractWizardDefaultsForm.tsx`, champs `aiProvider`/`aiModel`), transmis par le
// client dans le corps de la requête (défaut `'google'`/`'flash'` si absents).
//
// - Google (`aiProvider: 'google'`, `aiModel: 'flash'|'pro'`) : mappé vers un alias
//   Google (`GEMINI_MODEL_BY_OPTION`) plutôt qu'un nom de modèle figé
//   (`gemini-2.5-flash`, demandé initialement) — confirmé en test réel (2026-07-17,
//   curl direct sur l'API Gemini) que `gemini-2.5-flash` renvoie 404 "no longer
//   available to new users" malgré son apparition dans `models.list`. Utiliser les
//   alias `-latest` évite de revivre cette même panne à la prochaine dépréciation
//   (idem pour `gemini-pro-latest`, jamais testé directement faute de retour
//   utilisateur sur ce point — à surveiller au premier essai réel de l'option "Pro").
// - TokenRouter (`aiProvider: 'tokenrouter'`, tâche 2) : `aiModel` est l'identifiant
//   TokenRouter exact, transmis tel quel — pas de table d'alias, TokenRouter route
//   déjà lui-même vers le bon modèle sous-jacent. Authentification
//   `Authorization: Bearer` (secret `TOKENROUTER_API_KEY`) dans tous les cas. **2
//   styles d'API selon le préfixe du modèle** (`aiModel.startsWith('openai/')`,
//   testé dans le handler via `isOpenAiCompatible`) :
//   - `google/...` (ex. `google/gemini-3.5-flash`) : même forme de requête
//     `generateContent` que Google direct (miroir confirmé par test curl réel
//     2026-07-17). **Confirmé par test réel** : seul `google/gemini-3.5-flash`
//     accepte `responseSchema`/`responseMimeType: application/json` (JSON structuré
//     retourné correctement) — les 2 modèles `-image` (`gemini-3.1-flash-lite-image`,
//     `gemini-2.5-flash-image`) sont des modèles de génération d'image et rejettent
//     cette requête avec `400`. Restent proposés dans le sélecteur (demandés tels
//     quels par l'utilisateur), mais ne fonctionneront pas pour cette fonctionnalité
//     — voir `memory/memory.md`.
//   - Tout le reste (`openai/...`, `anthropic/...`) : endpoint OpenAI-compatible
//     `/v1/chat/completions` (`messages`/`response_format.json_schema`), forme de
//     requête ET de réponse différentes de Gemini — `buildOpenAiChatCompletionsBody`/
//     `OPENAI_RESPONSE_SCHEMA` dédiés, réponse dans `choices[0].message.content` (pas
//     `candidates[0].content.parts[0].text`). **Confirmé par test réel (curl,
//     2026-07-17)** avec le vrai prompt système + le schéma complet, sur une image
//     satellite réelle : JSON strictement conforme retourné, `gpt-5.4-mini` est
//     pleinement viable pour cette fonctionnalité (contrairement aux 2 modèles image
//     Gemini ci-dessus). **Tâche 17 (2026-07-18)** : `openai/gpt-5.2` (même style,
//     JSON propre) et `anthropic/claude-sonnet-5` (répond aussi via ce même endpoint
//     OpenAI-compatible, confirmé par test curl réel) ajoutés — Claude encadre
//     parfois sa réponse de balises markdown (```json ... ```) malgré `strict: true`,
//     d'où `stripMarkdownFence()` en filet de sécurité avant `JSON.parse`.
//     `google/gemini-3-flash-preview` (demandé mais testé et rejeté) renvoie une
//     structure incohérente d'un appel à l'autre (tantôt un objet, tantôt un tableau,
//     tantôt encadré de markdown) malgré une requête identique — trop peu fiable pour
//     être proposé, voir `memory/memory.md`.
//
// Tâche 17 : le texte du prompt système (`systemPrompt` dans le corps de la requête)
// est désormais éditable par un administrateur (`ContractWizardDefaults.aiPromptDetection`,
// `ContractWizardDefaultsForm.tsx`) — `SATELLITE_ANALYSIS_SYSTEM_PROMPT` ci-dessous ne
// sert plus que de valeur de repli si absent (réglages enregistrés avant cette tâche).
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
Tu es un estimateur en déneigement au Québec. Tu analyses une image satellite d'une
propriété résidentielle ou commerciale, dans le but de déterminer les surfaces que le
tracteur devra déneiger.

Ta tâche, dans l'ordre :
1. Repère d'abord, approximativement, les limites du terrain de la maison/du bâtiment
   situé au centre de l'image — ignore les propriétés voisines visibles sur les bords
   de l'image. Ce repérage ne sert qu'à savoir où chercher à l'étape suivante ; ne
   l'inclus PAS dans la réponse et ne cherche pas une précision cadastrale, une
   estimation visuelle suffit.
2. À l'intérieur de ce terrain repéré seulement, détecte uniquement les surfaces
   asphaltées ou bétonnées que le tracteur devra déneiger (stationnement, entrée
   carrossable). Exclus la maison/le bâtiment, les pelouses, les arbres, les trottoirs
   publics et la rue, ainsi que toute surface qui appartient visiblement à une
   propriété voisine.
3. Pour chaque surface détectée : place un point à chacun de ses coins réels, dans
   l'ordre en suivant le contour (peu importe le sens), pour retourner un polygone
   précis qui suit fidèlement les limites réelles de la surface asphaltée/bétonnée —
   elle n'est pas toujours carrée/rectangulaire (en L, en trapèze, coin coupé, etc.) :
   ne simplifie jamais en rectangle si la forme réelle est différente. Minimum 3
   points, un point par coin visible (pas de point inutile sur un côté droit).
4. Évalue la qualité de l'image pour cette tâche :
   - "insuffisante" si la zone est couverte de neige, floue, trop sombre, ou si la
     résolution ne permet pas de distinguer les contours.
   - "moyenne" si l'analyse est possible mais incertaine (ombres partielles, angle
     limite, résolution basse).
   - "bonne" sinon.
   Si "moyenne" ou "insuffisante", explique brièvement pourquoi dans raison_qualite.

Règles strictes :
- Ne PAS estimer de superficie en m² ou pi² — ce calcul est fait ailleurs à partir du
  tracé réel de l'utilisateur.
- Le repérage du terrain (étape 1) reste une estimation grossière servant uniquement de
  guide de recherche — le contour final retracé par l'utilisateur (étape 3) reste la
  seule source de vérité.
- Ne PAS halluciner de zones si l'image ne le permet pas clairement : dans le doute,
  indique "insuffisante" plutôt que d'inventer un contour. Zéro zone est une réponse
  valide s'il n'y a visiblement aucune surface à déneiger.
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
          contour: {
            type: 'ARRAY',
            items: {
              type: 'ARRAY',
              items: { type: 'NUMBER' },
              description: '[y, x] normalisé 0-1000',
            },
            description:
              "Liste ordonnée des points du contour du stationnement, un par coin réel (minimum 3), suivant sa forme exacte plutôt qu'un rectangle englobant.",
          },
        },
        required: ['contour'],
      },
    },
    qualite_image: { type: 'STRING', enum: ['bonne', 'moyenne', 'insuffisante'] },
    raison_qualite: { type: 'STRING', nullable: true },
  },
  required: ['nombre_zones_detectees', 'zones', 'qualite_image'],
} as const

/**
 * Équivalent JSON Schema standard de `GEMINI_RESPONSE_SCHEMA`, pour le mode `strict`
 * d'OpenAI `response_format.json_schema` (tâche 3) — types en minuscules (pas
 * `OBJECT`/`STRING`...), `additionalProperties: false` sur chaque objet, et **tous**
 * les champs dans `required` (y compris les nullables, contrainte du mode strict :
 * `raison_qualite` est optionnel côté Zod mais doit être listé ici avec
 * `type: ['string','null']` plutôt qu'omis).
 */
const OPENAI_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    nombre_zones_detectees: { type: 'integer' },
    zones: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          contour: {
            type: 'array',
            items: { type: 'array', items: { type: 'number' } },
            description:
              "Liste ordonnée des points [y, x] du contour du stationnement, un par coin réel (minimum 3), suivant sa forme exacte plutôt qu'un rectangle englobant.",
          },
        },
        required: ['contour'],
        additionalProperties: false,
      },
    },
    qualite_image: { type: 'string', enum: ['bonne', 'moyenne', 'insuffisante'] },
    raison_qualite: { type: ['string', 'null'] },
  },
  required: ['nombre_zones_detectees', 'zones', 'qualite_image', 'raison_qualite'],
  additionalProperties: false,
} as const

const satelliteAnalysisSchema = z.object({
  nombre_zones_detectees: z.number().int().min(0),
  zones: z.array(
    z.object({
      contour: z.array(z.tuple([z.number(), z.number()])).min(3),
    }),
  ),
  qualite_image: z.enum(['bonne', 'moyenne', 'insuffisante']),
  raison_qualite: z.string().nullable().optional(),
})

const GEMINI_MODEL_BY_OPTION = {
  flash: 'gemini-flash-latest',
  pro: 'gemini-pro-latest',
} as const

const TOKENROUTER_API_BASE_URL = 'https://api.tokenrouter.com/v1beta/models'
const TOKENROUTER_OPENAI_CHAT_COMPLETIONS_URL = 'https://api.tokenrouter.com/v1/chat/completions'

const requestSchema = z.object({
  storagePath: z.string().min(1),
  aiProvider: z.enum(['google', 'tokenrouter']).optional(),
  aiModel: z.string().min(1).optional(),
  // Tâche 17 : texte de prompt configurable depuis les paramètres du Wizard
  // (`ContractWizardDefaults.aiPromptDetection`) — retombe sur le texte intégré
  // ci-dessus si absent (réglages enregistrés avant cette tâche).
  systemPrompt: z.string().min(1).optional(),
})

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

  let storagePath: string
  let aiProvider: 'google' | 'tokenrouter'
  let aiModel: string
  let systemPrompt: string
  try {
    const body = await req.json()
    const parsed = requestSchema.parse(body)
    storagePath = parsed.storagePath
    aiProvider = parsed.aiProvider ?? 'google'
    aiModel = parsed.aiModel ?? 'flash'
    systemPrompt = parsed.systemPrompt ?? SATELLITE_ANALYSIS_SYSTEM_PROMPT
  } catch {
    return jsonResponse({ error: 'Corps de requête invalide (storagePath requis).' }, 400)
  }

  // Tâche 17 : `google/...` passe par le mirroir natif Gemini (seul style supporté par
  // ces modèles chez TokenRouter, confirmé par leur catalogue `/v1/models` —
  // `supported_endpoint_types: ['gemini']`) ; tout le reste (`openai/...`,
  // `anthropic/...`, confirmé fonctionner via `/chat/completions` par test réel) passe
  // par l'endpoint OpenAI-compatible.
  const isOpenAiCompatible = aiProvider === 'tokenrouter' && !aiModel.startsWith('google/')

  let requestUrl: string
  let authHeaders: Record<string, string>
  if (aiProvider === 'tokenrouter') {
    const tokenRouterApiKey = Deno.env.get('TOKENROUTER_API_KEY')
    if (!tokenRouterApiKey) {
      return jsonResponse({ error: 'TOKENROUTER_API_KEY non configurée sur le projet Supabase.' }, 500)
    }
    requestUrl = isOpenAiCompatible
      ? TOKENROUTER_OPENAI_CHAT_COMPLETIONS_URL
      : `${TOKENROUTER_API_BASE_URL}/${aiModel}:generateContent`
    authHeaders = { Authorization: `Bearer ${tokenRouterApiKey}` }
  } else {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      return jsonResponse({ error: 'GEMINI_API_KEY non configurée sur le projet Supabase.' }, 500)
    }
    const geminiModel = GEMINI_MODEL_BY_OPTION[aiModel as keyof typeof GEMINI_MODEL_BY_OPTION] ?? GEMINI_MODEL_BY_OPTION.flash
    requestUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`
    authHeaders = {}
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
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(
        isOpenAiCompatible
          ? buildOpenAiChatCompletionsBody(aiModel, imageBase64, systemPrompt)
          : buildGenerateContentRequestBody(imageBase64, systemPrompt),
      ),
    })
    if (!response.ok) {
      return jsonResponse({ error: describeProviderError(aiProvider, response.status) }, 502)
    }
    const data = await response.json()
    rawText = isOpenAiCompatible
      ? data?.choices?.[0]?.message?.content
      : data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) return jsonResponse({ error: 'Réponse du fournisseur IA vide ou mal formée.' }, 502)
  } catch {
    return jsonResponse({ error: "Échec de l'appel au fournisseur IA." }, 502)
  }

  try {
    const parsed = satelliteAnalysisSchema.parse(JSON.parse(stripMarkdownFence(rawText)))
    return jsonResponse(parsed, 200)
  } catch {
    return jsonResponse({ error: 'Réponse du fournisseur IA hors-schéma.' }, 502)
  }
})

/**
 * Corps de requête `generateContent` — même forme pour Google et TokenRouter (API
 * documentée par TokenRouter comme un miroir de celle de Gemini), seuls l'URL et les
 * headers d'authentification diffèrent entre les deux fournisseurs (voir l'appelant).
 */
function buildGenerateContentRequestBody(imageBase64: string, systemPrompt: string) {
  return {
    system_instruction: { parts: [{ text: systemPrompt }] },
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
  }
}

/**
 * Corps de requête OpenAI `chat.completions` (tâche 3, TokenRouter modèles `openai/...`
 * uniquement) — forme différente de `buildGenerateContentRequestBody` (Gemini) :
 * prompt système via `role: 'system'` plutôt que `system_instruction`, image via
 * `image_url` en data URI plutôt que `inline_data`, JSON structuré via
 * `response_format.json_schema` (mode `strict`) plutôt que `generationConfig`.
 */
function buildOpenAiChatCompletionsBody(model: string, imageBase64: string, systemPrompt: string) {
  return {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyse cette image satellite selon les instructions.' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'satellite_analysis', schema: OPENAI_RESPONSE_SCHEMA, strict: true },
    },
    stream: false,
  }
}

/**
 * Message affiché à l'utilisateur (via le toast client) sur un échec de l'appel au
 * fournisseur IA — distingue les cas fréquents (quota/surcharge, tous deux constatés
 * en test réel le 2026-07-17 sur Flash ET Pro côté Google) d'un code d'erreur
 * générique, pour ne pas faire confondre un vrai bug de code avec une limite d'API
 * externe.
 */
function describeProviderError(aiProvider: 'google' | 'tokenrouter', status: number): string {
  const providerLabel = aiProvider === 'tokenrouter' ? 'TokenRouter' : 'Gemini'
  if (status === 429) return `Quota ${providerLabel} dépassé (limite de requêtes atteinte) — réessayez plus tard.`
  if (status === 503) return `Service ${providerLabel} temporairement surchargé — réessayez dans quelques instants.`
  return `${providerLabel} API error: ${status}`
}

/**
 * Certains modèles TokenRouter non-Gemini (confirmé sur `anthropic/claude-sonnet-5`,
 * de façon inconstante — parfois respecté, parfois non, malgré `response_format:
 * {type: 'json_schema', strict: true}`) encadrent leur JSON de balises markdown
 * (```json ... ```) au lieu de renvoyer le JSON brut. Filet de sécurité générique
 * pour tout le chemin OpenAI-compatible plutôt qu'un correctif propre à un modèle.
 */
function stripMarkdownFence(text: string): string {
  const match = text.trim().match(/^```(?:json)?\s*([\s\S]*?)\s*```$/)
  return match ? match[1] : text
}

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
