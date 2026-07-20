export type FilterChipOption = {
  id: string
  label: string
  count?: number
}

type FilterChipsProps = {
  options: FilterChipOption[]
  activeId: string
  onChange: (id: string) => void
}

export function FilterChips({ options, activeId, onChange }: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((option) => {
        const isActive = option.id === activeId
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={isActive}
            className={`inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-label font-medium transition-colors duration-150 ${
              isActive
                ? 'bg-reca-red text-white'
                : 'bg-reca-gray-light text-reca-gray-medium hover:bg-reca-gray-light/70'
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={isActive ? 'text-white/80' : 'text-reca-gray-medium/80'}>{option.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
