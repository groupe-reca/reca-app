import { Text, View } from '@react-pdf/renderer'
import { formatCurrency, formatDateLong } from '@/lib/format'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { InvoicePdfData } from '../types'

type PdfPaymentsTableProps = Pick<InvoicePdfData, 'payments'>

/** Mire `InvoicePaymentsCard.tsx` — tableau des paiements reçus, état vide géré. */
export function PdfPaymentsTable({ payments }: PdfPaymentsTableProps) {
  return (
    <View style={pdfStyles.card}>
      <View style={pdfStyles.sectionHeaderPlain}>
        <Text style={pdfStyles.sectionHeaderPlainText}>Paiements reçus</Text>
      </View>
      {payments.length === 0 ? (
        <Text style={{ color: '#6b7280' }}>Aucun paiement enregistré.</Text>
      ) : (
        payments.map((payment) => (
          <View key={payment.id} style={pdfStyles.tableRow}>
            <Text>{formatDateLong(payment.date)}</Text>
            <Text style={{ color: '#6b7280' }}>{payment.methode ?? '—'}</Text>
            <Text style={{ fontWeight: 700 }}>{formatCurrency(payment.montant)}</Text>
          </View>
        ))
      )}
    </View>
  )
}
