import { AlertOctagon, Brush, Ban, DollarSign, Settings2, ShieldCheck, Users } from 'lucide-react'
import { DocumentSectionHeader } from './DocumentSectionHeader'
import type { ContractDocumentData } from './types'

type DocumentClausesListProps = Pick<ContractDocumentData, 'contract'>

/**
 * Les 8 clauses générées automatiquement (`generateClauses.ts`) sont déjà
 * persistées sur la ligne `contracts` au moment de la création (voir
 * `toWizardRowInput` dans `contracts.service.ts`) — pas besoin de les
 * régénérer ici, simple lecture directe.
 */
export function DocumentClausesList({ contract }: DocumentClausesListProps) {
  const clauses = [
    { icon: Users, title: 'Obligations du client', value: contract.obligationsClient },
    { icon: Ban, title: 'Exclusions', value: contract.exclusions },
    { icon: Brush, title: 'Nettoyage final', value: contract.nettoyageFinal },
    { icon: ShieldCheck, title: 'Responsabilités', value: contract.responsabilites },
    { icon: DollarSign, title: 'Prix', value: contract.clausePrix },
    { icon: Settings2, title: 'Exécution', value: contract.clauseExecution },
    { icon: AlertOctagon, title: 'Assurance et responsabilité', value: contract.clauseAssurance },
  ]

  return (
    <div className="rounded-card bg-white p-5 shadow-card">
      <DocumentSectionHeader title="Clauses générales" />
      <div className="flex flex-col gap-4">
        {clauses.map(({ icon: Icon, title, value }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-reca-red/10 text-reca-red">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-body font-semibold text-reca-black">{title}</p>
              <p className="text-body text-reca-gray-medium">{value || '—'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
