import { Document, Page, View } from '@react-pdf/renderer'
import { PdfFooter } from '@/components/pdf/PdfFooter'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { ContractDocumentData } from '../components/contract-document/types'
import { PdfClientZones } from './sections/PdfClientZones'
import { PdfContractHeader } from './sections/PdfContractHeader'
import { PdfSatelliteZones } from './sections/PdfSatelliteZones'
import { PdfServicesModalites } from './sections/PdfServicesModalites'
import { PdfSignatures } from './sections/PdfSignatures'
import { PdfSummaryPayment } from './sections/PdfSummaryPayment'

type ContractPdfDocumentProps = {
  data: ContractDocumentData
  logoDataUri: string | null
}

/** Racine du PDF Contrat — mire la composition de `ContractDocumentPreview.tsx` (aperçu HTML) en primitives react-pdf. */
export function ContractPdfDocument({ data, logoDataUri }: ContractPdfDocumentProps) {
  const { contract, client, zones, settings, imageUrl } = data

  return (
    <Document title={`Contrat ${contract.numero}`}>
      <Page size="LETTER" style={pdfStyles.page}>
        <PdfContractHeader contract={contract} logoDataUri={logoDataUri} />
        <View style={pdfStyles.body}>
          <PdfServicesModalites contract={contract} />
          <PdfClientZones contract={contract} client={client} zones={zones} />
          <PdfSatelliteZones zones={zones} imageUrl={imageUrl} />
          <PdfSignatures client={client} />
          <PdfSummaryPayment contract={contract} settings={settings} />
        </View>
        <PdfFooter telephone={settings.telephone} courriel={settings.courriel} />
      </Page>
    </Document>
  )
}
