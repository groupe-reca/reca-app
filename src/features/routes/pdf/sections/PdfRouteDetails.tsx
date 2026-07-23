import { Text, View } from '@react-pdf/renderer'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import type { RoutePdfData } from '../types'

type PdfRouteDetailsProps = Pick<RoutePdfData, 'route'>

/** Distance/durée (calculées automatiquement — voir `routeMetrics.service.ts`) + description. */
export function PdfRouteDetails({ route }: PdfRouteDetailsProps) {
  return (
    <View style={pdfStyles.card}>
      <View style={pdfStyles.sectionHeaderPlain}>
        <Text style={pdfStyles.sectionHeaderPlainText}>Détails</Text>
      </View>
      <View style={pdfStyles.row}>
        <View style={pdfStyles.col}>
          <Text style={pdfStyles.label}>Distance</Text>
          <Text style={pdfStyles.value}>{route.distance != null ? `${route.distance} km` : '—'}</Text>
        </View>
        <View style={pdfStyles.col}>
          <Text style={pdfStyles.label}>Durée estimée</Text>
          <Text style={pdfStyles.value}>{route.dureeEstimee ?? '—'}</Text>
        </View>
        <View style={pdfStyles.col}>
          <Text style={pdfStyles.label}>Nom</Text>
          <Text style={pdfStyles.value}>{route.nom}</Text>
        </View>
      </View>
      {route.description && (
        <>
          <View style={pdfStyles.divider} />
          <Text style={{ color: '#6b7280' }}>{route.description}</Text>
        </>
      )}
    </View>
  )
}
