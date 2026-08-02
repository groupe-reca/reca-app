import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EntityRow } from '@/components/ui/EntityRow'
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge'
import { useClientInvoices } from '@/features/invoices/hooks/useClientInvoices'
import { formatCurrency, formatDate } from '@/lib/format'

export function ClientInvoicesCard({ clientId }: { clientId: string }) {
  const navigate = useNavigate()
  const { data: invoices } = useClientInvoices(clientId)

  const all = invoices ?? []
  const total = all.reduce((sum, invoice) => sum + invoice.total, 0)

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-subtitle font-semibold text-reca-black">Factures & paiements</h2>
        <Button variant="secondary" onClick={() => navigate(`/invoices/new?clientId=${clientId}`)}>
          <Plus className="size-4" aria-hidden="true" />
          Créer une facture
        </Button>
      </div>

      {all.length === 0 ? (
        <p className="text-body text-reca-gray-medium">
          Aucune facture pour ce client.{' '}
          <button
            type="button"
            onClick={() => navigate(`/invoices/new?clientId=${clientId}`)}
            className="font-medium text-reca-info hover:underline"
          >
            Créer la première
          </button>
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {all.map((invoice) => (
              <EntityRow
                key={invoice.id}
                to={`/invoices/${invoice.id}`}
                identifier={invoice.numero}
                pivot={`Date : ${formatDate(invoice.date)}`}
                amount={formatCurrency(invoice.total)}
                badge={<InvoiceStatusBadge status={invoice.statut} />}
              />
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-reca-gray-light pt-3 text-label text-reca-gray-medium">
            <span>
              {all.length} {all.length > 1 ? 'factures' : 'facture'}
            </span>
            <span className="font-medium text-reca-black">{formatCurrency(total)}</span>
          </div>
        </>
      )}
    </Card>
  )
}
