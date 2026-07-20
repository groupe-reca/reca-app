import { Image, Text, View } from '@react-pdf/renderer'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import { ZONE_TYPE_OPTIONS } from '../../constants/wizardOptions'
import type { ContractDocumentData } from '../../components/contract-document/types'

type PdfSatelliteZonesProps = Pick<ContractDocumentData, 'zones' | 'imageUrl'>

/** Mire `DocumentSatelliteZones.tsx` — image satellite (URL signée) + résumé des zones tracées, sans `PolygonCard` (composant HTML, non réutilisable en react-pdf). */
export function PdfSatelliteZones({ zones, imageUrl }: PdfSatelliteZonesProps) {
  return (
    <View style={pdfStyles.card} wrap={false}>
      <View style={pdfStyles.sectionHeaderPlain}>
        <Text style={pdfStyles.sectionHeaderPlainText}>Vue satellite et zones tracées</Text>
      </View>
      {imageUrl ? (
        <Image src={imageUrl} style={{ width: '100%', borderRadius: 6, marginBottom: 8 }} />
      ) : (
        <Text style={{ marginBottom: 8, color: '#6b7280' }}>Aucune image satellite disponible.</Text>
      )}
      {zones.map((zone) => (
        <View key={zone.id} style={pdfStyles.tableRow}>
          <Text>{zone.label}</Text>
          <Text style={{ color: '#6b7280' }}>
            {ZONE_TYPE_OPTIONS.find((option) => option.code === zone.type)?.label ?? zone.type} —{' '}
            {zone.surfaceM2.toFixed(2)} m²
          </Text>
        </View>
      ))}
    </View>
  )
}
