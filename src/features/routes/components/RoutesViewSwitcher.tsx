import { Calendar, List, Map } from 'lucide-react'

export type RoutesViewMode = 'carte' | 'liste' | 'timeline'

const OPTIONS: { value: RoutesViewMode; label: string; icon: typeof Map }[] = [
  { value: 'carte', label: 'Carte', icon: Map },
  { value: 'liste', label: 'Liste', icon: List },
  { value: 'timeline', label: 'Timeline', icon: Calendar },
]

type RoutesViewSwitcherProps = {
  value: RoutesViewMode
  onChange: (mode: RoutesViewMode) => void
}

/**
 * Contrôle segmenté local (bascule Carte/Liste/Timeline) — délibérément pas
 * `PageTabs` (`src/components/layout/`), conçu pour la barre d'onglets à points
 * d'erreur de validation de l'ancien formulaire Contrats (remplacé par le Wizard) :
 * une simple bascule de vue sans sémantique de formulaire mérite un composant plus
 * léger.
 */
export function RoutesViewSwitcher({ value, onChange }: RoutesViewSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="Vue des routes"
      className="inline-flex items-center gap-1 rounded-control border border-reca-gray-light bg-reca-white p-1"
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={`inline-flex h-9 items-center gap-2 rounded-control px-3 text-label font-medium transition-colors duration-200 ${
              isActive ? 'bg-reca-red text-white' : 'text-reca-gray-medium hover:text-reca-black'
            }`}
          >
            <option.icon className="size-4" aria-hidden="true" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
