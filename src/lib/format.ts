const currencyFormatter = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' })

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

const areaFormatter = new Intl.NumberFormat('fr-CA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Formate une surface en m² au format français (virgule décimale) : `47,92 m²`.
 * Renvoie `'—'` si null/undefined. **Seul formateur de surface du repo** — ne pas
 * réintroduire de `.toFixed(2)` aux points d'usage, qui produisait un point anglais.
 */
export function formatArea(m2: number | null | undefined): string {
  if (m2 == null) return '—'
  return `${areaFormatter.format(m2)} m²`
}

export function formatPhone(value: string | null | undefined): string {
  if (!value) return ''
  const digits = value.replace(/\D/g, '').slice(-10)
  if (digits.length !== 10) return value
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function formatAddress(
  adresse: string | null | undefined,
  ville: string | null | undefined,
  codePostal: string | null | undefined,
): string {
  const lignePrincipale = [adresse, ville].filter(Boolean).join(', ')
  const suffixe = ['QC', codePostal].filter(Boolean).join(' ')
  if (!suffixe) return lignePrincipale
  return lignePrincipale ? `${lignePrincipale}, ${suffixe}` : suffixe
}

const longDateFormatter = new Intl.DateTimeFormat('fr-CA', { dateStyle: 'long' })

export function formatDateLong(iso: string): string {
  return longDateFormatter.format(new Date(iso))
}

const dateTimeFormatter = new Intl.DateTimeFormat('fr-CA', { dateStyle: 'medium', timeStyle: 'short' })

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso))
}

/**
 * Formate une durée exprimée en **secondes** en texte français compact :
 * `1 h 05 min` / `12 min 30 s` / `45 s`. Renvoie `'—'` si null/undefined.
 */
export function formatDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null) return '—'
  const s = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60
  if (hours > 0) return `${hours} h ${String(minutes).padStart(2, '0')} min`
  if (minutes > 0) return `${minutes} min ${String(seconds).padStart(2, '0')} s`
  return `${seconds} s`
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat('fr-CA', { numeric: 'auto' })

export function formatRelativeTime(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now()
  const diffMinutes = Math.round(diffMs / 60000)
  if (Math.abs(diffMinutes) < 60) return relativeTimeFormatter.format(diffMinutes, 'minute')
  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24) return relativeTimeFormatter.format(diffHours, 'hour')
  const diffDays = Math.round(diffHours / 24)
  return relativeTimeFormatter.format(diffDays, 'day')
}
