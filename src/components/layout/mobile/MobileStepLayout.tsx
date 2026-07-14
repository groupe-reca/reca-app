import type { ReactNode } from 'react'

type MobileStepLayoutProps = {
  /** 0-based. */
  stepIndex: number
  totalSteps: number
  children: ReactNode
}

/**
 * Indicateur d'étape compact mobile ("Étape 2/6" + barre de progression fine) —
 * remplace `WizardProgress.tsx` (desktop, inchangé) pour le Wizard plein écran mobile.
 * Contrairement à `WizardProgress`, pas de clic pour revenir en arrière (convention
 * assistant natif : uniquement avancer/reculer via la barre d'action).
 */
export function MobileStepLayout({ stepIndex, totalSteps, children }: MobileStepLayoutProps) {
  const percent = ((stepIndex + 1) / totalSteps) * 100

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 px-4 pt-3">
        <p className="text-label text-reca-gray-medium">
          Étape {stepIndex + 1}/{totalSteps}
        </p>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-reca-gray-light">
          <div
            className="h-full rounded-full bg-reca-red transition-[width] duration-200 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
    </div>
  )
}
