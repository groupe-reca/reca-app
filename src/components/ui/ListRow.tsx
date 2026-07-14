import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { STATUS_BG_CLASSES, STATUS_TEXT_CLASSES } from './statusColors'
import type { StatusColor } from './statusColors'

type ListRowProps = {
  icon?: LucideIcon
  iconColor?: StatusColor
  title: ReactNode
  subtitle?: ReactNode
  trailing?: ReactNode
  chevron?: boolean
  onClick?: () => void
  href?: string
  className?: string
}

export function ListRow({
  icon: Icon,
  iconColor = 'gray',
  title,
  subtitle,
  trailing,
  chevron = false,
  onClick,
  href,
  className = '',
}: ListRowProps) {
  const interactive = Boolean(onClick || href)
  const rowClassName = `flex w-full items-center gap-3 rounded-card bg-white p-4 text-left shadow-card transition-shadow duration-150 ${
    interactive ? 'cursor-pointer hover:shadow-floating active:shadow-card' : ''
  } ${className}`

  const content = (
    <>
      {Icon && (
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-control ${STATUS_BG_CLASSES[iconColor]}`}
        >
          <Icon className={`size-5 ${STATUS_TEXT_CLASSES[iconColor]}`} aria-hidden="true" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body font-medium text-reca-black">{title}</span>
        {subtitle && (
          <span className="block truncate text-label text-reca-gray-medium">{subtitle}</span>
        )}
      </span>
      {trailing && <span className="shrink-0 text-label font-medium">{trailing}</span>}
      {chevron && (
        <ChevronRight className="size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
      )}
    </>
  )

  if (href) {
    return (
      <Link to={href} className={rowClassName}>
        {content}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClassName}>
        {content}
      </button>
    )
  }

  return <div className={rowClassName}>{content}</div>
}
