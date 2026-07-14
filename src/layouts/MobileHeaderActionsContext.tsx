import { useState } from 'react'
import type { ReactNode } from 'react'
import { MobileHeaderActionsContext as Context } from './useMobileHeaderActions'

/** Fournisseur monté une fois par `MobileAppShell`, autour du Header+`<Outlet/>`. */
export function MobileHeaderActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ReactNode>(null)
  return <Context.Provider value={{ actions, setActions }}>{children}</Context.Provider>
}
