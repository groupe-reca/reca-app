import type { ReactNode } from 'react'

type StickyPageHeaderProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function StickyPageHeader({ title, subtitle, actions }: StickyPageHeaderProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-section font-semibold text-reca-black">{title}</h1>
        {subtitle && <p className="text-body text-reca-gray-medium">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
