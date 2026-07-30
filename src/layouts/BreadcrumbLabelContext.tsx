import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { BreadcrumbLabelContext as Context } from './useBreadcrumbLabel'

/**
 * Fournisseur monté une fois par `AppLayout` — donc au-dessus des deux coquilles, pour
 * couvrir `Breadcrumb` (desktop) et `MobileHeader` (mobile) d'un seul montage.
 */
export function BreadcrumbLabelProvider({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState<string | null>(null)
  const value = useMemo(() => ({ label, setLabel }), [label])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
