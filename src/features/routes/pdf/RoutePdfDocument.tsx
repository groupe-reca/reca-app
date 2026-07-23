import { Document, Page, View } from '@react-pdf/renderer'
import { PdfFooter } from '@/components/pdf/PdfFooter'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { RoutePdfData } from './types'
import { PdfRouteAssignmentsTable } from './sections/PdfRouteAssignmentsTable'
import { PdfRouteClientsList } from './sections/PdfRouteClientsList'
import { PdfRouteDetails } from './sections/PdfRouteDetails'
import { PdfRouteHeader } from './sections/PdfRouteHeader'

type RoutePdfDocumentProps = {
  data: RoutePdfData
  logoDataUri: string | null
}

/** Racine du PDF Route ("Imprimer", doc06 MODULE G) — mire la structure des PDF Contrat/Facture. */
export function RoutePdfDocument({ data, logoDataUri }: RoutePdfDocumentProps) {
  const { route, routeClients, assignments, settings } = data

  return (
    <Document title={`Route ${route.numero}`}>
      <Page size="LETTER" style={pdfStyles.page}>
        <PdfRouteHeader route={route} logoDataUri={logoDataUri} />
        <View style={pdfStyles.body}>
          <PdfRouteDetails route={route} />
          <PdfRouteClientsList routeClients={routeClients} />
          <PdfRouteAssignmentsTable assignments={assignments} />
        </View>
        <PdfFooter telephone={settings.telephone} courriel={settings.courriel} />
      </Page>
    </Document>
  )
}
