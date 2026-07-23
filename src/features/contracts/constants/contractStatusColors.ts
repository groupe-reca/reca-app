import type { BadgeColor } from '@/components/ui/Badge'
import type { ContractStatus } from '../types/contract.types'

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, BadgeColor> = {
  brouillon: 'gray',
  a_signer: 'purple',
  en_attente: 'yellow',
  actif: 'green',
  suspendu: 'orange',
  expire: 'red',
  annule: 'gray',
}
