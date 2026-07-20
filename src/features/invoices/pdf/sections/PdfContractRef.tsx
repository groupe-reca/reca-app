import { Text, View } from '@react-pdf/renderer'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { InvoicePdfData } from '../types'

type PdfContractRefProps = Pick<InvoicePdfData, 'contract'>

/** "Contrat lié" — rendue uniquement si un contrat est associé à la facture, omise entièrement sinon (pas de placeholder vide). */
export function PdfContractRef({ contract }: PdfContractRefProps) {
  if (!contract) return null

  return (
    <View style={pdfStyles.cardMuted}>
      <Text style={pdfStyles.label}>Contrat lié</Text>
      <Text style={{ fontWeight: 700, marginTop: 2 }}>
        {contract.numero}
        {contract.type ? ` — ${contract.type}` : ''}
        {contract.saison ? ` (${contract.saison})` : ''}
      </Text>
    </View>
  )
}
