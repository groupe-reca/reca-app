import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { formatCurrency } from '@/lib/format'
import { useDeleteInvoice } from '../hooks/useDeleteInvoice'
import { useInvoice } from '../hooks/useInvoice'
import { useUpdateInvoiceStatus } from '../hooks/useUpdateInvoiceStatus'
import { InvoiceFormModal } from '../components/InvoiceFormModal'
import { InvoiceStatusBadge } from '../components/InvoiceStatusBadge'
import { INVOICE_STATUSES, INVOICE_STATUS_LABELS } from '../types/invoice.types'

export function InvoiceDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: invoice, isLoading } = useInvoice(id)
  const updateStatus = useUpdateInvoiceStatus(id)
  const deleteInvoice = useDeleteInvoice()
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading || !invoice) {
    return <div className="h-32 animate-pulse rounded-card bg-reca-gray-light" />
  }

  function handleDelete() {
    if (!invoice) return
    if (!window.confirm(`Supprimer la facture ${invoice.numero} ?`)) return
    deleteInvoice.mutate(invoice.id, { onSuccess: () => navigate('/invoices') })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label text-reca-gray-medium">{invoice.numero}</p>
          <h1 className="text-section font-semibold text-reca-black">{formatCurrency(invoice.total)}</h1>
          <div className="mt-2">
            <InvoiceStatusBadge status={invoice.statut} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" aria-hidden="true" />
            Modifier
          </Button>
          <Dropdown trigger={<Button variant="ghost">Statut</Button>}>
            {INVOICE_STATUSES.map((status) => (
              <DropdownItem key={status} onClick={() => updateStatus.mutate(status)}>
                {INVOICE_STATUS_LABELS[status]}
              </DropdownItem>
            ))}
          </Dropdown>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Détails</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            <p>Date : {invoice.date}</p>
            <p>Sous-total : {formatCurrency(invoice.sousTotal)}</p>
            <p>TPS : {formatCurrency(invoice.tps)}</p>
            <p>TVQ : {formatCurrency(invoice.tvq)}</p>
            <p>Total : {formatCurrency(invoice.total)}</p>
            <p>Solde : {formatCurrency(invoice.solde)}</p>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-subtitle font-semibold text-reca-black">Client &amp; contrat</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            {invoice.client ? (
              <p>
                Client :{' '}
                <Link to={`/clients/${invoice.client.id}`} className="text-reca-red hover:underline">
                  {invoice.client.prenom} {invoice.client.nom} ({invoice.client.numero})
                </Link>
              </p>
            ) : (
              <p>Aucun client associé.</p>
            )}
            {invoice.contract ? (
              <p>
                Contrat :{' '}
                <Link to={`/contracts/${invoice.contract.id}`} className="text-reca-red hover:underline">
                  {invoice.contract.numero}
                </Link>
              </p>
            ) : (
              <p>Aucun contrat associé.</p>
            )}
          </div>
        </Card>
      </div>

      <InvoiceFormModal open={editOpen} onClose={() => setEditOpen(false)} invoice={invoice} />
    </div>
  )
}
