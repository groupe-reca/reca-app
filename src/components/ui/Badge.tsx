import type { ReactNode } from 'react'
import { STATUS_BG_CLASSES, STATUS_TEXT_CLASSES } from './statusColors'
import type { StatusColor } from './statusColors'

export type BadgeColor = StatusColor
export type BadgeSize = 'sm' | 'md'

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-label',
}

type BadgeProps = {
  color?: BadgeColor
  size?: BadgeSize
  children: ReactNode
}

export function Badge({ color = 'gray', size = 'md', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${STATUS_BG_CLASSES[color]} ${STATUS_TEXT_CLASSES[color]} ${SIZE_CLASSES[size]}`}
    >
      {children}
    </span>
  )
}
