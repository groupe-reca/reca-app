import { Text, View } from '@react-pdf/renderer'
import { pdfColors, pdfStyles } from '@/components/pdf/pdfStyles'
import { DEPOT_NEIGE_OPTIONS, SERVICE_OPTIONS } from '../../constants/wizardOptions'
import type { ContractDocumentData } from '../../components/contract-document/types'

type PdfServicesModalitesProps = Pick<ContractDocumentData, 'contract'>

/** Mire `DocumentServicesModalites.tsx` — services actifs + modalités d'exécution, colonne gauche. */
export function PdfServicesModalites({ contract }: PdfServicesModalitesProps) {
  const activeServices = contract.services.filter((service) => service.active)
  const modalites = [
    { label: "Seuil d'intervention", value: `${contract.seuilDeclenchementCm} cm` },
    { label: 'Heure limite de dégagement', value: contract.heurePremierPassage },
    {
      label: 'Dépôt de la neige',
      value: DEPOT_NEIGE_OPTIONS.find((option) => option.value === contract.depotNeige)?.label ?? '—',
    },
  ]

  return (
    <View style={pdfStyles.row}>
      <View style={[pdfStyles.card, pdfStyles.col]}>
        <View style={pdfStyles.sectionHeaderPlain}>
          <Text style={pdfStyles.sectionHeaderPlainText}>Services</Text>
        </View>
        {activeServices.length === 0 ? (
          <Text>Aucun service actif.</Text>
        ) : (
          activeServices.map((service) => (
            <View key={service.code} style={{ marginBottom: 4 }}>
              <Text style={{ fontWeight: 700, textTransform: 'uppercase' }}>
                {SERVICE_OPTIONS.find((option) => option.code === service.code)?.label ?? service.label}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={[pdfStyles.card, pdfStyles.col]}>
        <View style={pdfStyles.sectionHeaderPlain}>
          <Text style={pdfStyles.sectionHeaderPlainText}>Modalités d'exécution</Text>
        </View>
        {modalites.map((item) => (
          <View key={item.label} style={pdfStyles.tableRow}>
            <Text style={pdfStyles.label}>{item.label.toUpperCase()}</Text>
            <Text style={{ fontWeight: 700, color: pdfColors.warning }}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
