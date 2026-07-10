import type { ReactNode } from 'react'

export type BadgeColor = 'gray' | 'red' | 'green' | 'orange' | 'blue'

const COLOR_CLASSES: Record<BadgeColor, string> = {
  gray: 'bg-reca-gray-light text-reca-gray-medium',
  red: 'bg-red-50 text-reca-red',
  green: 'bg-green-50 text-reca-success',
  orange: 'bg-orange-50 text-reca-warning',
  blue: 'bg-blue-50 text-reca-info',
}

type BadgeProps = {
  color?: BadgeColor
  children: ReactNode
}

export function Badge({ color = 'gray', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-label font-medium ${COLOR_CLASSES[color]}`}
    >
      {children}
    </span>
  )
}
