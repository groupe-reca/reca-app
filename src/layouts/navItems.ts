import { useMemo } from 'react'
import {
  ClipboardList,
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
import { useSettings } from '@/features/settings/hooks/useSettings'
import type { ModuleKey } from '@/features/settings/types/settings.types'

export type NavItemConfig = {
  label: string
  to: string
  icon: LucideIcon
  moduleKey?: ModuleKey
}

/**
 * Donnée/logique de navigation partagée entre `Sidebar.tsx` (tiroir desktop/tablette)
 * et le menu mobile ("Menu" de `MobileBottomNavigation.tsx`) — pure donnée, pas de
 * JSX, donc son partage ne viole pas la règle "aucun composant Desktop ne contient de
 * logique mobile" (aucun des deux ne dépend de l'autre).
 */
export const NAV_ITEMS: NavItemConfig[] = [
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
  { label: 'Missions', to: '/missions', icon: ClipboardList, moduleKey: 'missions' },
]

export const SETTINGS_ITEM: NavItemConfig = { label: 'Paramètres', to: '/settings', icon: Settings }

/** Filtre `NAV_ITEMS` selon les modules activés (`settings.modules`) — même logique que l'ancien `Sidebar.tsx` inline. */
export function useVisibleNavItems(): { items: NavItemConfig[]; isLoading: boolean } {
  const { data: settings, isLoading } = useSettings()

  const items = useMemo(
    () =>
      NAV_ITEMS.filter((item) => {
        if (!item.moduleKey) return true
        if (isLoading || !settings) return false
        return settings.modules[item.moduleKey]
      }),
    [settings, isLoading],
  )

  return { items, isLoading }
}
