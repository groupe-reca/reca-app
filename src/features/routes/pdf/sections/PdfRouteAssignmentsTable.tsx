import { Text, View } from '@react-pdf/renderer'
import { formatDateLong } from '@/lib/format'
import { pdfStyles } from '@/components/pdf/pdfStyles'
import { ASSIGNMENT_STATUS_LABELS } from '../../services/routeAssignments.service'
import type { RoutePdfData } from '../types'

type PdfRouteAssignmentsTableProps = Pick<RoutePdfData, 'assignments'>

/** Mire `PdfPaymentsTable.tsx` — employé/équipement/date/statut de chaque assignation. */
export function PdfRouteAssignmentsTable({ assignments }: PdfRouteAssignmentsTableProps) {
  return (
    <View style={pdfStyles.card}>
      <View style={pdfStyles.sectionHeaderPlain}>
        <Text style={pdfStyles.sectionHeaderPlainText}>Assignations</Text>
      </View>
      {assignments.length === 0 ? (
        <Text style={{ color: '#6b7280' }}>Aucune assignation pour cette route.</Text>
      ) : (
        assignments.map((assignment) => (
          <View key={assignment.id} style={pdfStyles.tableRow}>
            <Text style={{ fontWeight: 700 }}>
              {assignment.employee ? `${assignment.employee.prenom} ${assignment.employee.nom}` : '—'}
            </Text>
            <Text style={{ color: '#6b7280' }}>{assignment.equipment?.numero ?? '—'}</Text>
            <Text style={{ color: '#6b7280' }}>{formatDateLong(assignment.date)}</Text>
            <Text>{ASSIGNMENT_STATUS_LABELS[assignment.statut]}</Text>
          </View>
        ))
      )}
    </View>
  )
}
