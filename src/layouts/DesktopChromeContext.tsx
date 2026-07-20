import { useState } from 'react'
import type { ReactNode } from 'react'
import { DesktopChromeContext as Context } from './useDesktopChrome'

/** Fournisseur monté une fois par `DesktopAppShell`, autour du Breadcrumb+`<main>`. */
export function DesktopChromeProvider({ children }: { children: ReactNode }) {
  const [immersive, setImmersive] = useState(false)
  return <Context.Provider value={{ immersive, setImmersive }}>{children}</Context.Provider>
}
