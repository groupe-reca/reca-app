import { ChevronRight } from 'lucide-react'
import type { HTMLAttributes } from 'react'

type CardVariant = 'default' | 'clickable'
type CardPadding = 'xs' | 'sm' | 'md'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant
  chevron?: boolean
  padding?: CardPadding
}

const PADDING_CLASSES: Record<CardPadding, string> = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-6',
}

export function Card({
  variant = 'default',
  chevron = false,
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  const isClickable = variant === 'clickable'

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`rounded-card bg-reca-white ${PADDING_CLASSES[padding]} shadow-card transition-shadow duration-150 ${
        isClickable ? 'cursor-pointer hover:shadow-floating active:shadow-card' : ''
      } ${chevron ? 'flex items-center justify-between gap-4' : ''} ${className}`}
      {...props}
    >
      {chevron ? (
        <>
          <div className="min-w-0 flex-1">{children}</div>
          <ChevronRight className="size-5 shrink-0 text-reca-gray-medium" aria-hidden="true" />
        </>
      ) : (
        children
      )}
    </div>
  )
}
