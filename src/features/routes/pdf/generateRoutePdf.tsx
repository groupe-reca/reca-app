import { pdf } from '@react-pdf/renderer'
import { downloadBlob } from '@/components/pdf/downloadBlob'
import { getPdfLogoDataUri } from '@/components/pdf/getPdfLogoDataUri'
import { RoutePdfDocument } from './RoutePdfDocument'
import type { RoutePdfData } from './types'

/**
 * Construit le `Blob` PDF d'une feuille de route, sans le télécharger — même règle de
 * chargement paresseux que `generateContractPdf.tsx`/`generateInvoicePdf.tsx` (atteint
 * uniquement via `import()` dynamique depuis la page appelante, jamais un import statique,
 * pour que `@react-pdf/renderer` reste code-splitté hors du bundle principal).
 */
export async function buildRoutePdfBlob(data: RoutePdfData): Promise<Blob> {
  const logoDataUri = await getPdfLogoDataUri()
  return pdf(<RoutePdfDocument data={data} logoDataUri={logoDataUri} />).toBlob()
}

/** Génère et télécharge la feuille de route PDF. */
export async function generateRoutePdf(data: RoutePdfData): Promise<void> {
  const blob = await buildRoutePdfBlob(data)
  downloadBlob(blob, `Route-${data.route.numero}.pdf`)
}
