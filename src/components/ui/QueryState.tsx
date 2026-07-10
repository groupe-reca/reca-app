import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

type QueryStateProps<T> = {
  isLoading: boolean
  isError: boolean
  data: T | undefined
  isEmpty?: (data: T) => boolean
  emptyLabel?: string
  errorLabel?: string
  children: (data: T) => ReactNode
}

export function QueryState<T>({
  isLoading,
  isError,
  data,
  isEmpty,
  emptyLabel = 'Aucun résultat.',
  errorLabel = 'Une erreur est survenue.',
  children,
}: QueryStateProps<T>) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-12 animate-pulse rounded-control bg-reca-gray-light" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-control border border-red-200 bg-red-50 px-4 py-8 text-center text-body text-red-700">
        <TriangleAlert className="size-5" aria-hidden="true" />
        {errorLabel}
      </div>
    )
  }

  if (data === undefined || (isEmpty && isEmpty(data))) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
        {emptyLabel}
      </div>
    )
  }

  return <>{children(data)}</>
}
