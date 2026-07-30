export type PageTab = {
  id: string
  label: string
  hasError?: boolean
}

type PageTabsProps = {
  tabs: PageTab[]
  activeId: string
  onChange: (id: string) => void
  /**
   * Retire le padding horizontal, prévu pour un conteneur pleine largeur (`ModuleContainer`).
   * À activer quand la page est déjà paddée par son propre `<main>` — sans ça le padding se
   * cumule. Un booléen qui *choisit* la classe plutôt que deux classes de padding
   * concurrentes : l'ordre de cascade Tailwind ne garantirait pas laquelle gagne.
   */
  flush?: boolean
}

export function PageTabs({ tabs, activeId, onChange, flush = false }: PageTabsProps) {
  return (
    <div
      role="tablist"
      className={`flex shrink-0 gap-1 overflow-x-auto border-b border-reca-gray-light ${
        flush ? 'px-0' : 'px-4 sm:px-6 lg:px-8'
      }`}
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
