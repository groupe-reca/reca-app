import { FileText, Map, Truck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type RoutesTab = { id: 'routes' | 'carte' | 'contrats'; label: string; icon: LucideIcon }

const TABS: RoutesTab[] = [
  { id: 'routes', label: 'Routes', icon: Truck },
  { id: 'carte', label: 'Carte', icon: Map },
  { id: 'contrats', label: 'Contrats', icon: FileText },
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
 *
 * Deux garde-fous complémentaires contre la barre de défilement verticale parasite :
 * - le trait de l'onglet actif est en `bottom-0`, pas `-bottom-px` : en position absolue il
 *   compte dans la zone de débordement scrollable de ce conteneur, et le déborder d'1 px
 *   suffisait à en sortir une barre verticale native qui rognait le dernier libellé ;
 * - `overflow-y-hidden` est explicite, car `overflow-x-auto` seul requalifie l'axe Y de
 *   `visible` à `auto` (spec CSS) — sans lui, tout futur descendant qui déborderait d'un
 *   pixel ferait revenir la barre.
 */
export function RoutesTabs({ activeId, onChange }: RoutesTabsProps) {
  return (
    <div
      role="tablist"
      className="flex min-w-0 flex-1 gap-1 overflow-x-auto overflow-y-hidden md:flex-none"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeId
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex flex-1 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap px-3 py-3 text-label transition-colors md:flex-none md:justify-start ${
              isActive
                ? 'font-semibold text-reca-black'
                : 'font-medium text-reca-gray-medium hover:text-reca-black'
            }`}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {tab.label}
            {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-reca-black" />}
          </button>
        )
      })}
    </div>
  )
}
