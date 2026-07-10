import { useMemo, useState } from 'react'

type SortDirection = 'asc' | 'desc'
type SortState = { key: string; direction: SortDirection } | null

type UseTableStateOptions<T> = {
  data: T[]
  searchableFields?: (keyof T)[]
  pageSize?: number
}

export function useTableState<T>({ data, searchableFields = [], pageSize = 20 }: UseTableStateOptions<T>) {
  const [search, setSearchValue] = useState('')
  const [sort, setSort] = useState<SortState>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!search.trim() || searchableFields.length === 0) return data
    const term = search.trim().toLowerCase()
    return data.filter((row) =>
      searchableFields.some((field) => String(row[field] ?? '').toLowerCase().includes(term)),
    )
  }, [data, search, searchableFields])

  const sorted = useMemo(() => {
    if (!sort) return filtered
    const { key, direction } = sort
    return [...filtered].sort((a, b) => {
      const aValue = String((a as Record<string, unknown>)[key] ?? '')
      const bValue = String((b as Record<string, unknown>)[key] ?? '')
      const comparison = aValue.localeCompare(bValue)
      return direction === 'asc' ? comparison : -comparison
    })
  }, [filtered, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function toggleSort(key: string) {
    setSort((current) => {
      if (!current || current.key !== key) return { key, direction: 'asc' }
      if (current.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }

  function setSearch(value: string) {
    setSearchValue(value)
    setPage(1)
  }

  return { search, setSearch, sort, toggleSort, page: currentPage, pageCount, setPage, rows: paged, totalCount: sorted.length }
}
