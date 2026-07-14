const currencyFormatter = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' })

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
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
