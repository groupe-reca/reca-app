import { ChevronRight } from 'lucide-react'
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

  return (
    <div className="flex h-11 shrink-0 items-center gap-1.5 border-b border-reca-gray-light bg-white px-6 text-label text-reca-gray-medium">
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
  )
}
