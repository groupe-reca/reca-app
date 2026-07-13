import type { ReactNode } from 'react'
import { ModuleContainer } from './ModuleContainer'
import { StickyPageHeader } from './StickyPageHeader'
import { WizardProgress } from './WizardProgress'
import type { WizardStep } from './WizardProgress'

type WizardLayoutProps = {
  title: string
  subtitle?: string
  steps: WizardStep[]
  onStepClick?: (id: string) => void
  footer: ReactNode
  children: ReactNode
}

/** Layout Wizard : header + barre de progression + contenu scrollable local + footer fixes. */
export function WizardLayout({ title, subtitle, steps, onStepClick, footer, children }: WizardLayoutProps) {
  return (
    <ModuleContainer>
      <StickyPageHeader title={title} subtitle={subtitle} />
      <WizardProgress steps={steps} onStepClick={onStepClick} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      {footer}
    </ModuleContainer>
  )
}
