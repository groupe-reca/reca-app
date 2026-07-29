import { Search } from 'lucide-react'
import { useNavigate } from 'react-router'
import { FilterChips } from '@/components/ui/FilterChips'
import { Input } from '@/components/ui/Input'
import { QueryState } from '@/components/ui/QueryState'
import { EquipmentCard } from './EquipmentCard'
import { EquipmentsStatsRow } from './EquipmentsStatsRow'
import { EQUIPMENT_STATUS_FILTER_OPTIONS, useEquipmentsListFilters } from '../hooks/useEquipmentsListFilters'
import type { EquipmentStatusFilter } from '../hooks/useEquipmentsListFilters'
import type { Equipment } from '../types/equipment.types'

type EquipmentsListContentProps = {
  equipments: Equipment[] | undefined
  isLoading: boolean
  isError: boolean
  showStats?: boolean
}

export function EquipmentsListContent({
  equipments,
  isLoading,
  isError,
  showStats = true,
}: EquipmentsListContentProps) {
  const navigate = useNavigate()

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={equipments}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun équipement pour le moment."
      errorLabel="Impossible de charger les équipements."
    >
      {(data) => (
        <EquipmentsListBody
          equipments={data}
          showStats={showStats}
          onSelect={(equipment) => navigate(`/equipment/${equipment.id}`)}
        />
      )}
    </QueryState>
  )
}

function EquipmentsListBody({
  equipments,
  showStats,
  onSelect,
}: {
  equipments: Equipment[]
  showStats: boolean
  onSelect: (equipment: Equipment) => void
}) {
  const { search, setSearch, statusFilter, setStatusFilter, filtered } = useEquipmentsListFilters(equipments)

  return (
    <div className="flex flex-col gap-4">
      {showStats && <EquipmentsStatsRow equipments={equipments} />}

      <Input
        label="Rechercher"
        icon={Search}
        placeholder="Numéro, nom, catégorie, plaque…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <FilterChips
        options={EQUIPMENT_STATUS_FILTER_OPTIONS}
        activeId={statusFilter}
        onChange={(id) => setStatusFilter(id as EquipmentStatusFilter)}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-control border border-reca-gray-light px-4 py-12 text-center text-body text-reca-gray-medium">
          Aucun équipement ne correspond à ces filtres.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((equipment) => (
            <EquipmentCard key={equipment.id} equipment={equipment} onClick={() => onSelect(equipment)} />
          ))}
        </div>
      )}
    </div>
  )
}
