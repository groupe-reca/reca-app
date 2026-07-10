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
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'
import logo from '@/assets/logo.jpg'
import { useSession } from '@/features/auth/hooks/useSession'

type NavItemConfig = {
  label: string
  to: string
  icon: LucideIcon
  enabled: boolean
}

const NAV_ITEMS: NavItemConfig[] = [
  { label: 'Centre des opérations', to: '/dashboard', icon: LayoutDashboard, enabled: true },
  { label: 'Leads', to: '/leads', icon: UserPlus, enabled: true },
  { label: 'Soumissions', to: '/quotes', icon: FileText, enabled: false },
  { label: 'Clients', to: '/clients', icon: Users, enabled: false },
  { label: 'Contrats', to: '/contracts', icon: FileSignature, enabled: false },
  { label: 'Factures', to: '/invoices', icon: Receipt, enabled: false },
  { label: 'Paiements', to: '/payments', icon: CreditCard, enabled: false },
  { label: 'Routes', to: '/routes', icon: RouteIcon, enabled: false },
  { label: 'Équipements', to: '/equipment', icon: Truck, enabled: false },
  { label: 'Employés', to: '/employees', icon: UserCog, enabled: false },
]

const SETTINGS_ITEM: NavItemConfig = { label: 'Paramètres', to: '/settings', icon: Settings, enabled: false }

export function Sidebar() {
  const { data: session } = useSession()

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-reca-gray-light bg-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <img src={logo} alt="Groupe RECA" className="h-8 w-auto object-contain" />
        <span className="text-subtitle font-semibold text-reca-black">Centre des opérations</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.to} item={item} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-reca-gray-light px-3 py-4">
        <SidebarNavItem item={SETTINGS_ITEM} />
        {session && (
          <div className="mt-2 flex items-center gap-2 rounded-control px-3 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-reca-gray-light text-label font-semibold text-reca-black">
              {session.user.email.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-label font-medium text-reca-black">{session.user.email}</span>
              <span className="text-label capitalize text-reca-gray-medium">{session.user.role}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

function SidebarNavItem({ item }: { item: NavItemConfig }) {
  const { label, to, icon: Icon, enabled } = item

  if (!enabled) {
    return (
      <div
        aria-disabled="true"
        className="flex items-center gap-3 rounded-control px-3 py-2.5 text-body text-reca-gray-medium/50"
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">{label}</span>
        <span className="text-label text-reca-gray-medium/50">Bientôt</span>
      </div>
    )
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-control px-3 py-2.5 text-body transition-colors duration-200 ${
          isActive ? 'bg-reca-red/10 font-medium text-reca-red' : 'text-reca-black hover:bg-reca-gray-light'
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
