import { Download, Mail, MoreVertical, Pencil, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { InvoiceStatusBadge } from '../InvoiceStatusBadge'
import { INVOICE_STATUSES, INVOICE_STATUS_LABELS } from '../../types/invoice.types'
import type { Invoice, InvoiceStatus } from '../../types/invoice.types'
import { formatCurrency } from '@/lib/format'

type InvoiceDetailHeaderProps = {
  invoice: Invoice
  onEdit: () => void
  onEmail: () => void
  onDownloadPdf: () => void
  onCancelInvoice: () => void
  onChangeStatus: (status: InvoiceStatus) => void
  onDelete: () => void
  isCancelling?: boolean
  isDownloadingPdf?: boolean
}

/** Même gabarit que `ContractDetailHeader.tsx` : bloc d'actions groupé, statut arbitraire + suppression dans le menu "…". */
export function InvoiceDetailHeader({
  invoice,
  onEdit,
  onEmail,
  onDownloadPdf,
  onCancelInvoice,
  onChangeStatus,
  onDelete,
  isCancelling = false,
  isDownloadingPdf = false,
}: InvoiceDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-label text-reca-gray-medium">{invoice.numero}</p>
        <h1 className="text-section font-semibold text-reca-black">{formatCurrency(invoice.total)}</h1>
        <div className="mt-2">
          <InvoiceStatusBadge status={invoice.statut} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" fullWidth onClick={onEdit} className="sm:w-auto">
          <Pencil className="size-4" aria-hidden="true" />
          Modifier
        </Button>
        <Button variant="info" fullWidth onClick={onEmail} className="sm:w-auto">
          <Mail className="size-4" aria-hidden="true" />
          Envoyer par courriel
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
        <Button
          variant="secondary"
          fullWidth
          onClick={onCancelInvoice}
          disabled={isCancelling}
          className="sm:w-auto border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <XCircle className="size-4" aria-hidden="true" />
          Annuler la facture
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
          {INVOICE_STATUSES.map((status) => (
            <DropdownItem key={status} onClick={() => onChangeStatus(status)}>
              Statut : {INVOICE_STATUS_LABELS[status]}
            </DropdownItem>
          ))}
          <DropdownItem onClick={onDelete}>Supprimer la facture</DropdownItem>
        </Dropdown>
      </div>
    </div>
  )
}
