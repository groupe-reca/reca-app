import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { animate, useMotionValue, motion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useMobileFooterInset } from '@/components/layout/mobile/MobileFooterInsetContext'

export type SnapPoint = 'peek' | 'half' | 'full'

const SNAP_ORDER: SnapPoint[] = ['peek', 'half', 'full']
const SNAP_RATIOS: Record<SnapPoint, number> = { peek: 0.15, half: 0.5, full: 0.92 }
const FLICK_VELOCITY_THRESHOLD = 800

export type BottomSheetProps = {
  open: boolean
  /** Absent = la feuille ne peut pas être fermée entièrement (ex. liste des zones toujours présente). */
  onClose?: () => void
  snapPoints?: SnapPoint[]
  initialSnap?: SnapPoint
  title?: string
  children: ReactNode
  onSnapChange?: (snap: SnapPoint) => void
}

/**
 * Feuille du bas glissable/redimensionnable (façon Google Maps) — coexiste avec
 * `Modal.tsx` (ne le remplace pas) : `Modal` reste pour le transitoire/bloquant
 * (ex. `ZoneNamingModal`), `BottomSheet` sert le contenu persistant qui doit laisser
 * la carte/le contenu sous-jacent interactif (`peek`/`half` : pas de backdrop, pas de
 * piège de focus). Implémenté avec `motion` (déjà une dépendance) — `drag="y"` standard
 * sur toute la feuille (pas `useDragControls`+`dragListener=false` : ce pattern s'est
 * avéré peu fiable en test réel — un 2e glissement juste après un premier snap ne
 * déclenchait plus jamais `onDragEnd`, cause exacte non élucidée malgré investigation).
 * Le contenu scrollable interne arrête la propagation du pointerdown vers la feuille
 * (`onPointerDownCapture` + `stopPropagation`) pour ne jamais intercepter son scroll —
 * seule la poignée (zone non couverte par ce stop) déclenche réellement le glissement.
 */
export function BottomSheet({
  open,
  onClose,
  snapPoints = ['peek', 'half', 'full'],
  initialSnap,
  title,
  children,
  onSnapChange,
}: BottomSheetProps) {
  const orderedSnaps = SNAP_ORDER.filter((point) => snapPoints.includes(point))
  const defaultSnap = initialSnap ?? orderedSnaps[0]
  const [snap, setSnap] = useState<SnapPoint>(defaultSnap)
  const [viewportHeight, setViewportHeight] = useState(() => (typeof window === 'undefined' ? 0 : window.innerHeight))
  const y = useMotionValue(0)
  const sheetRef = useRef<HTMLDivElement>(null)
  // Hauteur du footer du Wizard mobile courant (0 hors d'un `MobileWizard`, ex. la
  // feuille "Menu") — la feuille est ancrée au-dessus de ce footer plutôt qu'au vrai
  // bas du viewport, sinon elle se positionne par-dessus la barre d'action flottante
  // (portail `fixed`, indépendant du flux normal où vit le footer).
  const footerInset = useMobileFooterInset()

  useBodyScrollLock(open)
  useFocusTrap(open && snap === 'full', sheetRef)

  useEffect(() => {
    function handleResize() {
      setViewportHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const usableHeight = Math.max(0, viewportHeight - footerInset)
  const sheetHeight = usableHeight * SNAP_RATIOS.full
  const offsetFor = (point: SnapPoint) => sheetHeight - usableHeight * SNAP_RATIOS[point]
  const minY = Math.min(...orderedSnaps.map(offsetFor))
  const maxY = Math.max(...orderedSnaps.map(offsetFor))

  function goToSnap(next: SnapPoint) {
    setSnap(next)
    onSnapChange?.(next)
    animate(y, offsetFor(next), { type: 'spring', stiffness: 420, damping: 42 })
  }

  useEffect(() => {
    if (!open || viewportHeight === 0) return
    y.set(offsetFor(defaultSnap))
    // setSnap() différé au tick suivant (règle eslint react-hooks/set-state-in-effect —
    // même pattern que le reste du repo pour un setState légitimement déclenché par un
    // événement externe, ici l'ouverture de la feuille, pas un simple clamp dérivé).
    queueMicrotask(() => setSnap(defaultSnap))
    // Ne se réinitialise qu'à l'ouverture (ou premier calcul de la hauteur de viewport/
    // inset du footer, ex. juste après le montage avant que le ResizeObserver du footer
    // n'ait mesuré sa hauteur réelle) — pas à chaque changement de snapPoints/defaultSnap
    // pour ne pas fermer un drag en cours.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, viewportHeight, footerInset])

  const handleDragEnd: NonNullable<HTMLMotionProps<'div'>['onDragEnd']> = (_event, info) => {
    const projected = y.get() + info.velocity.y * 0.2
    let closest = orderedSnaps[0]
    let closestDist = Infinity
    for (const point of orderedSnaps) {
      const dist = Math.abs(offsetFor(point) - projected)
      if (dist < closestDist) {
        closestDist = dist
        closest = point
      }
    }
    const peekOffset = offsetFor(orderedSnaps[0])
    const flickedPastPeek = info.velocity.y > FLICK_VELOCITY_THRESHOLD && y.get() > peekOffset - 10
    if (onClose && flickedPastPeek) {
      onClose()
      return
    }
    goToSnap(closest)
  }

  if (!open) return null

  return createPortal(
    <>
      {snap === 'full' && (
        <div className="fixed inset-0 z-40 bg-reca-black/40" onClick={() => onClose?.()} aria-hidden="true" />
      )}
      {/*
        Conteneur de clip : la feuille elle-même (motion.div ci-dessous) garde TOUJOURS
        sa hauteur "full" (92%) en DOM, seul un `transform: translateY` la déplace pour
        ne montrer que le snap courant (peek/half) — un `transform` ne clippe rien, donc
        sans ce conteneur `overflow:hidden` borné exactement à la zone visible, la partie
        "hors écran" de la feuille intercepte quand même les clics des éléments dessous
        (bug réel observé : le bouton "Capturer" du footer devenait inatteignable même
        quand la feuille semblait n'occuper visuellement qu'une petite bande en bas).
      */}
      <div
        className="pointer-events-none fixed inset-x-0 z-40 overflow-hidden"
        style={{ height: sheetHeight, bottom: footerInset }}
      >
        <motion.div
          ref={sheetRef}
          role="dialog"
          aria-modal={snap === 'full'}
          aria-label={title}
          drag="y"
          dragConstraints={{ top: minY, bottom: maxY }}
          dragElastic={0.04}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          style={{ y, height: sheetHeight }}
          className="pointer-events-auto absolute inset-x-0 top-0 flex flex-col rounded-t-modal bg-white shadow-[0_-2px_24px_rgba(0,0,0,0.12)]"
        >
          <div className="flex shrink-0 touch-none cursor-grab flex-col items-center gap-2 pb-1 pt-2.5 active:cursor-grabbing">
            <span className="h-1.5 w-10 rounded-full bg-reca-gray-light" aria-hidden="true" />
            {title && <h2 className="text-subtitle font-semibold text-reca-black">{title}</h2>}
          </div>
          <div
            onPointerDownCapture={(event) => event.stopPropagation()}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+16px)]"
          >
            {children}
          </div>
        </motion.div>
      </div>
    </>,
    document.body,
  )
}
