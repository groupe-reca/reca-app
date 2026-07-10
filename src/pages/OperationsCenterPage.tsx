import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'

export function OperationsCenterPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-section font-semibold text-reca-black">
        Bonjour, voici l'état de vos opérations.
      </h1>
      <p className="text-body text-reca-gray-medium">
        Le module Leads est disponible. Soumissions, Clients, Contrats, Routes et plus arrivent bientôt.
      </p>
      <Link to="/leads" className="mt-2 w-fit">
        <Button variant="secondary">Voir les leads</Button>
      </Link>
    </div>
  )
}
