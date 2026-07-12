import { useEffect, useRef } from 'react'
import {
  CreditCard,
  FileSignature,
  FileText,
  LayoutDashboard,
  Receipt,
  Route as RouteIcon,
  Settings,
  Truck,
  UserCog,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'
import logo from '@/assets/logo.jpg'
import { useSession } from '@/features/auth/hooks/useSession'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useFocusTrap } from '@/hooks/useFocusTrap'

type NavItemConfig = {
  label: string
  to: string
  icon: LucideIcon
  enabled: boolean
}

const NAV_ITEMS: NavItemConfig[] = [
  { label: 'Centre des opérations', to: '/dashboard', icon: LayoutDashboard, enabled: true },
  { label: 'Leads', to: '/leads', icon: UserPlus, enabled: true },
  { label: 'Soumissions', to: '/quotes', icon: FileText, enabled: true },
  { label: 'Clients', to: '/clients', icon: Users, enabled: true },
  { label: 'Contrats', to: '/contracts', icon: FileSignature, enabled: true },
  { label: 'Factures', to: '/invoices', icon: Receipt, enabled: true },
  { label: 'Paiements', to: '/payments', icon: CreditCard, enabled: true },
  { label: 'Routes', to: '/routes', icon: RouteIcon, enabled: true },
  { label: 'Équipements', to: '/equipment', icon: Truck, enabled: true },
  { label: 'Employés', to: '/employees', icon: UserCog, enabled: true },
]

const SETTINGS_ITEM: NavItemConfig = { label: 'Paramètres', to: '/settings', icon: Settings, enabled: true }

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { data: session } = useSession()
  const asideRef = useRef<HTMLElement>(null)

  useBodyScrollLock(open)
  useFocusTrap(open, asideRef)

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-reca-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        ref={asideRef}
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[280px] shrink-0 -translate-x-full flex-col bg-reca-night-blue transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:transition-none ${
          open ? 'translate-x-0' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Groupe RECA" className="h-8 w-auto object-contain" />
            <span className="text-subtitle font-semibold text-white">Centre des opérations</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex size-11 shrink-0 items-center justify-center rounded-control text-reca-gray-light hover:bg-white/10 lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.to} item={item} onNavigate={onClose} />
          ))}
        </nav>

        <div className="flex flex-col gap-1 border-t border-white/10 px-3 py-4">
          {session?.user.role === 'administrateur' && (
            <SidebarNavItem item={SETTINGS_ITEM} onNavigate={onClose} />
          )}
          {session && (
            <div className="mt-2 flex items-center gap-2 rounded-control px-3 py-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-label font-semibold text-white">
                {session.user.email.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-label font-medium text-white">{session.user.email}</span>
                <span className="text-label capitalize text-reca-gray-light">{session.user.role}</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function SidebarNavItem({ item, onNavigate }: { item: NavItemConfig; onNavigate: () => void }) {
  const { label, to, icon: Icon, enabled } = item

  if (!enabled) {
    return (
      <div
        aria-disabled="true"
        className="flex items-center gap-3 rounded-control px-3 py-3 text-body text-reca-gray-light/40"
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">{label}</span>
        <span className="text-label text-reca-gray-light/40">Bientôt</span>
      </div>
    )
  }

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-control px-3 py-3 text-body transition-colors duration-200 ${
          isActive ? 'bg-white/10 font-medium text-white' : 'text-reca-gray-light hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-reca-red"
              aria-hidden="true"
            />
          )}
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}
