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

/**
 * Deux garde-fous complémentaires contre la barre de défilement verticale parasite :
 * - le trait de l'onglet actif est en `bottom-0`, pas `-bottom-px` : en position absolue il
 *   compte dans la zone de débordement scrollable de ce conteneur, et le déborder d'1 px
 *   suffisait à en sortir une barre verticale native qui rognait le dernier libellé ;
 * - `overflow-y-hidden` est explicite, car `overflow-x-auto` seul requalifie l'axe Y de
 *   `visible` à `auto` (spec CSS) — sans lui, tout futur descendant qui déborderait d'un
 *   pixel ferait revenir la barre.
 */
export function PageTabs({ tabs, activeId, onChange, flush = false }: PageTabsProps) {
  return (
    <div
      role="tablist"
      className={`flex shrink-0 gap-1 overflow-x-auto overflow-y-hidden border-b border-reca-gray-light ${
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
            className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-3 text-label transition-colors ${
              isActive
                ? 'font-semibold text-reca-black'
                : 'font-medium text-reca-gray-medium hover:text-reca-black'
            }`}
          >
            {tab.label}
            {tab.hasError && (
              <span className="size-1.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
            )}
            {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-reca-black" />}
          </button>
        )
      })}
    </div>
  )
}
