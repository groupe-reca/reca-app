import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileSignature,
  FileText,
  LayoutDashboard,
  LogOut,
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
import logo from '@/assets/logo-sombre.svg'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useSession } from '@/features/auth/hooks/useSession'
import { useSettings } from '@/features/settings/hooks/useSettings'
import type { ModuleKey } from '@/features/settings/types/settings.types'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useElementSize } from '@/hooks/useElementSize'
import { useFocusTrap } from '@/hooks/useFocusTrap'

type NavItemConfig = {
  label: string
  to: string
  icon: LucideIcon
  moduleKey?: ModuleKey
}

const NAV_ITEMS: NavItemConfig[] = [
  { label: 'Centre des opérations', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Leads', to: '/leads', icon: UserPlus, moduleKey: 'leads' },
  { label: 'Soumissions', to: '/quotes', icon: FileText, moduleKey: 'quotes' },
  { label: 'Clients', to: '/clients', icon: Users, moduleKey: 'clients' },
  { label: 'Contrats', to: '/contracts', icon: FileSignature, moduleKey: 'contracts' },
  { label: 'Factures', to: '/invoices', icon: Receipt, moduleKey: 'invoices' },
  { label: 'Paiements', to: '/payments', icon: CreditCard, moduleKey: 'payments' },
  { label: 'Routes', to: '/routes', icon: RouteIcon, moduleKey: 'routes' },
  { label: 'Équipements', to: '/equipment', icon: Truck, moduleKey: 'equipment' },
  { label: 'Employés', to: '/employees', icon: UserCog, moduleKey: 'employees' },
]

const SETTINGS_ITEM: NavItemConfig = { label: 'Paramètres', to: '/settings', icon: Settings }

const ITEM_HEIGHT = 44 // matches h-11 on SidebarNavItem
const ITEM_GAP = 4 // matches gap-1 on <nav>
const PAGER_HEIGHT = 40

type SidebarProps = {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { data: session } = useSession()
  const { data: settings, isLoading: isSettingsLoading } = useSettings()
  const logout = useLogout()
  const asideRef = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const { height: navHeight } = useElementSize(navRef)
  const [page, setPage] = useState(0)

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

  const visibleItems = useMemo(
    () =>
      NAV_ITEMS.filter((item) => {
        if (!item.moduleKey) return true
        if (isSettingsLoading || !settings) return false
        return settings.modules[item.moduleKey]
      }),
    [settings, isSettingsLoading],
  )

  const itemsPerPage = useMemo(() => {
    if (navHeight === 0) return visibleItems.length || 1
    const withoutPager = Math.max(1, Math.floor((navHeight + ITEM_GAP) / (ITEM_HEIGHT + ITEM_GAP)))
    if (visibleItems.length <= withoutPager) return withoutPager
    return Math.max(1, Math.floor((navHeight - PAGER_HEIGHT + ITEM_GAP) / (ITEM_HEIGHT + ITEM_GAP)))
  }, [navHeight, visibleItems.length])

  const totalPages = Math.max(1, Math.ceil(visibleItems.length / itemsPerPage))
  const currentPage = Math.min(page, totalPages - 1)
  const pageItems = visibleItems.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage)

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
          <img src={logo} alt="Groupe RECA" className="h-8 w-auto object-contain" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex size-11 shrink-0 items-center justify-center rounded-control text-reca-gray-light hover:bg-white/10 lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav ref={navRef} className="flex flex-1 flex-col gap-1 px-3">
          {pageItems.map((item) => (
            <SidebarNavItem key={item.to} item={item} onNavigate={onClose} />
          ))}
          {totalPages > 1 && (
            <div className="mt-auto flex items-center justify-between px-1 pt-2 text-reca-gray-light">
              <button
                type="button"
                onClick={() => setPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                aria-label="Page précédente"
                className="flex size-8 items-center justify-center rounded-control hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronUp className="size-4" aria-hidden="true" />
              </button>
              <span className="text-label">
                {currentPage + 1}/{totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                aria-label="Page suivante"
                className="flex size-8 items-center justify-center rounded-control hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronDown className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </nav>

        <div className="flex flex-col gap-1 border-t border-white/10 px-3 py-4">
          {session?.user.role === 'administrateur' && (
            <SidebarNavItem item={SETTINGS_ITEM} onNavigate={onClose} />
          )}
          {session && (
            <div className="mt-2 flex items-center gap-2 rounded-control px-3 py-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-label font-semibold text-white">
                {(session.user.nom ?? session.user.email).slice(0, 1).toUpperCase()}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-label font-medium text-white">
                  {session.user.nom ?? session.user.email}
                </span>
                <span className="text-label capitalize text-reca-gray-light">{session.user.role}</span>
              </div>
              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                aria-label="Déconnexion"
                className="flex size-9 shrink-0 items-center justify-center rounded-control text-reca-gray-light hover:bg-white/10 disabled:opacity-50"
              >
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

function SidebarNavItem({ item, onNavigate }: { item: NavItemConfig; onNavigate: () => void }) {
  const { label, to, icon: Icon } = item

  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `relative flex h-11 items-center gap-3 rounded-control px-3 text-body transition-colors duration-200 ${
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
