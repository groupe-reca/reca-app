import { Download, FileEdit, Mail, MoreVertical, Pencil, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { ContractStatusBadge } from '../ContractStatusBadge'
import { CONTRACT_STATUSES, CONTRACT_STATUS_LABELS } from '../../types/contract.types'
import type { Contract, ContractStatus } from '../../types/contract.types'

type ContractDetailHeaderProps = {
  contract: Contract
  clientName: string | null
  /**
   * Ne laisse qu'une action visible (l'action primaire) et renvoie tout le reste dans le menu
   * `…`. Utilisé par la coquille Mobile : empilés pleine largeur, les quatre boutons faisaient
   * un en-tête collant de ~300px, soit l'inverse de « compact ».
   */
  compact?: boolean
  onEdit: () => void
  onEmail: () => void
  onDownloadPdf: () => void
  onCancelContract: () => void
  onChangeStatus: (status: ContractStatus) => void
  onDelete: () => void
  onResumeDraft: () => void
  isCancelling?: boolean
  isDownloadingPdf?: boolean
}

/**
 * En-tête **compact**, destiné à être rendu collant par les pages : sur les onglets autres
 * que Résumé, c'est le seul élément qui rappelle quel contrat est affiché — d'où l'identité
 * en une ligne (`CTR-000056 · Claude Lemire · [Actif]`) plutôt qu'un bloc titre haut.
 *
 * Hiérarchie d'actions (une seule primaire) : « Envoyer par courriel » en rouge RECA,
 * « Modifier »/« Télécharger PDF » en secondaire, et tout le reste — dont « Annuler le
 * contrat », destructif — dans le menu `…` rattaché au groupe de boutons. Avant, quatre
 * boutons de poids visuel équivalent ne désignaient aucune action attendue.
 */
export function ContractDetailHeader({
  contract,
  clientName,
  compact = false,
  onEdit,
  onEmail,
  onDownloadPdf,
  onCancelContract,
  onChangeStatus,
  onDelete,
  onResumeDraft,
  isCancelling = false,
  isDownloadingPdf = false,
}: ContractDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        <h1 className="text-subtitle font-semibold text-reca-black">{contract.numero}</h1>
        {clientName && (
          <>
            <span className="text-reca-gray-medium" aria-hidden="true">
              ·
            </span>
            <span className="truncate text-body text-reca-gray-medium">{clientName}</span>
          </>
        )}
        <ContractStatusBadge status={contract.statut} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {contract.statut === 'brouillon' && !compact && (
          <Button variant="secondary" fullWidth onClick={onResumeDraft} className="sm:w-auto">
            <FileEdit className="size-4" aria-hidden="true" />
            Reprendre le brouillon
          </Button>
        )}
        <Button
          variant="primary"
          fullWidth={!compact}
          onClick={onEmail}
          className={compact ? 'flex-1' : 'sm:w-auto'}
        >
          <Mail className="size-4" aria-hidden="true" />
          Envoyer par courriel
        </Button>
        {!compact && (
          <>
            <Button variant="secondary" fullWidth onClick={onEdit} className="sm:w-auto">
              <Pencil className="size-4" aria-hidden="true" />
              Modifier
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={onDownloadPdf}
              isLoading={isDownloadingPdf}
              className="sm:w-auto"
            >
              <Download className="size-4" aria-hidden="true" />
              Télécharger PDF
            </Button>
          </>
        )}
        <Dropdown
          className={compact ? 'shrink-0' : 'w-full sm:w-auto'}
          trigger={
            <button
              type="button"
              aria-label="Autres actions"
              className={
                compact
                  ? 'flex size-11 items-center justify-center rounded-control border border-reca-gray-light text-reca-gray-medium hover:bg-reca-gray-light hover:text-reca-black'
                  : 'flex h-11 w-full items-center justify-center gap-2 rounded-control border border-reca-gray-light text-reca-gray-medium hover:bg-reca-gray-light hover:text-reca-black sm:h-11 sm:w-11 sm:border-0 sm:p-0'
              }
            >
              <MoreVertical className="size-5" aria-hidden="true" />
              {!compact && <span className="sm:hidden">Plus d&apos;actions</span>}
            </button>
          }
        >
          {compact && (
            <>
              {contract.statut === 'brouillon' && (
                <DropdownItem onClick={onResumeDraft}>
                  <FileEdit className="size-4" aria-hidden="true" />
                  Reprendre le brouillon
                </DropdownItem>
              )}
              <DropdownItem onClick={onEdit}>
                <Pencil className="size-4" aria-hidden="true" />
                Modifier
              </DropdownItem>
              <DropdownItem onClick={onDownloadPdf}>
                <Download className="size-4" aria-hidden="true" />
                {isDownloadingPdf ? 'Génération…' : 'Télécharger PDF'}
              </DropdownItem>
            </>
          )}
          <DropdownItem variant="danger" onClick={onCancelContract}>
            <XCircle className="size-4" aria-hidden="true" />
            {isCancelling ? 'Annulation…' : 'Annuler le contrat'}
          </DropdownItem>
          {CONTRACT_STATUSES.map((status) => (
            <DropdownItem key={status} onClick={() => onChangeStatus(status)}>
              Statut : {CONTRACT_STATUS_LABELS[status]}
            </DropdownItem>
          ))}
          <DropdownItem variant="danger" onClick={onDelete}>
            Supprimer le contrat
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  )
}
