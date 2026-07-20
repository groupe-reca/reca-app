import { Text, View } from '@react-pdf/renderer'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { ContractDocumentData } from '../../components/contract-document/types'

type PdfClientZonesProps = Pick<ContractDocumentData, 'contract' | 'client' | 'zones'>

/** Mire `DocumentClientZones.tsx` — carte Client + liste des zones tracées. */
export function PdfClientZones({ contract, client, zones }: PdfClientZonesProps) {
  return (
    <View style={pdfStyles.card}>
      <View style={pdfStyles.sectionHeaderNavy}>
        <Text style={pdfStyles.sectionHeaderNavyText}>Client</Text>
      </View>

      <Text style={{ fontWeight: 700 }}>
        {client.prenom} {client.nom}
      </Text>
      {contract.type && <Text style={{ marginTop: 2, color: '#f59e0b', fontWeight: 600 }}>{contract.type}</Text>}

      <View style={{ marginTop: 8 }}>
        <Text style={{ color: '#6b7280' }}>{client.adresse ?? 'Adresse non renseignée'}</Text>
        {(client.ville || client.codePostal) && (
          <Text style={{ color: '#6b7280' }}>
            {client.ville} (QC) {client.codePostal}
          </Text>
        )}
      </View>

      <View style={pdfStyles.divider} />

      <Text style={{ ...pdfStyles.label, marginBottom: 4 }}>Zones tracées</Text>
      {zones.length === 0 ? (
        <Text style={{ color: '#6b7280' }}>Aucune zone tracée pour l'instant.</Text>
      ) : (
        zones.map((zone) => (
          <View key={zone.id} style={pdfStyles.tableRow}>
            <Text>{zone.label}</Text>
            <Text style={{ color: '#6b7280' }}>{zone.surfaceM2.toFixed(2)} m²</Text>
          </View>
        ))
      )}
    </View>
  )
}
