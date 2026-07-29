import { Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { useDeviceTier } from '@/hooks/useDeviceTier'
import { useMobileHeaderActions } from '@/layouts/useMobileHeaderActions'
import { RoutesTabs } from '../components/RoutesTabs'

function tabIdFromPath(pathname: string): string {
  if (pathname.endsWith('/carte')) return 'carte'
  if (pathname.endsWith('/contrats')) return 'contrats'
  return 'routes'
}

/**
 * Enregistre l'action dans le Header compact mobile sans être elle-même le composant qui la
 * construit — nécessaire pour éviter une boucle infinie : `MobileHeaderActionsProvider` recrée
 * son `value` de contexte à chaque rendu, donc tout composant qui LIT le contexte (via ce hook)
 * ET reconstruit son propre nœud d'action à chaque rendu se redéclenche indéfiniment lui-même.
 * En isolant la lecture du contexte ici, `action` reste une prop stable reçue de `RoutesShellPage`
 * (qui ne lit jamais le contexte) — le rebond de contexte ne recrée jamais `action`, donc l'effet
 * ne se redéclenche pas. Même piège que documenté pour `WizardStepProperty`/`goNext` (voir
 * `memory/memory.md`, sprint008.5), ici côté Context plutôt que côté callback.
 */
function MobileHeaderAction({ action }: { action: ReactNode }) {
  useMobileHeaderActions(action)
  return null
}

export function RoutesShellPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const tier = useDeviceTier()
  const activeTabId = tabIdFromPath(location.pathname)
  const showCreateButton = activeTabId === 'routes'

  function handleTabChange(id: string) {
    navigate(id === 'routes' ? '/routes' : `/routes/${id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <MobileHeaderAction
        action={
          showCreateButton ? (
            <button
              type="button"
              onClick={() => navigate('/routes/new')}
              aria-label="Nouvelle route"
              className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
            >
              <Plus className="size-5" aria-hidden="true" />
            </button>
          ) : null
        }
      />
      <div className="flex items-center justify-between gap-2 border-b border-reca-gray-light">
        <RoutesTabs activeId={activeTabId} onChange={handleTabChange} />
        {showCreateButton && tier === 'desktop' && (
          <button
            type="button"
            onClick={() => navigate('/routes/new')}
            aria-label="Nouvelle route"
            className="flex size-11 shrink-0 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
          >
            <Plus className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>
      <Outlet />
    </div>
  )
}
