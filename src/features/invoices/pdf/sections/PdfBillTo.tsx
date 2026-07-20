import { Text, View } from '@react-pdf/renderer'
import { formatAddress, formatPhone } from '@/lib/format'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { InvoicePdfData } from '../types'

type PdfBillToProps = Pick<InvoicePdfData, 'client'>

/** "Facturé à" — dégrade proprement si `client` est `null` (fiche supprimée/échec de fetch), ne doit jamais faire planter la génération du PDF. */
export function PdfBillTo({ client }: PdfBillToProps) {
  return (
    <View style={pdfStyles.card}>
      <View style={pdfStyles.sectionHeaderNavy}>
        <Text style={pdfStyles.sectionHeaderNavyText}>Facturé à</Text>
      </View>
      {client ? (
        <>
          <Text style={{ fontWeight: 700 }}>
            {client.entreprise ? `${client.entreprise} (${client.prenom} ${client.nom})` : `${client.prenom} ${client.nom}`}
          </Text>
          <Text style={{ marginTop: 4, color: '#6b7280' }}>
            {formatAddress(client.adresse, client.ville, client.codePostal) || 'Adresse non renseignée'}
          </Text>
          {client.telephone && <Text style={{ marginTop: 4, color: '#6b7280' }}>{formatPhone(client.telephone)}</Text>}
          {client.courriel && <Text style={{ color: '#6b7280' }}>{client.courriel}</Text>}
        </>
      ) : (
        <Text style={{ color: '#6b7280' }}>Client non disponible.</Text>
      )}
    </View>
  )
}
