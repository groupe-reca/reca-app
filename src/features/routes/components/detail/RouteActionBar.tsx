import { Plus, Settings, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type RouteActionBarProps = {
  onAddContract: () => void
  onDeleteRoute: () => void
  onOpenSettings: () => void
}

export function RouteActionBar({ onAddContract, onDeleteRoute, onOpenSettings }: RouteActionBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={onAddContract}>
        <Plus className="size-4" aria-hidden="true" />
        Ajouter un contrat
      </Button>
      <Button variant="secondary" onClick={onOpenSettings}>
        <Settings className="size-4" aria-hidden="true" />
        Paramètres
      </Button>
      <Button variant="secondary" onClick={onDeleteRoute} className="border-red-300 text-red-600 hover:bg-red-50">
        <Trash2 className="size-4" aria-hidden="true" />
        Supprimer la Route
      </Button>
    </div>
  )
}
