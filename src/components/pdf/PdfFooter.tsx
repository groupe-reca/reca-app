import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { formatPhone } from '@/lib/format'
import type { Settings } from '@/features/settings/types/settings.types'
import { pdfColors } from './pdfStyles'

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: pdfColors.nightBlue,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  text: {
    fontSize: 7.5,
    color: 'rgba(255,255,255,0.85)',
  },
})

type PdfFooterProps = Pick<Settings, 'telephone' | 'courriel'>

/** Pied de page navy partagé, fixé sur chaque page (`fixed`) — téléphone/courriel réels + numérotation. */
export function PdfFooter({ telephone, courriel }: PdfFooterProps) {
  return (
    <View style={styles.footer} fixed>
      {telephone && <Text style={styles.text}>{formatPhone(telephone)}</Text>}
      {courriel && <Text style={styles.text}>{courriel}</Text>}
      <Text style={styles.text}>groupereca.ca</Text>
      <Text style={styles.text} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
    </View>
  )
}
