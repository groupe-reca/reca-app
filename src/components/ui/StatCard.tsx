import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from './Card'
import { STATUS_BG_CLASSES, STATUS_TEXT_CLASSES } from './statusColors'
import type { StatusColor } from './statusColors'

type StatCardDelta = {
  label: string
  tone?: 'positive' | 'negative' | 'neutral'
}

type StatCardProps = {
  icon: LucideIcon
  iconColor?: StatusColor
  value: ReactNode
  label: string
  delta?: StatCardDelta
  className?: string
  /** Format réduit (icône + nombre seulement, sans libellé) — pour les rangées de stats visibles en mobile (Contrats, Routes). Défaut `false`, aucun effet sur les autres usages. */
  compact?: boolean
}

const DELTA_TONE_CLASSES: Record<NonNullable<StatCardDelta['tone']>, string> = {
  positive: 'text-reca-success',
  negative: 'text-reca-red',
  neutral: 'text-reca-gray-medium',
}

export function StatCard({
  icon: Icon,
  iconColor = 'blue',
  value,
  label,
  delta,
  className = '',
  compact = false,
}: StatCardProps) {
  if (compact) {
    return (
      <Card padding="sm" className={`flex items-center gap-2 ${className}`} aria-label={`${label} : ${value}`}>
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-control ${STATUS_BG_CLASSES[iconColor]}`}
          aria-hidden="true"
        >
          <Icon className={`size-4 ${STATUS_TEXT_CLASSES[iconColor]}`} aria-hidden="true" />
        </span>
        <p className="truncate text-body font-semibold text-reca-black">{value}</p>
      </Card>
    )
  }

  return (
    <Card className={`flex flex-col gap-3 ${className}`}>
      <span
        className={`flex size-11 items-center justify-center rounded-control ${STATUS_BG_CLASSES[iconColor]}`}
      >
        <Icon className={`size-5 ${STATUS_TEXT_CLASSES[iconColor]}`} aria-hidden="true" />
      </span>
      <div>
        <p className="text-h1 font-semibold text-reca-black">{value}</p>
        <p className="text-label text-reca-gray-medium">{label}</p>
      </div>
      {delta && (
        <p className={`text-label font-medium ${DELTA_TONE_CLASSES[delta.tone ?? 'neutral']}`}>
          {delta.label}
        </p>
      )}
    </Card>
  )
}
