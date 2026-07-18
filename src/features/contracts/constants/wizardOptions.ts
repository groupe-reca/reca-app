import type { DepotNeige, ModeConclusion, PrixTaxesMode, ServiceCode, ZoneType } from '../types/contract.types'
import type { AiModel, AiProvider } from '../types/contractWizardDefaults.types'

export const SERVICE_OPTIONS: { code: ServiceCode; label: string }[] = [
  { code: 'deneigement', label: 'Déneigement' },
  { code: 'epandage', label: 'Épandage' },
  { code: 'soufflage', label: 'Soufflage' },
  { code: 'escaliers', label: 'Escaliers' },
  { code: 'toiture', label: 'Toiture' },
  { code: 'autres', label: 'Autres' },
]

export const SEUIL_DECLENCHEMENT_OPTIONS = [2, 3, 5] as const

export const MODE_PAIEMENT_OPTIONS = [
  { value: 'carte', label: 'Carte de crédit' },
  { value: 'virement', label: 'Virement Interac' },
  { value: 'cheque', label: 'Chèque' },
  { value: 'comptant', label: 'Comptant' },
] as const

export const DEPOT_NEIGE_OPTIONS: { value: DepotNeige; label: string }[] = [
  { value: 'sur_terrain', label: 'Sur le terrain du client' },
  { value: 'bordure_rue', label: 'En bordure de rue' },
  { value: 'transport_hors_site', label: 'Transport hors site' },
]

export const MODE_CONCLUSION_OPTIONS: { value: ModeConclusion; label: string }[] = [
  { value: 'en_personne', label: 'En personne' },
  { value: 'a_distance', label: 'À distance (téléphone ou Internet)' },
  { value: 'itinerant', label: 'Itinérant (sollicitation au domicile du client)' },
]
export const MODE_CONCLUSION_LABELS: Record<ModeConclusion, string> = Object.fromEntries(
  MODE_CONCLUSION_OPTIONS.map((option) => [option.value, option.label]),
) as Record<ModeConclusion, string>

/** Tâche 6 — le prix saisi par contrat inclut-il déjà les taxes ? Pilote la facturation et la prévisualisation. */
export const PRIX_TAXES_OPTIONS: { value: PrixTaxesMode; label: string }[] = [
  { value: 'avant_taxes', label: 'Avant taxes' },
  { value: 'apres_taxes', label: 'Après taxes' },
]

/** Tâche 2 — fournisseur IA pour la détection automatique du stationnement (étape Délimiter). */
export const AI_PROVIDER_OPTIONS: { value: AiProvider; label: string }[] = [
  { value: 'google', label: 'Google' },
  { value: 'tokenrouter', label: 'TokenRouter' },
]

/**
 * Tâche 14 (Google) / tâche 2 (TokenRouter) — modèle pour la détection automatique du
 * stationnement (étape Délimiter), liste dépendante du fournisseur choisi
 * (`AI_PROVIDER_OPTIONS`). Le sélecteur "Modèle" de `ContractWizardDefaultsForm.tsx`
 * doit toujours piocher dans la liste correspondant au fournisseur actuellement
 * sélectionné, jamais dans une liste à plat.
 */
export const AI_MODEL_OPTIONS_BY_PROVIDER: Record<AiProvider, { value: AiModel; label: string }[]> = {
  google: [
    { value: 'flash', label: 'Gemini 2.5 Flash' },
    { value: 'pro', label: 'Gemini 2.5 Pro' },
  ],
  tokenrouter: [
    { value: 'google/gemini-3.1-flash-lite-image', label: 'Gemini 3.1 Flash Lite (Image)' },
    { value: 'google/gemini-2.5-flash-image', label: 'Gemini 2.5 Flash (Image)' },
    { value: 'google/gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
    { value: 'openai/gpt-5.4-mini', label: 'GPT-5.4 Mini' },
  ],
}

/**
 * Sous-étape Délimiter — type de zone (menu déroulant, "Autre" révèle un champ libre),
 * sprint009 : couleur sobre distincte par type, réutilisée à la fois pour le style
 * Mapbox GL Draw des polygones sur la carte et les swatches de la liste. Entrée/
 * Stationnement/Trottoir/Autre reprennent les tokens de couleur déjà en place
 * (`--color-reca-info/warning/success/gray-medium`), Escaliers/Aire de manœuvre/
 * Terrasse sont de nouvelles teintes sobres qui ne percutent pas le rouge RECA
 * (réservé au contour de propriété / actions primaires).
 */
export const ZONE_TYPE_OPTIONS: { code: ZoneType; label: string; color: string }[] = [
  { code: 'entree', label: 'Entrée', color: '#2563eb' },
  { code: 'stationnement', label: 'Stationnement', color: '#f59e0b' },
  { code: 'trottoir', label: 'Trottoir', color: '#16a34a' },
  { code: 'escaliers', label: 'Escaliers', color: '#7c3aed' },
  { code: 'aire_manoeuvre', label: 'Aire de manœuvre', color: '#0d9488' },
  { code: 'terrasse', label: 'Terrasse', color: '#a16207' },
  { code: 'autre', label: 'Autre', color: '#6b7280' },
]
export const ZONE_TYPE_AUTRE: ZoneType = 'autre'
export const ZONE_TYPE_COLORS: Record<ZoneType, string> = Object.fromEntries(
  ZONE_TYPE_OPTIONS.map((option) => [option.code, option.color]),
) as Record<ZoneType, string>
