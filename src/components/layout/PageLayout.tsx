import type { ReactNode } from 'react'
import { ModuleContainer } from './ModuleContainer'
import { StickyPageHeader } from './StickyPageHeader'
import { PageTabs } from './PageTabs'
import type { PageTab } from './PageTabs'
import { StickyPageFooter } from './StickyPageFooter'

type PageLayoutProps = {
  title: string
  subtitle?: string
  headerActions?: ReactNode
  tabs?: PageTab[]
  activeTabId?: string
  onTabChange?: (id: string) => void
  footer?: ReactNode
  children: ReactNode
}

/**
 * Desktop-app-style page shell: fixed header + optional tabs + a single scrollable content
 * area + optional fixed footer. Compose ModuleContainer/StickyPageHeader/PageTabs/
 * StickyPageFooter directly instead when a page needs a layout PageLayout doesn't cover
 * (e.g. a detail page with no tabs).
 */
export function PageLayout({
  title,
  subtitle,
  headerActions,
  tabs,
  activeTabId,
  onTabChange,
  footer,
  children,
}: PageLayoutProps) {
  return (
    <ModuleContainer>
      <StickyPageHeader title={title} subtitle={subtitle} actions={headerActions} />
      {tabs && activeTabId !== undefined && onTabChange && (
        <PageTabs tabs={tabs} activeId={activeTabId} onChange={onTabChange} />
      )}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      {footer && <StickyPageFooter>{footer}</StickyPageFooter>}
    </ModuleContainer>
  )
}
