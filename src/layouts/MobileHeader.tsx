import { ChevronLeft } from 'lucide-react'
import { Link, useMatches } from 'react-router'
import { useMobileHeaderActionsValue } from './useMobileHeaderActions'

type RouteHandle = {
  breadcrumb?: string
}

/**
 * Header compact mobile : Titre / Retour / Actions principales — remplace
 * `Breadcrumb.tsx` (qui n'est simplement plus monté sur mobile, aucune modification).
 * Même mécanisme de dérivation titre/parent que `Breadcrumb.tsx` (`useMatches()` +
 * `handle.breadcrumb`), pas de système parallèle.
 */
export function MobileHeader() {
  const matches = useMatches()
  const actions = useMobileHeaderActionsValue()

  const crumbs = matches
    .filter((match) => Boolean((match.handle as RouteHandle | undefined)?.breadcrumb))
    .map((match) => ({
      label: (match.handle as RouteHandle).breadcrumb as string,
      pathname: match.pathname,
    }))

  const allCrumbs = [{ label: 'Centre des opérations', pathname: '/dashboard' }, ...crumbs]
  const current = allCrumbs[allCrumbs.length - 1]
  // Contrairement au Breadcrumb desktop (qui montre toujours un lien vers le parent),
  // la racine de chaque module (Leads/Contrats/Clients/...) ne doit PAS afficher de
  // retour en paradigme bottom-tab natif — seules les pages réellement imbriquées
  // (détail/nouveau, ≥2 crumbs déclarés par les routes) en ont besoin.
  const parent = crumbs.length >= 2 ? allCrumbs[allCrumbs.length - 2] : null

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-reca-gray-light bg-reca-white px-2 pt-[env(safe-area-inset-top)]">
      {parent ? (
        <Link
          to={parent.pathname}
          aria-label="Retour"
          className="flex size-12 shrink-0 items-center justify-center rounded-control text-reca-black hover:bg-reca-gray-light"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <span className="size-2 shrink-0" aria-hidden="true" />
      )}
      <h1 className="min-w-0 flex-1 truncate text-body font-semibold text-reca-black">{current.label}</h1>
      {actions && <div className="flex shrink-0 items-center gap-1 pr-1">{actions}</div>}
    </header>
  )
}
