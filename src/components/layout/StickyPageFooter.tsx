import type { ReactNode } from 'react'

type StickyPageFooterProps = {
  children: ReactNode
}

export function StickyPageFooter({ children }: StickyPageFooterProps) {
  return (
    <div className="flex shrink-0 justify-end gap-3 border-t border-reca-gray-light bg-reca-white px-4 py-4 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}
