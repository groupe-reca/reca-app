import type { ReactNode } from 'react'

export type TableColumn<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
  sortable?: boolean
}

type SortState = { key: string; direction: 'asc' | 'desc' } | null

type TableProps<T> = {
  columns: TableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  sort?: SortState
  onSortChange?: (key: string) => void
}

export function Table<T>({ columns, rows, rowKey, onRowClick, sort, onSortChange }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-card border border-reca-gray-light bg-white">
      <table className="w-full text-left text-body">
        <thead>
          <tr className="border-b border-reca-gray-light text-label text-reca-gray-medium">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium">
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSortChange?.(column.key)}
                    className="flex items-center gap-1 hover:text-reca-black"
                  >
                    {column.header}
                    {sort?.key === column.key ? (sort.direction === 'asc' ? '↑' : '↓') : null}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-reca-gray-light last:border-0 ${
                onRowClick ? 'cursor-pointer hover:bg-reca-snow' : ''
              }`}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
