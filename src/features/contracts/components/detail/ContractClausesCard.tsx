import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ContractClausesModal } from './ContractClausesModal'
import type { Contract } from '../../types/contract.types'

/**
 * "Clauses du contrat" — checklist des points clés (services réellement actifs sur
 * CE contrat + la clause de responsabilité, toujours présente). Le texte légal complet
 * (zone desservie, exclusions, seuils, clauses OPC générées...) vit désormais dans
 * `ContractClausesModal`, ouverte via "Voir toutes les clauses" (remplace l'ancien
 * expand/collapse inline).
 */
export function ContractClausesCard({ contract }: { contract: Contract }) {
  const [modalOpen, setModalOpen] = useState(false)

  const items = [
    ...contract.services.filter((service) => service.active).map((service) => `${service.label} inclus`),
    'Responsabilité limitée au contrat',
  ]

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Clauses du contrat</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-body text-reca-black">
            <CheckCircle2 className="size-4 shrink-0 text-reca-success" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <Button variant="secondary" onClick={() => setModalOpen(true)}>
        Voir toutes les clauses
      </Button>

      <ContractClausesModal open={modalOpen} onClose={() => setModalOpen(false)} contract={contract} />
    </Card>
  )
}
