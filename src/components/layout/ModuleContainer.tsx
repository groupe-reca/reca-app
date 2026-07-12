import type { ReactNode } from 'react'

type ModuleContainerProps = {
  children: ReactNode
}

/**
 * Fills the available height inside `<main>` exactly (no more, no less) so that a page
 * built from StickyPageHeader/PageTabs/StickyPageFooter never triggers page-level scroll —
 * only the content area between them scrolls.
 */
export function ModuleContainer({ children }: ModuleContainerProps) {
  return <div className="flex h-full min-h-0 flex-col">{children}</div>
}
