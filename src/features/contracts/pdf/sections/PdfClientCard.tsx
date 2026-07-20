import { Text, View } from '@react-pdf/renderer'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { ContractDocumentData } from '../../components/contract-document/types'

type PdfClientCardProps = Pick<ContractDocumentData, 'contract' | 'client'>

/**
 * Carte Client — nom, type, adresse. La liste détaillée des zones ne vit plus ici : elle est
 * couverte en entier par la page dédiée au tracé (`PdfSatelliteZones`), pour ne pas dupliquer
 * la même information sur les deux pages et garder cette carte courte.
 */
export function PdfClientCard({ contract, client }: PdfClientCardProps) {
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
    </View>
  )
}
