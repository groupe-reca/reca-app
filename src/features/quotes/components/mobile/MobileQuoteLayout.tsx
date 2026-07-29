import type { ReactNode } from 'react'
import { useMobileHeaderActions } from '@/layouts/useMobileHeaderActions'

type MobileQuoteLayoutProps = {
  /** Injectées dans le Header compact (`MobileHeader`) via le contexte partagé — 0-2 boutons, ≥48px. */
  headerActions?: ReactNode
  children: ReactNode
}

/** Cadre de page mobile commun aux pages Quotes (liste) — câble `useMobileHeaderActions` une seule fois. */
export function MobileQuoteLayout({ headerActions, children }: MobileQuoteLayoutProps) {
  useMobileHeaderActions(headerActions ?? null)
  return <div className="flex flex-col gap-4 p-4">{children}</div>
}
