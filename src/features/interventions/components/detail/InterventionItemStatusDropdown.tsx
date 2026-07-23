import { Badge } from '@/components/ui/Badge'
import type { BadgeColor } from '@/components/ui/Badge'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { useUpdateInterventionItemStatus } from '../../hooks/useUpdateInterventionItemStatus'
import { INTERVENTION_ITEM_STATUSES, INTERVENTION_ITEM_STATUS_LABELS } from '../../types/interventionItem.types'
import type { InterventionItemStatus } from '../../types/interventionItem.types'

const ITEM_STATUS_COLORS: Record<InterventionItemStatus, BadgeColor> = {
  planifiee: 'gray',
  en_cours: 'blue',
  terminee: 'green',
  a_reprendre: 'orange',
}

type InterventionItemStatusDropdownProps = {
  interventionId: string
  itemId: string
  status: InterventionItemStatus
}

/**
 * Contrôle rapide de statut (bump pur, sans notes/code problème) — pour le cas courant en
 * marchant la route. Le formulaire complet (notes/code problème) vit dans
 * `InterventionItemDetailModal.tsx`. Mirrors le dropdown de statut d'assignation de
 * `RouteDetailPage.tsx` (`<Dropdown trigger={<Badge>...</Badge>}>`).
 */
export function InterventionItemStatusDropdown({ interventionId, itemId, status }: InterventionItemStatusDropdownProps) {
  const updateStatus = useUpdateInterventionItemStatus(interventionId)

  return (
    <Dropdown trigger={<Badge color={ITEM_STATUS_COLORS[status]}>{INTERVENTION_ITEM_STATUS_LABELS[status]}</Badge>}>
      {INTERVENTION_ITEM_STATUSES.map((option) => (
        <DropdownItem
          key={option}
          onClick={() => updateStatus.mutate({ id: itemId, values: { statut: option } })}
        >
          {INTERVENTION_ITEM_STATUS_LABELS[option]}
        </DropdownItem>
      ))}
    </Dropdown>
  )
}
