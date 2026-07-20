import type { DepotNeige, ModeConclusion, PrixTaxesMode, SeuilDeclenchementCm, ServiceCode } from './contract.types'

/**
 * Fournisseur IA utilisé par la détection automatique du stationnement (Wizard
 * Contrats, étape Délimiter) — tâche 2 (2026-07-17, nom de fichier réutilisé).
 */
export type AiProvider = 'google' | 'tokenrouter'

/**
 * Modèle utilisé par la détection automatique du stationnement. Pour Google, un
 * identifiant abstrait plutôt que le nom de modèle exact — l'Edge Function
 * `analyze-satellite-image` le mappe vers un alias `-latest` (`gemini-flash-latest`/
 * `gemini-pro-latest`), jamais un nom de modèle figé type `gemini-2.5-flash` (a déjà
 * renvoyé une 404 "no longer available to new users", voir `memory/memory.md`). Pour
 * TokenRouter, l'identifiant TokenRouter exact (transmis tel quel, pas d'alias).
 */
export type AiModel =
  | 'flash'
  | 'pro'
  | 'google/gemini-3.1-flash-lite-image'
  | 'google/gemini-2.5-flash-image'
  | 'google/gemini-3.5-flash'
  | 'openai/gpt-5.4-mini'
  | 'openai/gpt-5.2'

/**
 * Paramètres du Wizard Contrats qui sont "toujours les mêmes pour tout le
 * monde" (tâche 5) — configurés une fois par un administrateur plutôt que
 * saisis à chaque contrat. Stockés dans `settings.contract_wizard_defaults`
 * (jsonb), même pattern que `settings.modules`/`settings.taxes`.
 */
export type ContractWizardDefaults = {
  saison: string
  dateDebut: string
  dateFin: string
  /** Tâche 11 : date fixe du 2e versement pour l'échéancier "Bi-paiement", plus calculée à +3 mois. */
  dateDeuxiemeVersement: string
  serviceCodes: ServiceCode[]
  seuilDeclenchementCm: SeuilDeclenchementCm
  heurePremierPassage: string
  depotNeige: DepotNeige
  modeConclusion: ModeConclusion
  /** Tâche 2 : fournisseur IA pour la détection automatique du stationnement. */
  aiProvider: AiProvider
  /** Tâche 14 : modèle pour la détection automatique du stationnement. */
  aiModel: AiModel
  /**
   * Tâche 17 — texte du prompt système envoyé au fournisseur IA pour la détection
   * automatique (étape Délimiter), éditable par un administrateur. Valeur par défaut
   * = copie exacte du prompt intégré à l'Edge Function `analyze-satellite-image`
   * (`SATELLITE_ANALYSIS_SYSTEM_PROMPT`) — à garder synchronisé si ce texte par défaut
   * est retouché côté serveur. L'Edge Function retombe sur son propre texte intégré
   * si ce champ est absent (compatibilité des réglages déjà enregistrés avant cette
   * tâche), mais le client envoie toujours cette valeur une fois configurée.
   */
  aiPromptDetection: string
  /** Tâche 6 : le prix saisi par contrat est-il avant ou après taxes ? */
  prixTaxes: PrixTaxesMode
}

export const DEFAULT_AI_PROMPT_DETECTION = `Tu es un estimateur en déneigement au Québec. Tu analyses une image satellite d'une
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
- Réponds uniquement selon le schéma JSON fourni, sans texte hors du JSON.`

export const DEFAULT_CONTRACT_WIZARD_DEFAULTS: ContractWizardDefaults = {
  saison: '2026-2027',
  dateDebut: '2026-11-01',
  dateFin: '2027-05-01',
  dateDeuxiemeVersement: '2027-02-01',
  serviceCodes: ['deneigement'],
  seuilDeclenchementCm: 5,
  heurePremierPassage: '07:00',
  depotNeige: 'sur_terrain',
  modeConclusion: 'en_personne',
  aiProvider: 'google',
  aiModel: 'flash',
  aiPromptDetection: DEFAULT_AI_PROMPT_DETECTION,
  prixTaxes: 'avant_taxes',
}
