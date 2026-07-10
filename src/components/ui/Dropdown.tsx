import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type DropdownProps = {
  trigger: ReactNode
  children: ReactNode
}

export function Dropdown({ trigger, children }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-block">
      <span onClick={() => setOpen((value) => !value)}>{trigger}</span>
      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className="absolute right-0 z-10 mt-2 min-w-[180px] rounded-control border border-reca-gray-light bg-white p-1 shadow-lg"
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
      className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-left text-body text-reca-black hover:bg-reca-gray-light"
    >
      {children}
    </button>
  )
}
