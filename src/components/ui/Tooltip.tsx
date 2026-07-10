import type { ReactNode } from 'react'

type TooltipProps = {
  label: string
  children: ReactNode
}

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-control bg-reca-black px-2.5 py-1.5 text-label text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
    </span>
  )
}
