import { Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge'
import { useClientInvoices } from '@/features/invoices/hooks/useClientInvoices'
import { formatCurrency } from '@/lib/format'

/** Absente de la maquette fournie (qui s'arrête aux notes) — conservée pour ne pas régresser une fonctionnalité existante. */
export function ClientInvoicesCard({ clientId }: { clientId: string }) {
  const navigate = useNavigate()
  const { data: invoices } = useClientInvoices(clientId)

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-subtitle font-semibold text-reca-black">Factures</h2>
        <Button variant="secondary" onClick={() => navigate(`/invoices/new?clientId=${clientId}`)}>
          <Plus className="size-4" aria-hidden="true" />
          Créer une facture
        </Button>
      </div>
      {invoices && invoices.length > 0 ? (
        <div className="flex flex-col gap-2">
          {invoices.map((invoice) => (
            <Link
              key={invoice.id}
              to={`/invoices/${invoice.id}`}
              className="flex items-center justify-between rounded-control border border-reca-gray-light px-4 py-3 hover:bg-reca-snow"
            >
              <div className="text-body text-reca-black">
                <span className="font-medium">{invoice.numero}</span>
                <span className="text-reca-gray-medium"> — {formatCurrency(invoice.total)}</span>
              </div>
              <InvoiceStatusBadge status={invoice.statut} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-body text-reca-gray-medium">Aucune facture pour ce client.</p>
      )}
    </Card>
  )
}
