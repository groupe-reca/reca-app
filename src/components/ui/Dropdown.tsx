import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type DropdownProps = {
  trigger: ReactNode
  children: ReactNode
}

type Placement = { horizontal: 'left' | 'right'; vertical: 'top' | 'bottom' }

const DEFAULT_PLACEMENT: Placement = { horizontal: 'right', vertical: 'bottom' }

export function Dropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<Placement>(DEFAULT_PLACEMENT)
  const ref = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useLayoutEffect(() => {
    if (!open || !menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    setPlacement({
      horizontal: rect.right > window.innerWidth ? 'left' : 'right',
      vertical: rect.bottom > window.innerHeight ? 'top' : 'bottom',
    })
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <span
        onClick={() => {
          setPlacement(DEFAULT_PLACEMENT)
          setOpen((value) => !value)
        }}
      >
        {trigger}
      </span>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          onClick={() => setOpen(false)}
          className={`absolute z-10 min-w-[180px] rounded-control border border-reca-gray-light bg-white p-1 shadow-lg ${
            placement.horizontal === 'right' ? 'right-0' : 'left-0'
          } ${placement.vertical === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'}`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

type DropdownItemProps = {
  children: ReactNode
  onClick?: () => void
}

export function DropdownItem({ children, onClick }: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-control px-3 py-3 text-left text-body text-reca-black hover:bg-reca-gray-light"
    >
      {children}
    </button>
  )
}
