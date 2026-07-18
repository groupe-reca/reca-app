export type StatusColor = 'gray' | 'red' | 'green' | 'orange' | 'blue' | 'purple' | 'yellow'

export const STATUS_BG_CLASSES: Record<StatusColor, string> = {
  gray: 'bg-reca-gray-light',
  red: 'bg-red-50 dark:bg-red-500/15',
  green: 'bg-green-50 dark:bg-green-500/15',
  orange: 'bg-orange-50 dark:bg-orange-500/15',
  blue: 'bg-blue-50 dark:bg-blue-500/15',
  purple: 'bg-purple-50 dark:bg-purple-500/15',
  yellow: 'bg-yellow-50 dark:bg-yellow-500/15',
}

export const STATUS_TEXT_CLASSES: Record<StatusColor, string> = {
  gray: 'text-reca-gray-medium',
  red: 'text-reca-red dark:text-red-400',
  green: 'text-reca-success dark:text-green-400',
  orange: 'text-reca-warning dark:text-orange-400',
  blue: 'text-reca-info dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
}
