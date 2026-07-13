import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StickyPageFooter } from './StickyPageFooter'

type WizardFooterProps = {
  onCancel: () => void
  onBack?: () => void
  isLastStep: boolean
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
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
