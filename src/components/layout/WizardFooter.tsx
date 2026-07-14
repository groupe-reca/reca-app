import { Loader2 } from 'lucide-react'
import type { ComponentType } from 'react'
import { Button } from '@/components/ui/Button'
import { StickyPageFooter } from './StickyPageFooter'

export type WizardFooterAction = {
  label: string
  icon?: ComponentType<{ className?: string }>
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
}

type WizardFooterProps = {
  onCancel: () => void
  onBack?: () => void
  isLastStep: boolean
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  /**
   * Action secondaire générique affichée entre Retour et Suivant (ex. "Capturer" pour
   * l'étape Analyse de la propriété) — volontairement agnostique du métier pour que tout
   * futur Wizard (Soumissions, Clients, Employés, Équipements) puisse la réutiliser telle
   * quelle sans modifier ce composant.
   */
  action?: WizardFooterAction | null
  onDraft?: () => void
  draftDisabled?: boolean
  onCreate?: () => void
  createDisabled?: boolean
  isSubmitting?: boolean
}

/**
 * Footer fixe du Wizard : Retour/Suivant sur les étapes intermédiaires, Brouillon/Créer
 * sur la dernière (Validation) — même barre, boutons différents, jamais les deux à la fois.
 */
export function WizardFooter({
  onCancel,
  onBack,
  isLastStep,
  onNext,
  nextLabel = 'Suivant',
  nextDisabled,
  action,
  onDraft,
  draftDisabled,
  onCreate,
  createDisabled,
  isSubmitting,
}: WizardFooterProps) {
  return (
    <StickyPageFooter>
      <Button type="button" variant="ghost" onClick={onCancel}>
        Annuler
      </Button>
      {onBack && (
        <Button type="button" variant="secondary" onClick={onBack}>
          Retour
        </Button>
      )}
      {action && (
        <Button
          type="button"
          variant="secondary"
          onClick={action.onClick}
          disabled={action.disabled || action.isLoading}
          isLoading={action.isLoading}
        >
          {action.icon && <action.icon className="size-4" aria-hidden="true" />}
          {action.label}
        </Button>
      )}
      {isLastStep ? (
        <>
          <Button type="button" variant="secondary" disabled={draftDisabled || isSubmitting} onClick={onDraft}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Enregistrer comme brouillon
          </Button>
          <Button type="button" disabled={createDisabled || isSubmitting} onClick={onCreate}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Créer
          </Button>
        </>
      ) : (
        <Button type="button" disabled={nextDisabled} onClick={onNext}>
          {nextLabel}
        </Button>
      )}
    </StickyPageFooter>
  )
}
