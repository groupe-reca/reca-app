import { Fragment } from 'react'
import type { ReactNode } from 'react'

export type TableColumn<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
  sortable?: boolean
  /** Rendered prominently at the top of each mobile card. */
  primary?: boolean
  /** Omitted entirely from the mobile card view. */
  hiddenOnCard?: boolean
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
  const sortableColumns = columns.filter((column) => column.sortable)

  return (
    <div className="flex flex-col gap-3">
      {sortableColumns.length > 0 && (
        <div className="flex items-center gap-2 md:hidden">
          <select
            aria-label="Trier par"
            value={sort?.key ?? ''}
            onChange={(event) => event.target.value && onSortChange?.(event.target.value)}
            className="h-11 flex-1 rounded-control border border-reca-gray-light bg-white px-3 text-body text-reca-black"
          >
            <option value="">Trier par…</option>
            {sortableColumns.map((column) => (
              <option key={column.key} value={column.key}>
                {column.header}
              </option>
            ))}
          </select>
          {sort && (
            <button
              type="button"
              onClick={() => onSortChange?.(sort.key)}
              aria-label={sort.direction === 'asc' ? 'Tri croissant' : 'Tri décroissant'}
              className="flex size-11 shrink-0 items-center justify-center rounded-control border border-reca-gray-light bg-white text-reca-black"
            >
              {sort.direction === 'asc' ? '↑' : '↓'}
            </button>
          )}
        </div>
      )}

      <div className="hidden overflow-x-auto rounded-card border border-reca-gray-light bg-white md:block">
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

      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <TableCardRow key={rowKey(row)} row={row} columns={columns} onClick={onRowClick} />
        ))}
      </div>
    </div>
  )
}

function TableCardRow<T>({
  row,
  columns,
  onClick,
}: {
  row: T
  columns: TableColumn<T>[]
  onClick?: (row: T) => void
}) {
  const primaryColumns = columns.filter((column) => column.primary)
  const secondaryColumns = columns.filter((column) => !column.primary && !column.hiddenOnCard)

  return (
    <div
      onClick={() => onClick?.(row)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`rounded-card border border-reca-gray-light bg-white p-4 ${
        onClick ? 'cursor-pointer active:bg-reca-snow' : ''
      }`}
    >
      {primaryColumns.length > 0 && (
        <div className="flex items-center justify-between gap-2">
          {primaryColumns.map((column) => (
            <div key={column.key}>{column.render(row)}</div>
          ))}
        </div>
      )}
      {secondaryColumns.length > 0 && (
        <div
          className={`grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-label ${
            primaryColumns.length > 0 ? 'mt-3' : ''
          }`}
        >
          {secondaryColumns.map((column) => (
            <Fragment key={column.key}>
              <span className="text-reca-gray-medium">{column.header}</span>
              <span className="text-right text-reca-black">{column.render(row)}</span>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
