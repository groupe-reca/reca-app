import type { ReactNode } from 'react'
import { ModuleContainer } from './ModuleContainer'
import { WizardProgress } from './WizardProgress'
import type { WizardStep } from './WizardProgress'

type WizardLayoutProps = {
  steps: WizardStep[]
  onStepClick?: (id: string) => void
  footer: ReactNode
  children: ReactNode
}

/**
 * Layout Wizard : la barre de progression est le premier élément visible (pas de titre de
 * page — redondant avec le Breadcrumb, l'utilisateur est déjà dans le Wizard), suivie du
 * contenu (scrollable localement si une étape en a besoin) puis le footer, fixes.
 */
export function WizardLayout({ steps, onStepClick, footer, children }: WizardLayoutProps) {
  return (
    <ModuleContainer>
      <WizardProgress steps={steps} onStepClick={onStepClick} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">{children}</div>
      {footer}
    </ModuleContainer>
  )
}
