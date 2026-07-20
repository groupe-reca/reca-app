import { formatDateLong } from '@/lib/format'
import { PdfBrandHeader } from '@/components/pdf/PdfBrandHeader'
import { INVOICE_STATUS_LABELS } from '../../types/invoice.types'
import type { InvoicePdfData } from '../types'

type PdfInvoiceHeaderProps = Pick<InvoicePdfData, 'invoice'> & { logoDataUri: string | null }

/** Mire `PdfContractHeader.tsx` (même bandeau partagé) — titre "Facture". */
export function PdfInvoiceHeader({ invoice, logoDataUri }: PdfInvoiceHeaderProps) {
  return (
    <PdfBrandHeader
      title="Facture"
      subtitle={INVOICE_STATUS_LABELS[invoice.statut]}
      logoDataUri={logoDataUri}
      metaRows={[
        { label: 'N° de facture', value: invoice.numero },
        { label: 'Date', value: formatDateLong(invoice.date) },
      ]}
    />
  )
}
