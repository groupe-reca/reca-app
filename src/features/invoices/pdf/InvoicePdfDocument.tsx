import { Document, Page, View } from '@react-pdf/renderer'
import { PdfFooter } from '@/components/pdf/PdfFooter'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { InvoicePdfData } from './types'
import { PdfBillTo } from './sections/PdfBillTo'
import { PdfContractRef } from './sections/PdfContractRef'
import { PdfInvoiceHeader } from './sections/PdfInvoiceHeader'
import { PdfInvoiceSummaryTable } from './sections/PdfInvoiceSummaryTable'
import { PdfPaymentsTable } from './sections/PdfPaymentsTable'

type InvoicePdfDocumentProps = {
  data: InvoicePdfData
  logoDataUri: string | null
}

/** Racine du PDF Facture — aucun aperçu HTML existant à mirer (contrairement aux contrats), structure dérivée des cartes de fiche existantes (`InvoiceSummaryCard`/`InvoiceClientContractCard`/`InvoicePaymentsCard`). */
export function InvoicePdfDocument({ data, logoDataUri }: InvoicePdfDocumentProps) {
  const { invoice, client, contract, payments, settings } = data

  return (
    <Document title={`Facture ${invoice.numero}`}>
      <Page size="LETTER" style={pdfStyles.page}>
        <PdfInvoiceHeader invoice={invoice} logoDataUri={logoDataUri} />
        <View style={pdfStyles.body}>
          <PdfBillTo client={client} />
          <PdfContractRef contract={contract} />
          <PdfInvoiceSummaryTable invoice={invoice} />
          <PdfPaymentsTable payments={payments} />
        </View>
        <PdfFooter telephone={settings.telephone} courriel={settings.courriel} />
      </Page>
    </Document>
  )
}
