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

export type NavGroupId = 'ventes' | 'finances' | 'operations'

export type NavItemConfig = {
  label: string
  to: string
  icon: LucideIcon
  moduleKey?: ModuleKey
  /** Section de la sidebar. Absent = hors section, rendu en tête (Centre des opérations). */
  group?: NavGroupId
}

/**
 * Sections de la navigation principale, dans l'ordre du cycle de vie réel des opérations
 * (livrable 06 : Leads → … → Contrats → facturation → exécution terrain). Les intertitres
 * informent sur ce cycle, ils ne décorent pas — la casse haute est un traitement visuel
 * appliqué en CSS (`uppercase`), pas une donnée.
 */
export const NAV_GROUPS: { id: NavGroupId; label: string }[] = [
  { id: 'ventes', label: 'Ventes' },
  { id: 'finances', label: 'Finances' },
  { id: 'operations', label: 'Opérations' },
]

/**
 * Donnée/logique de navigation partagée entre `Sidebar.tsx` (tiroir desktop/tablette)
 * et le menu mobile ("Menu" de `MobileBottomNavigation.tsx`) — pure donnée, pas de
 * JSX, donc son partage ne viole pas la règle "aucun composant Desktop ne contient de
 * logique mobile" (aucun des deux ne dépend de l'autre).
 */
export const NAV_ITEMS: NavItemConfig[] = [
  { label: 'Centre des opérations', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Leads', to: '/leads', icon: UserPlus, moduleKey: 'leads', group: 'ventes' },
  { label: 'Soumissions', to: '/quotes', icon: FileText, moduleKey: 'quotes', group: 'ventes' },
  { label: 'Clients', to: '/clients', icon: Users, moduleKey: 'clients', group: 'ventes' },
  { label: 'Contrats', to: '/contracts', icon: FileSignature, moduleKey: 'contracts', group: 'ventes' },
  { label: 'Factures', to: '/invoices', icon: Receipt, moduleKey: 'invoices', group: 'finances' },
  { label: 'Paiements', to: '/payments', icon: CreditCard, moduleKey: 'payments', group: 'finances' },
  { label: 'Routes', to: '/routes', icon: RouteIcon, moduleKey: 'routes', group: 'operations' },
  { label: 'Équipements', to: '/equipment', icon: Truck, moduleKey: 'equipment', group: 'operations' },
  { label: 'Employés', to: '/employees', icon: UserCog, moduleKey: 'employees', group: 'operations' },
  // Missions n'apparaît pas dans l'arbre du brief (écrit avant ce module) — rattaché à
  // Opérations, sa place naturelle dans le cycle (exécution terrain).
  { label: 'Missions', to: '/missions', icon: ClipboardList, moduleKey: 'missions', group: 'operations' },
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

export type NavGroup = { id: NavGroupId; label: string; items: NavItemConfig[] }

/**
 * Même liste que `useVisibleNavItems` (source unique du filtrage par module activé), mais
 * découpée en sections pour la Sidebar. Un groupe dont tous les items sont masqués n'est pas
 * retourné — pas d'intertitre orphelin.
 *
 * `useVisibleNavItems` reste la forme plate, toujours consommée telle quelle par le menu
 * mobile (`MobileBottomNavigation.tsx`) : ce découpage est additif, pas un remplacement.
 */
export function useVisibleNavGroups(): {
  ungrouped: NavItemConfig[]
  groups: NavGroup[]
  isLoading: boolean
} {
  const { items, isLoading } = useVisibleNavItems()

  const { ungrouped, groups } = useMemo(() => {
    const withoutGroup = items.filter((item) => !item.group)
    const grouped = NAV_GROUPS.map((group) => ({
      ...group,
      items: items.filter((item) => item.group === group.id),
    })).filter((group) => group.items.length > 0)
    return { ungrouped: withoutGroup, groups: grouped }
  }, [items])

  return { ungrouped, groups, isLoading }
}
