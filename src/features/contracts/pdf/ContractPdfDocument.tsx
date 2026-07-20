import { Document, Page, View } from '@react-pdf/renderer'
import { PdfFooter } from '@/components/pdf/PdfFooter'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { ContractDocumentData } from '../components/contract-document/types'
import { PdfClientCard } from './sections/PdfClientCard'
import { PdfContractDetails } from './sections/PdfContractDetails'
import { PdfContractHeader } from './sections/PdfContractHeader'
import { PdfSatelliteZones } from './sections/PdfSatelliteZones'
import { PdfSignatures } from './sections/PdfSignatures'
import { PdfSummaryPayment } from './sections/PdfSummaryPayment'

type ContractPdfDocumentProps = {
  data: ContractDocumentData
  logoDataUri: string | null
}

/**
 * Racine du PDF Contrat — 2 pages distinctes (demande explicite de l'utilisateur) : la 1re
 * page porte toutes les informations du contrat (en-tête, détails, client, récapitulatif/
 * paiement, signatures), la 2e page est réservée exclusivement au tracé de la propriété
 * (image satellite + tableau des zones). Si le contenu de la 1re page est trop volumineux
 * pour tenir sur une seule feuille, react-pdf ajoute automatiquement une page de continuation
 * du même format avant la page du tracé — celle-ci démarre toujours sur une page neuve,
 * jamais partagée avec le reste du contrat.
 */
export function ContractPdfDocument({ data, logoDataUri }: ContractPdfDocumentProps) {
  const { contract, client, zones, settings, imageUrl } = data
  const hasTrace = zones.length > 0 || Boolean(imageUrl)

  return (
    <Document title={`Contrat ${contract.numero}`}>
      <Page size="LETTER" style={pdfStyles.page}>
        <PdfContractHeader contract={contract} logoDataUri={logoDataUri} />
        <View style={pdfStyles.body}>
          <View style={pdfStyles.row}>
            <View style={[pdfStyles.col, { flex: 2 }]}>
              <PdfContractDetails contract={contract} />
            </View>
            <View style={pdfStyles.col}>
              <PdfClientCard contract={contract} client={client} />
            </View>
          </View>
          <PdfSummaryPayment contract={contract} settings={settings} />
          <PdfSignatures client={client} />
        </View>
        <PdfFooter telephone={settings.telephone} courriel={settings.courriel} />
      </Page>

      {hasTrace && (
        <Page size="LETTER" style={pdfStyles.page}>
          <PdfSatelliteZones contract={contract} zones={zones} imageUrl={imageUrl} />
          <PdfFooter telephone={settings.telephone} courriel={settings.courriel} />
        </Page>
      )}
    </Document>
  )
}
