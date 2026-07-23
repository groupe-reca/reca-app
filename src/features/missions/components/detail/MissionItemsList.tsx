import { QueryState } from '@/components/ui/QueryState'
import { useMissionItems } from '../../hooks/useMissionItems'
import { useUpdateMissionItemStatus } from '../../hooks/useUpdateMissionItemStatus'
import { MissionItemCard } from './MissionItemCard'

export function MissionItemsList({ missionId }: { missionId: string }) {
  const { data: items, isLoading, isError } = useMissionItems(missionId)
  const updateStatus = useUpdateMissionItemStatus(missionId)

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      data={items}
      isEmpty={(data) => data.length === 0}
      emptyLabel="Aucun contrat dans cette mission."
      errorLabel="Impossible de charger les contrats de la mission."
    >
      {(data) => (
        <div className="flex flex-col gap-3">
          {data.map((item) => (
            <MissionItemCard
              key={item.id}
              item={item}
              onChangeStatus={(statut) => updateStatus.mutate({ id: item.id, statut })}
            />
          ))}
        </div>
      )}
    </QueryState>
  )
}
