import { Text, View } from '@react-pdf/renderer'
import { formatCurrency } from '@/lib/format'
import { pdfColors, pdfStyles } from '@/components/pdf/pdfStyles'
import { MODE_PAIEMENT_OPTIONS } from '../../constants/wizardOptions'
import { computeInstallmentAmount, getNextPaymentEntry } from '../../utils/paymentPresets'
import type { ContractDocumentData } from '../../components/contract-document/types'

type PdfSummaryPaymentProps = Pick<ContractDocumentData, 'contract' | 'settings'>

/**
 * Carte unique "Récapitulatif & paiement" — fusionne les anciennes cartes Récapitulatif et
 * Paiement (2 cartes empilées + une citation décorative) en une seule carte compacte, sans le
 * bloc de remerciement (décoratif, ne fait pas partie des informations pertinentes du contrat).
 * Réutilise directement les mêmes fonctions de calcul de taxes/échéances que l'aperçu HTML.
 */
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
    { label: 'Mode de paiement', value: modeLabel },
    { label: 'Prochain paiement', value: nextPayment?.dateEcheance ?? '—' },
  ]

  return (
    <View style={pdfStyles.card}>
      <View style={pdfStyles.sectionHeaderNavy}>
        <Text style={pdfStyles.sectionHeaderNavyText}>Récapitulatif &amp; paiement</Text>
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        {recap.map((item) => (
          <View key={item.label} style={{ width: '47%' }}>
            <Text style={pdfStyles.label}>{item.label}</Text>
            <Text style={{ fontWeight: 700, marginTop: 1 }}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={pdfStyles.divider} />

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

      {contract.modalitesPaiement.length > 0 && (
        <>
          <View style={pdfStyles.divider} />
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
            <Text style={pdfStyles.tableHeaderText}>Échéance</Text>
            <Text style={pdfStyles.tableHeaderText}>Montant / date</Text>
          </View>
          {contract.modalitesPaiement.map((entry, index) => (
            <View key={index} style={pdfStyles.tableRow}>
              <Text>{entry.description}</Text>
              <Text>
                <Text style={{ fontWeight: 700, color: pdfColors.red }}>
                  {formatCurrency(computeInstallmentAmount(entry, contract.prix))}
                </Text>
                <Text style={{ color: '#6b7280' }}> — {entry.dateEcheance || 'date à définir'}</Text>
              </Text>
            </View>
          ))}
        </>
      )}
    </View>
  )
}
