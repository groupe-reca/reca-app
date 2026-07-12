import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { InvoiceTable } from '../components/InvoiceTable'
import { useInvoices } from '../hooks/useInvoices'

export function InvoicesListPage() {
  const navigate = useNavigate()
  const { data: invoices, isLoading, isError } = useInvoices()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section font-semibold text-reca-black">Factures</h1>
          <p className="text-body text-reca-gray-medium">Facturation des clients.</p>
        </div>
        <Button onClick={() => navigate('/invoices/new')}>
          <Plus className="size-4" aria-hidden="true" />
          Nouvelle facture
        </Button>
      </div>

      <InvoiceTable invoices={invoices} isLoading={isLoading} isError={isError} />
    </div>
  )
}
