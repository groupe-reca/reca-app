import { pdf } from '@react-pdf/renderer'
import { downloadBlob } from '@/components/pdf/downloadBlob'
import { getPdfLogoDataUri } from '@/components/pdf/getPdfLogoDataUri'
import { InvoicePdfDocument } from './InvoicePdfDocument'
import type { InvoicePdfData } from './types'

/** Génère et télécharge le PDF d'une facture — même règle de chargement paresseux que `generateContractPdf.tsx` (atteint uniquement via `import()` dynamique). */
export async function generateInvoicePdf(data: InvoicePdfData): Promise<void> {
  const logoDataUri = await getPdfLogoDataUri()
  const blob = await pdf(<InvoicePdfDocument data={data} logoDataUri={logoDataUri} />).toBlob()
  downloadBlob(blob, `Facture-${data.invoice.numero}.pdf`)
}
