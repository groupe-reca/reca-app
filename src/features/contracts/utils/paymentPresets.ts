import type { PaymentScheduleEntryFormValues } from '../schemas/contractCreation.schema'

export type PaymentPresetId = 'annuel' | 'deux_versements'

export const PAYMENT_PRESET_LABELS: Record<PaymentPresetId, string> = {
  annuel: 'Paiement annuel',
  deux_versements: 'Deux versements',
}

function addMonths(dateStr: string, months: number): string {
  const date = new Date(`${dateStr}T00:00:00`)
  date.setMonth(date.getMonth() + months)
  return date.toISOString().slice(0, 10)
}

/** Génère l'échéancier `modalitesPaiement` pour un preset donné — remplace la saisie manuelle par défaut. */
export function buildPaymentSchedule(
  preset: PaymentPresetId,
  dateDebut: string,
): PaymentScheduleEntryFormValues[] {
  switch (preset) {
    case 'annuel':
      return [{ description: 'Paiement annuel', type: 'pourcentage', valeur: '100', dateEcheance: dateDebut }]
    case 'deux_versements':
      return [
        { description: 'Premier versement', type: 'pourcentage', valeur: '50', dateEcheance: dateDebut },
        {
          description: 'Second versement',
          type: 'pourcentage',
          valeur: '50',
          dateEcheance: dateDebut ? addMonths(dateDebut, 3) : '',
        },
      ]
    default:
      return []
  }
}
