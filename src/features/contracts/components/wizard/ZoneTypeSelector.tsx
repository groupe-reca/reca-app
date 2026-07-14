import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ZONE_TYPE_AUTRE, ZONE_TYPE_OPTIONS } from '../../constants/wizardOptions'
import type { ZoneTypeSelection } from '../../hooks/useZoneTypeSelection'
import type { ZoneType } from '../../types/contract.types'

/** Menu déroulant des 7 types de zone + champ "Précisez le nom" additionnel pour "Autre". */
export function ZoneTypeSelector({ selection }: { selection: ZoneTypeSelection }) {
  return (
    <>
      <Select
        label="Type de zone"
        icon={MapPin}
        value={selection.type}
        onChange={(event) => selection.setType(event.target.value as ZoneType)}
      >
        {ZONE_TYPE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </Select>
      {selection.type === ZONE_TYPE_AUTRE && (
        <Input
          label="Précisez le nom"
          icon={MapPin}
          value={selection.customLabel}
          onChange={(event) => selection.setCustomLabel(event.target.value)}
          placeholder="Ex. Balcon, Escalier…"
        />
      )}
    </>
  )
}
