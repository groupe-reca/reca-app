import { Download, FileEdit, Mail, MoreVertical, Pencil, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { ContractStatusBadge } from '../ContractStatusBadge'
import { CONTRACT_STATUSES, CONTRACT_STATUS_LABELS } from '../../types/contract.types'
import type { Contract, ContractStatus } from '../../types/contract.types'

type ContractDetailHeaderProps = {
  contract: Contract
  onEdit: () => void
  onEmail: () => void
  onDownloadPdf: () => void
  onCancelContract: () => void
  onChangeStatus: (status: ContractStatus) => void
  onDelete: () => void
  onResumeDraft: () => void
  isCancelling?: boolean
}

/**
 * Bloc d'actions regroupé (maquette : Modifier / Envoyer par courriel / Télécharger PDF /
 * Annuler le contrat). Le sélecteur de statut arbitraire complet + la suppression (capacités
 * admin existantes, pas de place dans le bloc visible de la maquette) vivent dans le menu "…".
 */
export function ContractDetailHeader({
  contract,
  onEdit,
  onEmail,
  onDownloadPdf,
  onCancelContract,
  onChangeStatus,
  onDelete,
  onResumeDraft,
  isCancelling = false,
}: ContractDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-label text-reca-gray-medium">{contract.numero}</p>
        <h1 className="text-section font-semibold text-reca-black">
          {contract.type ?? 'Contrat'} {contract.saison ? `— ${contract.saison}` : ''}
        </h1>
        <div className="mt-2">
          <ContractStatusBadge status={contract.statut} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {contract.statut === 'brouillon' && (
          <Button variant="secondary" fullWidth onClick={onResumeDraft} className="sm:w-auto">
            <FileEdit className="size-4" aria-hidden="true" />
            Reprendre le brouillon
          </Button>
        )}
        <Button variant="secondary" fullWidth onClick={onEdit} className="sm:w-auto">
          <Pencil className="size-4" aria-hidden="true" />
          Modifier
        </Button>
        <Button variant="secondary" fullWidth onClick={onEmail} className="sm:w-auto">
          <Mail className="size-4" aria-hidden="true" />
          Envoyer par courriel
        </Button>
        <Button variant="secondary" fullWidth onClick={onDownloadPdf} className="sm:w-auto">
          <Download className="size-4" aria-hidden="true" />
          Télécharger PDF
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={onCancelContract}
          disabled={isCancelling}
          className="sm:w-auto border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <XCircle className="size-4" aria-hidden="true" />
          Annuler le contrat
        </Button>
        <Dropdown
          className="w-full sm:w-auto"
          trigger={
            <button
              type="button"
              aria-label="Autres actions"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-control border border-reca-gray-light text-reca-gray-medium hover:bg-reca-gray-light hover:text-reca-black sm:h-11 sm:w-11 sm:border-0 sm:p-0"
            >
              <MoreVertical className="size-5" aria-hidden="true" />
              <span className="sm:hidden">Plus d&apos;actions</span>
            </button>
          }
        >
          {CONTRACT_STATUSES.map((status) => (
            <DropdownItem key={status} onClick={() => onChangeStatus(status)}>
              Statut : {CONTRACT_STATUS_LABELS[status]}
            </DropdownItem>
          ))}
          <DropdownItem onClick={onDelete}>Supprimer le contrat</DropdownItem>
        </Dropdown>
      </div>
    </div>
  )
}
