import { StyleSheet } from '@react-pdf/renderer'

/**
 * Couleurs RECA statiques (mêmes valeurs que les tokens `--color-reca-*` en
 * thème clair, `src/styles/index.css`) — un PDF n'a pas de mode sombre, et
 * l'aperçu HTML existant (`contract-document/`) ignore déjà `settings.couleurs`,
 * donc ce document fait de même plutôt que de lire un champ non utilisé ailleurs.
 */
export const pdfColors = {
  red: '#ed1c24',
  redDark: '#c8151c',
  black: '#111111',
  white: '#ffffff',
  snow: '#fafbfc',
  grayLight: '#e5e7eb',
  grayMedium: '#6b7280',
  nightBlue: '#0f172a',
  success: '#16a34a',
  warning: '#f59e0b',
  info: '#2563eb',
}

export const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 48,
    paddingHorizontal: 0,
    fontSize: 9,
    color: pdfColors.black,
    backgroundColor: pdfColors.white,
  },
  body: {
    paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  card: {
    backgroundColor: pdfColors.white,
    borderRadius: 6,
    padding: 12,
    border: `1pt solid ${pdfColors.grayLight}`,
  },
  cardMuted: {
    backgroundColor: pdfColors.snow,
    borderRadius: 6,
    padding: 12,
  },
  sectionHeaderPlain: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    borderBottom: `1pt solid ${pdfColors.grayLight}`,
    paddingBottom: 6,
  },
  sectionHeaderPlainText: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeaderNavy: {
    backgroundColor: pdfColors.nightBlue,
    marginHorizontal: -12,
    marginTop: -12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  sectionHeaderNavyText: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: pdfColors.white,
  },
  label: {
    fontSize: 7.5,
    color: pdfColors.grayMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    fontSize: 9.5,
    fontWeight: 600,
    color: pdfColors.black,
  },
  divider: {
    borderBottom: `1pt solid ${pdfColors.grayLight}`,
    marginVertical: 6,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottom: `0.5pt solid ${pdfColors.grayLight}`,
  },
  tableHeaderText: {
    fontSize: 7.5,
    fontWeight: 700,
    color: pdfColors.grayMedium,
    textTransform: 'uppercase',
  },
})
