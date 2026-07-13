import { CheckCircle2, Circle, CircleDot } from 'lucide-react'

export type WizardStepStatus = 'todo' | 'current' | 'done'

export type WizardStep = {
  id: string
  label: string
  status: WizardStepStatus
}

type WizardProgressProps = {
  steps: WizardStep[]
  onStepClick?: (id: string) => void
}

const STATUS_ICON: Record<WizardStepStatus, typeof Circle> = {
  todo: Circle,
  current: CircleDot,
  done: CheckCircle2,
}

/**
 * Barre de progression horizontale d'un Wizard — présentationnelle uniquement (les statuts
 * ○/◐/✓ sont calculés par la page). `onStepClick` n'est appelé que pour les étapes déjà
 * complétées (navigation arrière) ; la page ignore les clics sur une étape à faire.
 */
export function WizardProgress({ steps, onStepClick }: WizardProgressProps) {
  return (
    <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-reca-gray-light px-4 py-3 sm:px-6 lg:px-8">
      {steps.map((step, index) => {
        const Icon = STATUS_ICON[step.status]
        const isClickable = step.status === 'done' && Boolean(onStepClick)
        return (
          <div key={step.id} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick?.(step.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-control px-2 py-1 text-label font-medium transition-colors ${
                step.status === 'current' ? 'text-reca-red' : step.status === 'done' ? 'text-reca-black' : 'text-reca-gray-medium'
              } ${isClickable ? 'cursor-pointer hover:bg-reca-gray-light' : 'cursor-default'}`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {step.label}
            </button>
            {index < steps.length - 1 && <span className="h-px w-6 shrink-0 bg-reca-gray-light" aria-hidden="true" />}
          </div>
        )
      })}
    </div>
  )
}
