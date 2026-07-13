import type { ServiceCode } from '../types/contract.types'

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
