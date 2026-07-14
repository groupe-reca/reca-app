export type StatusColor = 'gray' | 'red' | 'green' | 'orange' | 'blue'

export const STATUS_BG_CLASSES: Record<StatusColor, string> = {
  gray: 'bg-reca-gray-light',
  red: 'bg-red-50',
  green: 'bg-green-50',
  orange: 'bg-orange-50',
  blue: 'bg-blue-50',
}

export const STATUS_TEXT_CLASSES: Record<StatusColor, string> = {
  gray: 'text-reca-gray-medium',
  red: 'text-reca-red',
  green: 'text-reca-success',
  orange: 'text-reca-warning',
  blue: 'text-reca-info',
}
