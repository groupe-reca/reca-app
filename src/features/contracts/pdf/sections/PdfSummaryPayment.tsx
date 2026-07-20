import { Text, View } from '@react-pdf/renderer'
import { formatCurrency } from '@/lib/format'
import { pdfColors, pdfStyles } from '@/components/pdf/pdfStyles'
import { MODE_PAIEMENT_OPTIONS } from '../../constants/wizardOptions'
import { computeInstallmentAmount, getNextPaymentEntry } from '../../utils/paymentPresets'
import type { ContractDocumentData } from '../../components/contract-document/types'

type PdfSummaryPaymentProps = Pick<ContractDocumentData, 'contract' | 'settings'>

/** Mire `DocumentSummaryPayment.tsx` — réutilise directement les mêmes fonctions de calcul de taxes/échéances que l'aperçu HTML. */
export function PdfSummaryPayment({ contract, settings }: PdfSummaryPaymentProps) {
  const nextPayment = getNextPaymentEntry(contract.modalitesPaiement)
  const modeLabel = MODE_PAIEMENT_OPTIONS.find((mode) => mode.value === contract.modePaiement)?.label ?? '—'

  const tpsRate = settings.taxes.tps / 100
  const tvqRate = settings.taxes.tvq / 100
  const prix = contract.prix ?? 0
  const sousTotal = contract.prixTaxes === 'apres_taxes' ? prix / (1 + tpsRate + tvqRate) : prix
  const tps = sousTotal * tpsRate
  const tvq = sousTotal * tvqRate
  const total = contract.prixTaxes === 'apres_taxes' ? prix : sousTotal + tps + tvq

  const recap = [
    { label: 'Type', value: contract.type ?? '—' },
    { label: 'Surface totale', value: contract.superficie != null ? `${contract.superficie} m²` : '—' },
    { label: 'Prix', value: contract.prix != null ? formatCurrency(contract.prix) : '—' },
    { label: 'Prochain paiement', value: nextPayment?.dateEcheance ?? '—' },
  ]

  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <View style={pdfStyles.card}>
        <View style={pdfStyles.sectionHeaderNavy}>
          <Text style={pdfStyles.sectionHeaderNavyText}>Récapitulatif du contrat</Text>
        </View>
        {recap.map((item) => (
          <View key={item.label} style={{ marginBottom: 6 }}>
            <Text style={pdfStyles.label}>{item.label}</Text>
            <Text style={{ fontWeight: 700 }}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={pdfStyles.card}>
        <View style={pdfStyles.sectionHeaderNavy}>
          <Text style={pdfStyles.sectionHeaderNavyText}>Paiement</Text>
        </View>
        <View style={{ marginBottom: 8 }}>
          <Text style={pdfStyles.label}>Mode de paiement</Text>
          <Text style={{ fontWeight: 700 }}>{modeLabel}</Text>
        </View>
        {contract.prix != null ? (
          <View style={{ marginBottom: 8 }}>
            <View style={pdfStyles.tableRow}>
              <Text style={{ color: '#6b7280' }}>Sous-total</Text>
              <Text style={{ color: '#6b7280' }}>{formatCurrency(sousTotal)}</Text>
            </View>
            <View style={pdfStyles.tableRow}>
              <Text style={{ color: '#6b7280' }}>TPS ({settings.taxes.tps}%)</Text>
              <Text style={{ color: '#6b7280' }}>{formatCurrency(tps)}</Text>
            </View>
            <View style={pdfStyles.tableRow}>
              <Text style={{ color: '#6b7280' }}>TVQ ({settings.taxes.tvq}%)</Text>
              <Text style={{ color: '#6b7280' }}>{formatCurrency(tvq)}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6 }}>
              <Text style={{ fontWeight: 700 }}>Total</Text>
              <Text style={{ fontWeight: 700, fontSize: 12, color: pdfColors.red }}>{formatCurrency(total)}</Text>
            </View>
          </View>
        ) : (
          <Text style={{ fontWeight: 700, fontSize: 12, color: pdfColors.red, marginBottom: 8 }}>—</Text>
        )}
        {contract.modalitesPaiement.map((entry, index) => (
          <View key={index} style={[pdfStyles.cardMuted, { marginBottom: 6 }]}>
            <Text style={{ fontWeight: 700, textTransform: 'uppercase' }}>{entry.description}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
              <Text style={{ fontWeight: 700, color: pdfColors.red }}>
                {formatCurrency(computeInstallmentAmount(entry, contract.prix))}
              </Text>
              <Text style={{ color: '#6b7280' }}>{entry.dateEcheance || 'date à définir'}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={pdfStyles.cardMuted}>
        <Text style={{ textAlign: 'center', color: '#6b7280' }}>
          Merci pour votre confiance. Nous sommes fiers de vous accompagner tout au long de la saison.
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 6, fontWeight: 700, textTransform: 'uppercase' }}>
          Groupe RÉCA.
        </Text>
      </View>
    </View>
  )
}
