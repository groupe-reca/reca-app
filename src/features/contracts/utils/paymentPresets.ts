import type { PaymentScheduleEntryFormValues } from '../schemas/contractCreation.schema'

export type PaymentPresetId = 'annuel' | 'deux_versements' | 'mensuel'

export const PAYMENT_PRESET_LABELS: Record<PaymentPresetId, string> = {
  annuel: 'Paiement annuel',
  deux_versements: 'Deux versements',
  mensuel: 'Mensuel',
}

function addMonths(dateStr: string, months: number): string {
  const date = new Date(`${dateStr}T00:00:00`)
  date.setMonth(date.getMonth() + months)
  return date.toISOString().slice(0, 10)
}

function countMonthsInclusive(dateDebut: string, dateFin: string): number {
  const start = new Date(`${dateDebut}T00:00:00`)
  const end = new Date(`${dateFin}T00:00:00`)
  return Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1)
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
    case 'mensuel': {
      if (!dateDebut) return []
      const months = 5
      const valeur = (100 / months).toFixed(2)
      return Array.from({ length: months }, (_, index) => ({
        description: `Versement ${index + 1}/${months}`,
        type: 'pourcentage' as const,
        valeur,
        dateEcheance: addMonths(dateDebut, index),
      }))
    }
    default:
      return []
  }
}

/** Variante utilisée quand une date de fin de saison est connue, pour un mensuel réparti sur la durée réelle. */
export function buildMonthlySchedule(dateDebut: string, dateFin: string): PaymentScheduleEntryFormValues[] {
  if (!dateDebut || !dateFin) return buildPaymentSchedule('mensuel', dateDebut)
  const months = countMonthsInclusive(dateDebut, dateFin)
  const valeur = (100 / months).toFixed(2)
  return Array.from({ length: months }, (_, index) => ({
    description: `Versement ${index + 1}/${months}`,
    type: 'pourcentage' as const,
    valeur,
    dateEcheance: addMonths(dateDebut, index),
  }))
}
