import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { Link, useMatches } from 'react-router'

type RouteHandle = {
  breadcrumb?: string
}

type BreadcrumbProps = {
  onOpenMenu: () => void
}

export function Breadcrumb({ onOpenMenu }: BreadcrumbProps) {
  const matches = useMatches()
  const crumbs = matches
    .filter((match) => Boolean((match.handle as RouteHandle | undefined)?.breadcrumb))
    .map((match) => ({
      label: (match.handle as RouteHandle).breadcrumb as string,
      pathname: match.pathname,
    }))

  const allCrumbs = [{ label: 'Centre des opérations', pathname: '/dashboard' }, ...crumbs]
  const current = allCrumbs[allCrumbs.length - 1]
  const parent = allCrumbs.length > 1 ? allCrumbs[allCrumbs.length - 2] : null

  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-reca-gray-light bg-white px-4 text-label text-reca-gray-medium lg:h-[72px] lg:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Ouvrir le menu"
        className="flex size-11 shrink-0 items-center justify-center rounded-control text-reca-black hover:bg-reca-gray-light lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* Mobile: condensed back-link only — pages already show their own <h1>. */}
      {parent && (
        <Link to={parent.pathname} className="flex items-center gap-1 hover:text-reca-black sm:hidden">
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          {parent.label}
        </Link>
      )}
      {!parent && <span className="font-medium text-reca-black sm:hidden">{current.label}</span>}

      <div className="hidden min-w-0 items-center gap-1.5 overflow-x-auto whitespace-nowrap sm:flex">
        {allCrumbs.map((crumb, index) => {
          const isLast = index === allCrumbs.length - 1
          return (
            <span key={crumb.pathname} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
              {isLast ? (
                <span className="font-medium text-reca-black">{crumb.label}</span>
              ) : (
                <Link to={crumb.pathname} className="hover:text-reca-black">
                  {crumb.label}
                </Link>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
