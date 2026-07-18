import { useState } from 'react'
import { AlertOctagon, AlertTriangle, Info, MoreHorizontal, Pencil } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ContractOperatorInfoEditModal } from './ContractOperatorInfoEditModal'
import type { ContractOperatorInfoField } from '../../schemas/contractOperatorInfo.schema'
import type { Contract } from '../../types/contract.types'

type Row = {
  field: ContractOperatorInfoField
  icon: LucideIcon
  iconColor: string
  label: string
  value: string | null
}

/**
 * "Notes spécifiques à la résidence" — 4 blocs texte libres envoyés automatiquement à
 * RECA Operator (tablette terrain). 3 nouveaux champs (obstaclesConnus/messageOperateur/
 * consignesSpeciales) + `notes` (existant) réutilisé pour "Autres détails".
 */
export function ContractOperatorInfoCard({ contract }: { contract: Contract }) {
  const [editingField, setEditingField] = useState<ContractOperatorInfoField | null>(null)

  const rows: Row[] = [
    {
      field: 'obstaclesConnus',
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      label: 'Obstacles',
      value: contract.obstaclesConnus,
    },
    {
      field: 'messageOperateur',
      icon: Info,
      iconColor: 'text-blue-500',
      label: 'Message opérateur (app mobile)',
      value: contract.messageOperateur,
    },
    {
      field: 'consignesSpeciales',
      icon: AlertOctagon,
      iconColor: 'text-red-500',
      label: 'Dangers / Points d’attention',
      value: contract.consignesSpeciales,
    },
    {
      field: 'notes',
      icon: MoreHorizontal,
      iconColor: 'text-purple-500',
      label: 'Autres détails',
      value: contract.notes,
    },
  ]

  const editingRow = rows.find((row) => row.field === editingField)

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Notes spécifiques à la résidence</h2>
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.field} className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <row.icon className={`mt-0.5 size-5 shrink-0 ${row.iconColor}`} aria-hidden="true" />
              <div>
                <p className="text-body font-medium text-reca-black">{row.label}</p>
                <p className="text-body text-reca-gray-medium">{row.value || '—'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditingField(row.field)}
              aria-label={`Modifier ${row.label}`}
              className="shrink-0 text-reca-gray-medium hover:text-reca-black"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      {editingRow && (
        <ContractOperatorInfoEditModal
          open
          onClose={() => setEditingField(null)}
          contractId={contract.id}
          field={editingRow.field}
          label={editingRow.label}
          initialValue={editingRow.value}
        />
      )}
    </Card>
  )
}
