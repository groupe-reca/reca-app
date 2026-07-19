import { STATUS_BG_CLASSES, STATUS_TEXT_CLASSES } from './statusColors'
import type { StatusColor } from './statusColors'

type AvatarSize = 'sm' | 'md' | 'lg'

type AvatarProps = {
  name?: string
  src?: string
  size?: AvatarSize
  color?: StatusColor
  className?: string
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-label',
  lg: 'size-14 text-subtitle',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '')
  return initials.join('') || '?'
}

export function Avatar({ name, src, size = 'md', color, className = '' }: AvatarProps) {
  const colorClasses = color ? `${STATUS_BG_CLASSES[color]} ${STATUS_TEXT_CLASSES[color]}` : 'bg-reca-gray-light text-reca-black'
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold ${colorClasses} ${SIZE_CLASSES[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name ?? ''} className="size-full object-cover" />
      ) : (
        name && getInitials(name)
      )}
    </span>
  )
}
