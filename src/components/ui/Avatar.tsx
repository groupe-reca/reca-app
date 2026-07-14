type AvatarSize = 'sm' | 'md' | 'lg'

type AvatarProps = {
  name?: string
  src?: string
  size?: AvatarSize
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

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-reca-gray-light font-semibold text-reca-black ${SIZE_CLASSES[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name ?? ''} className="size-full object-cover" />
      ) : (
        name && getInitials(name)
      )}
    </span>
  )
}
