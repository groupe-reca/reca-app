import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type TooltipProps = {
  label: string
  children: ReactNode
}

export function Tooltip({ label, children }: TooltipProps) {
  const [tapOpen, setTapOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!tapOpen) return
    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setTapOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setTapOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [tapOpen])

  return (
    <span
      ref={ref}
      className="group relative inline-flex"
      onClick={() => setTapOpen((value) => !value)}
    >
      {children}
      <span
        className={`pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-control bg-reca-black px-2.5 py-1.5 text-label text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 ${
          tapOpen ? 'opacity-100' : ''
        }`}
      >
        {label}
      </span>
    </span>
  )
}
