const currencyFormatter = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' })

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
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
