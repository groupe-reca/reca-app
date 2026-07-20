import { Text, View } from '@react-pdf/renderer'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { ContractDocumentData } from '../../components/contract-document/types'

type PdfSignaturesProps = Pick<ContractDocumentData, 'client'>

/** Mire `DocumentSignatures.tsx` — blocs décoratifs, aucune capture de signature réelle. */
export function PdfSignatures({ client }: PdfSignaturesProps) {
  return (
    <View style={pdfStyles.card}>
      <View style={pdfStyles.sectionHeaderPlain}>
        <Text style={pdfStyles.sectionHeaderPlainText}>Signatures</Text>
      </View>
      <View style={pdfStyles.row}>
        <View style={pdfStyles.col}>
          <Text style={pdfStyles.label}>Client</Text>
          <Text style={{ marginTop: 4 }}>
            {client.prenom} {client.nom}
          </Text>
          <View style={{ marginTop: 16, borderBottom: '1pt solid #e5e7eb' }} />
          <Text style={{ marginTop: 4, color: '#6b7280' }}>Date : ____________________</Text>
        </View>
        <View style={pdfStyles.col}>
          <Text style={pdfStyles.label}>Groupe RÉCA</Text>
          <Text style={{ marginTop: 4 }}>Entrepreneur</Text>
          <View style={{ marginTop: 16, borderBottom: '1pt solid #e5e7eb' }} />
          <Text style={{ marginTop: 4, color: '#6b7280' }}>Date : ____________________</Text>
        </View>
      </View>
    </View>
  )
}
