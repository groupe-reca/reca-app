import type { ServiceCode, ZoneType } from '../types/contract.types'

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
