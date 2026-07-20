import { Text, View } from '@react-pdf/renderer'
import { formatCurrency } from '@/lib/format'
import { pdfColors, pdfStyles } from '@/components/pdf/pdfStyles'
import type { InvoicePdfData } from '../types'

type PdfInvoiceSummaryTableProps = Pick<InvoicePdfData, 'invoice'>

/** Sous-total/TPS/TVQ/Total/Solde — valeurs déjà stockées sur `invoice` (montants figés à l'émission), pas recalculées depuis `settings.taxes` contrairement au PDF Contrat. */
export function PdfInvoiceSummaryTable({ invoice }: PdfInvoiceSummaryTableProps) {
  return (
    <View style={pdfStyles.card}>
      <View style={pdfStyles.sectionHeaderPlain}>
        <Text style={pdfStyles.sectionHeaderPlainText}>Résumé</Text>
      </View>
      <View style={pdfStyles.tableRow}>
        <Text style={{ color: '#6b7280' }}>Sous-total</Text>
        <Text>{formatCurrency(invoice.sousTotal)}</Text>
      </View>
      <View style={pdfStyles.tableRow}>
        <Text style={{ color: '#6b7280' }}>TPS</Text>
        <Text>{formatCurrency(invoice.tps)}</Text>
      </View>
      <View style={pdfStyles.tableRow}>
        <Text style={{ color: '#6b7280' }}>TVQ</Text>
        <Text>{formatCurrency(invoice.tvq)}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6 }}>
        <Text style={{ fontWeight: 700 }}>Total</Text>
        <Text style={{ fontWeight: 700, fontSize: 12, color: pdfColors.red }}>{formatCurrency(invoice.total)}</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Text style={{ fontWeight: 700 }}>Solde</Text>
        <Text style={{ fontWeight: 700 }}>{formatCurrency(invoice.solde)}</Text>
      </View>
    </View>
  )
}
