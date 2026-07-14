import type { BadgeColor } from '@/components/ui/Badge'
import type { ContractStatus } from '../types/contract.types'

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, BadgeColor> = {
  actif: 'green',
  en_attente: 'orange',
  expire: 'gray',
  annule: 'red',
}
