import { useEffect, useRef } from 'react'
import { LogOut, X } from 'lucide-react'
import { NavLink } from 'react-router'
import logo from '@/assets/logo-sombre.svg'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useSession } from '@/features/auth/hooks/useSession'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { SETTINGS_ITEM, useVisibleNavGroups } from './navItems'
import type { NavItemConfig } from './navItems'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

/**
 * Navigation principale : liste **exhaustive** et groupée par phase d'opération, avec scroll
 * natif si la hauteur ne suffit pas. Elle était auparavant paginée (contrôle `1/2`, décision
 * de la tâche « Optimisation de la navigation ») — ce qui plaçait jusqu'à 4 modules sur 11,
 * dont l'entrée du cycle de vente (Leads/Soumissions), derrière un clic non signifiant.
 * Une navigation principale doit être le seul élément exhaustif et stable de l'écran.
 */
export function Sidebar({ open, onClose }: SidebarProps) {
  const { data: session } = useSession()
  const logout = useLogout()
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

  const { ungrouped, groups } = useVisibleNavGroups()

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
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[280px] shrink-0 -translate-x-full flex-col overflow-hidden bg-reca-night-blue transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:transition-none ${
          open ? 'translate-x-0' : ''
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 px-6 py-6">
          <img src={logo} alt="Groupe RECA" className="h-12 w-auto object-contain" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="flex size-11 shrink-0 items-center justify-center rounded-control text-reca-gray-light hover:bg-white/10 lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3">
          {ungrouped.map((item) => (
            <SidebarNavItem key={item.to} item={item} onNavigate={onClose} />
          ))}
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-1">
              <span className="px-3 pb-1 pt-4 text-label font-semibold uppercase tracking-wide text-reca-gray-light/50">
                {group.label}
              </span>
              {group.items.map((item) => (
                <SidebarNavItem key={item.to} item={item} onNavigate={onClose} />
              ))}
            </div>
          ))}
        </nav>

        {/* Épinglé en bas, hors de la zone scrollable : jamais rogné, quelle que soit la hauteur. */}
        <div className="flex shrink-0 flex-col gap-1 border-t border-white/10 px-3 py-4">
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
