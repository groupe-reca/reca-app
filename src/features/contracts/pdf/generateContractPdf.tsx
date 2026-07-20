import { pdf } from '@react-pdf/renderer'
import { downloadBlob } from '@/components/pdf/downloadBlob'
import { getPdfLogoDataUri } from '@/components/pdf/getPdfLogoDataUri'
import type { ContractDocumentData } from '../components/contract-document/types'
import { ContractPdfDocument } from './ContractPdfDocument'

/**
 * Génère et télécharge le PDF d'un contrat. `@react-pdf/renderer` est une librairie
 * volumineuse (moteur de mise en page + polices) — ce module doit toujours être atteint
 * via un `import()` dynamique depuis les pages qui l'utilisent, jamais un `import` statique,
 * pour que Rollup le code-split hors du bundle principal (vérifié via `npm run build`).
 */
export async function generateContractPdf(data: ContractDocumentData): Promise<void> {
  const logoDataUri = await getPdfLogoDataUri()
  const blob = await pdf(<ContractPdfDocument data={data} logoDataUri={logoDataUri} />).toBlob()
  downloadBlob(blob, `Contrat-${data.contract.numero}.pdf`)
}
