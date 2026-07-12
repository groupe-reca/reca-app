export type PageTab = {
  id: string
  label: string
  hasError?: boolean
}

type PageTabsProps = {
  tabs: PageTab[]
  activeId: string
  onChange: (id: string) => void
}

export function PageTabs({ tabs, activeId, onChange }: PageTabsProps) {
  return (
    <div
      role="tablist"
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-reca-gray-light px-4 sm:px-6 lg:px-8"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-1.5 whitespace-nowrap px-3 py-3 text-label font-medium transition-colors ${
              isActive ? 'text-reca-red' : 'text-reca-gray-medium hover:text-reca-black'
            }`}
          >
            {tab.label}
            {tab.hasError && (
              <span className="size-1.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
            )}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-reca-red" />}
          </button>
        )
      })}
    </div>
  )
}
