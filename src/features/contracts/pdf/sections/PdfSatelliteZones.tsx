import { Image, Text, View } from '@react-pdf/renderer'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import { ZONE_TYPE_OPTIONS } from '../../constants/wizardOptions'
import type { ContractDocumentData } from '../../components/contract-document/types'

type PdfSatelliteZonesProps = Pick<ContractDocumentData, 'contract' | 'zones' | 'imageUrl'>

/**
 * Contenu de la 2e page du PDF (`ContractPdfDocument.tsx`) — dédiée entièrement au tracé de
 * la propriété, jamais mélangée aux informations du contrat de la 1re page (demande explicite
 * de l'utilisateur : "la deuxième page soit le tracé de déneigement, pas plus"). Image satellite
 * (URL signée) + tableau des zones tracées, sans `PolygonCard` (composant HTML, non réutilisable
 * en react-pdf).
 */
export function PdfSatelliteZones({ contract, zones, imageUrl }: PdfSatelliteZonesProps) {
  const totalSurface = zones.reduce((sum, zone) => sum + zone.surfaceM2, 0)

  return (
    <View style={pdfStyles.body}>
      <View style={{ marginBottom: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Tracé de la propriété</Text>
        <Text style={{ ...pdfStyles.label, marginTop: 2 }}>Contrat {contract.numero}</Text>
      </View>

      {imageUrl ? (
        <Image src={imageUrl} style={{ width: '100%', borderRadius: 6 }} />
      ) : (
        <View style={[pdfStyles.cardMuted, { alignItems: 'center', paddingVertical: 32 }]}>
          <Text style={{ color: '#6b7280' }}>Aucune image satellite disponible.</Text>
        </View>
      )}

      {zones.length > 0 && (
        <View style={pdfStyles.card}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={pdfStyles.tableHeaderText}>Zone</Text>
            <Text style={pdfStyles.tableHeaderText}>Superficie</Text>
          </View>
          {zones.map((zone) => {
            const typeLabel = ZONE_TYPE_OPTIONS.find((option) => option.code === zone.type)?.label ?? zone.type
            return (
              <View key={zone.id} style={pdfStyles.tableRow}>
                <Text>
                  {zone.label}
                  {typeLabel !== zone.label && <Text style={{ color: '#6b7280' }}> — {typeLabel}</Text>}
                </Text>
                <Text style={{ fontWeight: 700 }}>{zone.surfaceM2.toFixed(2)} m²</Text>
              </View>
            )
          })}
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6 }}>
            <Text style={{ fontWeight: 700 }}>Total</Text>
            <Text style={{ fontWeight: 700 }}>{totalSurface.toFixed(2)} m²</Text>
          </View>
        </View>
      )}
    </View>
  )
}
