import { useState } from 'react'
import { useParams } from 'react-router'
import { QueryState } from '@/components/ui/QueryState'
import { InterventionFormModal } from '../../components/InterventionFormModal'
import { InterventionDetailHeader } from '../../components/detail/InterventionDetailHeader'
import { InterventionHistoryCard } from '../../components/detail/InterventionHistoryCard'
import { InterventionNotesCard } from '../../components/detail/InterventionNotesCard'
import { InterventionProgressCard } from '../../components/detail/InterventionProgressCard'
import { InterventionResidencesCard } from '../../components/detail/InterventionResidencesCard'
import { InterventionSummaryCard } from '../../components/detail/InterventionSummaryCard'
import { InterventionMapView } from '../../components/map/InterventionMapView'
import { MobileInterventionLayout } from '../../components/mobile/MobileInterventionLayout'
import { useCancelIntervention } from '../../hooks/useCancelIntervention'
import { useCloseIntervention } from '../../hooks/useCloseIntervention'
import { useForceCloseIntervention } from '../../hooks/useForceCloseIntervention'
import { useIntervention } from '../../hooks/useIntervention'
import { useInterventionItems } from '../../hooks/useInterventionItems'
import { useStartIntervention } from '../../hooks/useStartIntervention'

/** Mêmes composants `detail/` que la version Desktop, empilés en 1 colonne — la carte reste juste après l'en-tête. */
export function MobileInterventionDetailPage() {
  const { id = '' } = useParams()
  const { data: intervention, isLoading, isError } = useIntervention(id)
  const { data: items } = useInterventionItems(id)
  const startIntervention = useStartIntervention(id)
  const closeIntervention = useCloseIntervention(id)
  const forceCloseIntervention = useForceCloseIntervention(id)
  const cancelIntervention = useCancelIntervention(id)
  const [editOpen, setEditOpen] = useState(false)

  function handleForceClose() {
    if (!window.confirm('Forcer la fermeture de cette intervention malgré des résidences incomplètes ?')) return
    forceCloseIntervention.mutate()
  }

  function handleCancel() {
    if (!window.confirm('Annuler cette intervention ?')) return
    cancelIntervention.mutate()
  }

  return (
    <MobileInterventionLayout>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={intervention}
        errorLabel="Impossible de charger cette intervention."
      >
        {(interventionData) => (
          <div className="flex flex-col gap-4">
            <InterventionDetailHeader
              intervention={interventionData}
              onEdit={() => setEditOpen(true)}
              onStart={() => startIntervention.mutate()}
              onCloseIntervention={() => closeIntervention.mutate()}
              onForceClose={handleForceClose}
              onCancel={handleCancel}
              isStarting={startIntervention.isPending}
              isClosing={closeIntervention.isPending}
              isForceClosing={forceCloseIntervention.isPending}
            />
            <InterventionMapView interventionId={interventionData.id} items={items ?? []} />
            <InterventionSummaryCard intervention={interventionData} />
            <InterventionProgressCard items={items ?? []} />
            <InterventionResidencesCard interventionId={interventionData.id} items={items ?? []} />
            <InterventionNotesCard interventionId={interventionData.id} />
            <InterventionHistoryCard interventionId={interventionData.id} />
            <InterventionFormModal open={editOpen} onClose={() => setEditOpen(false)} intervention={interventionData} />
          </div>
        )}
      </QueryState>
    </MobileInterventionLayout>
  )
}
