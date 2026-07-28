type RoutesTab = { id: 'routes' | 'carte' | 'contrats'; label: string }

const TABS: RoutesTab[] = [
  { id: 'routes', label: '🚜 Routes' },
  { id: 'carte', label: '🗺 Carte' },
  { id: 'contrats', label: '📄 Contrats' },
]

type RoutesTabsProps = {
  activeId: string
  onChange: (id: string) => void
}

/**
 * Barre d'onglets locale au module (pas `PageTabs` partagé) : `PageTabs` embarque son propre
 * padding horizontal pensé pour `ModuleContainer` (page à viewport verrouillé) — ce module suit
 * la convention "page normale" du reste de l'app (`<main>` déjà paddé), un `PageTabs` importé
 * tel quel désalignerait les onglets par rapport au titre au-dessus.
 */
export function RoutesTabs({ activeId, onChange }: RoutesTabsProps) {
  return (
    <div role="tablist" className="flex min-w-0 flex-1 gap-1 overflow-x-auto md:flex-none">
      {TABS.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap px-3 py-3 text-label font-medium transition-colors md:flex-none md:justify-start ${
              isActive ? 'text-reca-red' : 'text-reca-gray-medium hover:text-reca-black'
            }`}
          >
            {tab.label}
            {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-reca-red" />}
          </button>
        )
      })}
    </div>
  )
}
