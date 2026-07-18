import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MobileFooterInsetContext } from './MobileFooterInsetContext'

type MobileWizardProps = {
  /** Change à chaque étape — déclenche la transition (`AnimatePresence` clé sur cette valeur). */
  activeKey: string
  /** +1 en avançant, -1 en reculant — détermine le sens du glissement. */
  direction: 1 | -1
  footer: ReactNode
  children: ReactNode
}

const VARIANTS = {
  enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0 }),
}

/**
 * Coquille du Wizard mobile plein écran — une étape à la fois, transition horizontale
 * (glisser, 200ms, cohérent avec la convention 150-250ms déjà en place pour `Modal`).
 * Remplace `WizardLayout.tsx` (desktop, inchangé) pour le Wizard Contrats mobile.
 * Mesure la hauteur réelle du footer (`ResizeObserver`) et la fournit via
 * `MobileFooterInsetContext` à ses `children` — nécessaire pour que tout `BottomSheet`
 * rendu par une étape (ex. Property, Phase D) laisse la place à la barre d'action
 * flottante au lieu de se positionner par-dessus (portail `fixed` ancré au vrai bas du
 * viewport, indépendant du flux normal où vit le footer).
 */
export function MobileWizard({ activeKey, direction, footer, children }: MobileWizardProps) {
  const footerRef = useRef<HTMLDivElement>(null)
  const [footerHeight, setFooterHeight] = useState(0)

  useEffect(() => {
    const node = footerRef.current
    if (!node) return
    const observer = new ResizeObserver(() => setFooterHeight(node.getBoundingClientRect().height))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden bg-reca-white">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <MobileFooterInsetContext.Provider value={footerHeight}>
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={activeKey}
              custom={direction}
              variants={VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </MobileFooterInsetContext.Provider>
      </div>
      <div ref={footerRef}>{footer}</div>
    </div>
  )
}
