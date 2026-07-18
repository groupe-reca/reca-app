import { useState } from 'react'
import { AlertTriangle, Pencil } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ContractOperatorInfoEditModal } from './ContractOperatorInfoEditModal'
import type { ContractOperatorInfoField } from '../../schemas/contractOperatorInfo.schema'
import type { Contract } from '../../types/contract.types'

type ListField = { field: ContractOperatorInfoField; label: string; value: string | null }

function toBulletList(value: string | null): string[] {
  return (value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function ListColumn({ field, label, value, onEdit }: ListField & { onEdit: (field: ContractOperatorInfoField) => void }) {
  const items = toBulletList(value)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body font-medium text-reca-black">{label}</h3>
        <button
          type="button"
          onClick={() => onEdit(field)}
          aria-label={`Modifier ${label}`}
          className="shrink-0 text-reca-gray-medium hover:text-reca-black"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </button>
      </div>
      {items.length > 0 ? (
        <ul className="flex flex-col gap-1 text-body text-reca-gray-medium">
          {items.map((item, index) => (
            <li key={index} className="flex gap-2">
              <span aria-hidden="true">•</span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body text-reca-gray-medium">—</p>
      )}
    </div>
  )
}

/**
 * "Informations terrain pour l'opérateur" — 3 blocs envoyés à RECA Operator (tablette
 * terrain) : Obstacles connus / Consignes spéciales (listes à puces, une par ligne du
 * texte libre) + Message à afficher à l'opérateur (encart mis en évidence). `notes`
 * ("Autres détails" avant cette refonte) n'est plus affiché ici — reste éditable via
 * le bouton "Modifier" général (`ContractForm.tsx` a déjà ce champ).
 */
export function ContractOperatorInfoCard({ contract }: { contract: Contract }) {
  const [editingField, setEditingField] = useState<ContractOperatorInfoField | null>(null)

  const fields: Record<ContractOperatorInfoField, { label: string; value: string | null }> = {
    obstaclesConnus: { label: 'Obstacles connus', value: contract.obstaclesConnus },
    consignesSpeciales: { label: 'Consignes spéciales', value: contract.consignesSpeciales },
    messageOperateur: { label: 'Message à afficher à l’opérateur', value: contract.messageOperateur },
  }

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Informations terrain pour l'opérateur</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <ListColumn field="obstaclesConnus" {...fields.obstaclesConnus} onEdit={setEditingField} />
        <ListColumn field="consignesSpeciales" {...fields.consignesSpeciales} onEdit={setEditingField} />
        <div className="flex flex-col gap-2 rounded-control border border-reca-warning/40 bg-reca-warning/10 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-body font-semibold text-reca-warning">
              <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
              ATTENTION
            </span>
            <button
              type="button"
              onClick={() => setEditingField('messageOperateur')}
              aria-label={`Modifier ${fields.messageOperateur.label}`}
              className="shrink-0 text-reca-warning/80 hover:text-reca-warning"
            >
              <Pencil className="size-3.5" aria-hidden="true" />
            </button>
          </div>
          <p className="whitespace-pre-line text-body text-reca-black">{fields.messageOperateur.value || '—'}</p>
        </div>
      </div>

      {editingField && (
        <ContractOperatorInfoEditModal
          open
          onClose={() => setEditingField(null)}
          contractId={contract.id}
          field={editingField}
          label={fields[editingField].label}
          initialValue={fields[editingField].value}
        />
      )}
    </Card>
  )
}
