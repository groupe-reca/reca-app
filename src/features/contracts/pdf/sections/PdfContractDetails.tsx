import { Text, View } from '@react-pdf/renderer'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import { DEPOT_NEIGE_OPTIONS, SERVICE_OPTIONS } from '../../constants/wizardOptions'
import type { ContractDocumentData } from '../../components/contract-document/types'

type PdfContractDetailsProps = Pick<ContractDocumentData, 'contract'>

/**
 * Carte compacte "Détails du contrat" — services actifs sur une seule ligne (au lieu d'une
 * tuile par service, qui prend beaucoup de place pour souvent un seul service actif) +
 * modalités d'exécution en lignes courtes. Fusionne les anciennes cartes Services/Modalités
 * séparées en une seule, pour tenir sur la même page que le reste des informations du contrat.
 */
export function PdfContractDetails({ contract }: PdfContractDetailsProps) {
  const activeServices = contract.services.filter((service) => service.active)
  const servicesLabel =
    activeServices.length === 0
      ? 'Aucun service actif'
      : activeServices
          .map((service) => SERVICE_OPTIONS.find((option) => option.code === service.code)?.label ?? service.label)
          .join(', ')

  const modalites = [
    { label: "Seuil d'intervention", value: `${contract.seuilDeclenchementCm} cm` },
    { label: 'Heure limite de dégagement', value: contract.heurePremierPassage },
    {
      label: 'Dépôt de la neige',
      value: DEPOT_NEIGE_OPTIONS.find((option) => option.value === contract.depotNeige)?.label ?? '—',
    },
  ]

  return (
    <View style={pdfStyles.card}>
      <View style={pdfStyles.sectionHeaderPlain}>
        <Text style={pdfStyles.sectionHeaderPlainText}>Détails du contrat</Text>
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text style={pdfStyles.label}>Services</Text>
        <Text style={{ fontWeight: 700, marginTop: 2 }}>{servicesLabel}</Text>
      </View>

      <View style={pdfStyles.divider} />

      {modalites.map((item) => (
        <View key={item.label} style={pdfStyles.tableRow}>
          <Text style={{ color: '#6b7280' }}>{item.label}</Text>
          <Text style={{ fontWeight: 700 }}>{item.value}</Text>
        </View>
      ))}
    </View>
  )
}
