const currencyFormatter = new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' })

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}
