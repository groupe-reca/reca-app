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
  /** Tâche 6 : le prix saisi par contrat est-il avant ou après taxes ? */
  prixTaxes: PrixTaxesMode
}

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
  prixTaxes: 'avant_taxes',
}
