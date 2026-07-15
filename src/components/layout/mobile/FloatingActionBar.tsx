import { Loader2 } from 'lucide-react'
import type { WizardFooterAction } from '../WizardFooter'

type FloatingActionBarProps = {
  onBack?: () => void
  isLastStep: boolean
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
  action?: WizardFooterAction | null
  onDraft?: () => void
  draftDisabled?: boolean
  onCreate?: () => void
  createDisabled?: boolean
  isSubmitting?: boolean
}

// Boutons dédiés (pas le composant `Button` partagé, dont le h-11 desktop resterait
// prioritaire sur un simple className surchargé, ce projet n'utilisant pas
// tailwind-merge) — cibles tactiles 48px codées en dur, réservées à ce composant
// mobile-only, sans toucher `Button.tsx` (Desktop/Tablette inchangés).
const PRIMARY = 'h-12 flex-1 rounded-control bg-reca-red px-4 text-body font-medium text-white disabled:bg-reca-red/60'
const SECONDARY =
  'h-12 rounded-control border border-reca-gray-light bg-white px-4 text-body font-medium text-reca-black disabled:opacity-50'

/**
 * Barre d'action flottante mobile — analogue de `WizardFooter.tsx` (desktop, inchangé),
 * mêmes props sans `onCancel` (le retour natif est porté par le bouton retour du
 * `MobileHeader`, pas un bouton persistant ici). Réutilise le type `WizardFooterAction`
 * importé (pas redéfini) pour garder le contrat d'action en phase avec le desktop.
 *
 * sprint014 : "Brouillon" (`onDraft`) est désormais rendu sur **chaque étape** (pas
 * seulement la dernière) — pas de barre de header dédiée côté mobile (contrairement au
 * Desktop, cf. `WizardLayout.headerActions`), décision de portée pragmatique : aucune
 * maquette mobile ne montre le Wizard, donc pas de contrainte visuelle à respecter ici.
 */
export function FloatingActionBar({
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
}: FloatingActionBarProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-t border-reca-gray-light bg-white px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      {onBack && (
        <button type="button" className={SECONDARY} onClick={onBack}>
          Retour
        </button>
      )}
      {action && (
        <button
          type="button"
          className={`${SECONDARY} inline-flex items-center gap-2`}
          onClick={action.onClick}
          disabled={action.disabled || action.isLoading}
        >
          {action.isLoading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            action.icon && <action.icon className="size-4" aria-hidden="true" />
          )}
          {action.label}
        </button>
      )}
      {onDraft && (
        <button type="button" className={SECONDARY} disabled={draftDisabled || isSubmitting} onClick={onDraft}>
          Brouillon
        </button>
      )}
      {isLastStep ? (
        <button type="button" className={PRIMARY} disabled={createDisabled || isSubmitting} onClick={onCreate}>
          {isSubmitting && <Loader2 className="mr-2 inline size-4 animate-spin" aria-hidden="true" />}
          Créer
        </button>
      ) : (
        <button type="button" className={PRIMARY} disabled={nextDisabled} onClick={onNext}>
          {nextLabel}
        </button>
      )}
    </div>
  )
}
