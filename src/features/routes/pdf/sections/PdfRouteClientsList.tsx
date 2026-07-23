import { Text, View } from '@react-pdf/renderer'
import { formatPhone } from '@/lib/format'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { RoutePdfData } from '../types'

type PdfRouteClientsListProps = Pick<RoutePdfData, 'routeClients'>

/** Liste ordonnée des arrêts (nom, adresse, téléphone) — feuille pour le chauffeur. */
export function PdfRouteClientsList({ routeClients }: PdfRouteClientsListProps) {
  return (
    <View style={pdfStyles.card}>
      <View style={pdfStyles.sectionHeaderNavy}>
        <Text style={pdfStyles.sectionHeaderNavyText}>Clients ({routeClients.length})</Text>
      </View>
      {routeClients.length === 0 ? (
        <Text style={{ color: '#6b7280' }}>Aucun client sur cette route.</Text>
      ) : (
        routeClients.map((client, index) => (
          <View key={client.id} style={pdfStyles.tableRow}>
            <Text style={{ fontWeight: 700 }}>
              {index + 1}. {client.prenom} {client.nom}
            </Text>
            <Text style={{ color: '#6b7280' }}>{client.adresse ?? '—'}</Text>
            <Text style={{ color: '#6b7280' }}>{client.telephone ? formatPhone(client.telephone) : '—'}</Text>
          </View>
        ))
      )}
    </View>
  )
}
