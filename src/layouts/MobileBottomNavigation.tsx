import { useState } from 'react'
import { FileSignature, LayoutDashboard, LogOut, Menu as MenuIcon, Receipt, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useSession } from '@/features/auth/hooks/useSession'
import { SETTINGS_ITEM, useVisibleNavItems } from './navItems'

const PRIMARY_ITEMS: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Accueil', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Contrats', to: '/contracts', icon: FileSignature },
  { label: 'Clients', to: '/clients', icon: Users },
  { label: 'Factures', to: '/invoices', icon: Receipt },
]
const PRIMARY_PATHS = new Set(PRIMARY_ITEMS.map((item) => item.to))

/**
 * Bottom Navigation (sprint012) — remplace le tiroir `Sidebar` sur mobile (<768px).
 * Conventions iOS/Android : fixe, toujours visible (sauf masquage déclaratif via
 * `handle.hideMobileNav`, voir `MobileAppShell.tsx`), cibles ≥48px, icône+libellé.
 * "Menu" ouvre un `BottomSheet` listant les modules restants (même donnée que
 * `Sidebar.tsx`, via `navItems.ts` partagé) + le bloc compte/déconnexion.
 */
export function MobileBottomNavigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { items } = useVisibleNavItems()
  const { data: session } = useSession()
  const logout = useLogout()
  const moreItems = items.filter((item) => !PRIMARY_PATHS.has(item.to))

  return (
    <>
      <nav
        className="flex h-16 shrink-0 items-stretch border-t border-reca-gray-light bg-reca-white pb-[env(safe-area-inset-bottom)]"
        aria-label="Navigation principale"
      >
        {PRIMARY_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-label ${
                isActive ? 'text-reca-red' : 'text-reca-gray-medium'
              }`
            }
          >
            <item.icon className="size-5" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-label text-reca-gray-medium"
        >
          <MenuIcon className="size-5" aria-hidden="true" />
          <span>Menu</span>
        </button>
      </nav>

      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)} snapPoints={['half', 'full']} title="Menu">
        <div className="flex flex-col gap-1 pb-4">
          {moreItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex h-12 items-center gap-3 rounded-control px-3 text-body ${
                  isActive ? 'bg-reca-snow font-medium text-reca-black' : 'text-reca-black hover:bg-reca-snow'
                }`
              }
            >
              <item.icon className="size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
          {session?.user.role === 'administrateur' && (
            <NavLink
              to={SETTINGS_ITEM.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex h-12 items-center gap-3 rounded-control px-3 text-body ${
                  isActive ? 'bg-reca-snow font-medium text-reca-black' : 'text-reca-black hover:bg-reca-snow'
                }`
              }
            >
              <SETTINGS_ITEM.icon className="size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
              {SETTINGS_ITEM.label}
            </NavLink>
          )}
          {session && (
            <div className="mt-2 flex items-center gap-2 rounded-control border-t border-reca-gray-light px-3 pt-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-reca-gray-light text-label font-semibold text-reca-black">
                {(session.user.nom ?? session.user.email).slice(0, 1).toUpperCase()}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-label font-medium text-reca-black">
                  {session.user.nom ?? session.user.email}
                </span>
                <span className="text-label capitalize text-reca-gray-medium">{session.user.role}</span>
              </div>
              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                aria-label="Déconnexion"
                className="flex size-12 shrink-0 items-center justify-center rounded-control text-reca-gray-medium hover:bg-reca-snow disabled:opacity-50"
              >
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </BottomSheet>
    </>
  )
}
