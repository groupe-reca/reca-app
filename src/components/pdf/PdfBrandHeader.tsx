import { Image, StyleSheet, Text, View } from '@react-pdf/renderer'
import { pdfColors } from './pdfStyles'

const styles = StyleSheet.create({
  hero: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: pdfColors.nightBlue,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logo: {
    height: 28,
    marginBottom: 16,
    objectFit: 'contain',
  },
  wordmark: {
    marginBottom: 16,
    fontSize: 12,
    fontWeight: 700,
    color: pdfColors.white,
    letterSpacing: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    textTransform: 'uppercase',
    color: pdfColors.white,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 8.5,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: 'rgba(255,255,255,0.75)',
  },
  metaCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    backgroundColor: pdfColors.white,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 160,
  },
  metaLabel: {
    fontSize: 7,
    color: pdfColors.grayMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: 9.5,
    fontWeight: 700,
    color: pdfColors.black,
  },
})

type PdfBrandHeaderProps = {
  title: string
  subtitle?: string
  metaRows: { label: string; value: string }[]
  logoDataUri: string | null
}

/** Bandeau héro navy partagé par les PDF Contrat et Facture — mire `DocumentHeader.tsx` (aperçu HTML), sans dégradé (non supporté par react-pdf). */
export function PdfBrandHeader({ title, subtitle, metaRows, logoDataUri }: PdfBrandHeaderProps) {
  return (
    <View style={styles.hero}>
      <View>
        {logoDataUri ? (
          <Image src={logoDataUri} style={styles.logo} />
        ) : (
          <Text style={styles.wordmark}>GROUPE RÉCA</Text>
        )}
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.metaCard}>
        {metaRows.map((row) => (
          <View key={row.label}>
            <Text style={styles.metaLabel}>{row.label}</Text>
            <Text style={styles.metaValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
