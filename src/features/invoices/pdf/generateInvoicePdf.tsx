import { pdf } from '@react-pdf/renderer'
import { downloadBlob } from '@/components/pdf/downloadBlob'
import { getPdfLogoDataUri } from '@/components/pdf/getPdfLogoDataUri'
import { InvoicePdfDocument } from './InvoicePdfDocument'
import type { InvoicePdfData } from './types'

/**
 * Construit le `Blob` PDF d'une facture, sans le télécharger — réutilisé par
 * `generateInvoicePdf` (téléchargement) et par l'envoi par courriel (pièce jointe).
 * Même règle de chargement paresseux que `generateContractPdf.tsx` (atteint uniquement
 * via `import()` dynamique).
 */
export async function buildInvoicePdfBlob(data: InvoicePdfData): Promise<Blob> {
  const logoDataUri = await getPdfLogoDataUri()
  return pdf(<InvoicePdfDocument data={data} logoDataUri={logoDataUri} />).toBlob()
}

/** Génère et télécharge le PDF d'une facture. */
export async function generateInvoicePdf(data: InvoicePdfData): Promise<void> {
  const blob = await buildInvoicePdfBlob(data)
  downloadBlob(blob, `Facture-${data.invoice.numero}.pdf`)
}
