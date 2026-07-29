import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { MobileInvoiceLayout } from '../../components/mobile/MobileInvoiceLayout'
import { InvoicesListContent } from '../../components/InvoicesListContent'
import { useInvoices } from '../../hooks/useInvoices'

export function MobileInvoicesListPage() {
  const navigate = useNavigate()
  const { data: invoices, isLoading, isError } = useInvoices()

  return (
    <MobileInvoiceLayout
      headerActions={
        <button
          type="button"
          onClick={() => navigate('/invoices/new')}
          aria-label="Nouvelle facture"
          className="flex size-12 items-center justify-center rounded-control text-reca-red hover:bg-reca-snow"
        >
          <Plus className="size-5" aria-hidden="true" />
        </button>
      }
    >
      <InvoicesListContent invoices={invoices} isLoading={isLoading} isError={isError} showStats={false} />
    </MobileInvoiceLayout>
  )
}
