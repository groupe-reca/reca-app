import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useMatches } from 'react-router'

type RouteHandle = {
  breadcrumb?: string
}

export function Breadcrumb() {
  const matches = useMatches()
  const crumbs = matches
    .filter((match) => Boolean((match.handle as RouteHandle | undefined)?.breadcrumb))
    .map((match) => ({
      label: (match.handle as RouteHandle).breadcrumb as string,
      pathname: match.pathname,
    }))

  if (crumbs.length === 0) {
    return (
      <div className="flex h-11 shrink-0 items-center gap-1.5 border-b border-reca-gray-light bg-white px-4 text-label text-reca-gray-medium lg:px-6">
        <span className="font-medium text-reca-black">Centre des opérations</span>
      </div>
    )
  }

  const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2] : null

  return (
    <div className="flex h-11 shrink-0 items-center overflow-x-auto whitespace-nowrap border-b border-reca-gray-light bg-white px-4 text-label text-reca-gray-medium lg:px-6">
      {/* Mobile: condensed back-link only — pages already show their own <h1>. */}
      <Link to={parent?.pathname ?? '/dashboard'} className="flex items-center gap-1 hover:text-reca-black sm:hidden">
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        {parent?.label ?? 'Centre des opérations'}
      </Link>

      <div className="hidden items-center gap-1.5 sm:flex">
        <span className="font-medium text-reca-black">Centre des opérations</span>
        {crumbs.map((crumb) => (
          <span key={crumb.pathname} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <Link to={crumb.pathname} className="hover:text-reca-black">
              {crumb.label}
            </Link>
          </span>
        ))}
      </div>
    </div>
  )
}
