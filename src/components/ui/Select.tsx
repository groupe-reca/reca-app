import { forwardRef, useId } from 'react'
import type { SelectHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  icon: LucideIcon
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, icon: Icon, error, id, className = '', children, ...props },
  ref,
) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-label font-medium text-reca-gray-medium">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-reca-gray-medium"
          aria-hidden="true"
        />
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-11 w-full appearance-none rounded-control border bg-reca-white pl-9 pr-3 text-body text-reca-black focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-400 focus:ring-red-200'
              : 'border-reca-gray-light focus:ring-reca-red/30'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-label text-red-600">
          {error}
        </p>
      )}
    </div>
  )
})
