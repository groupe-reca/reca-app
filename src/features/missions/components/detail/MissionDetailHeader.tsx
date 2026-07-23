import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useLogMissionEvent } from '../../hooks/useLogMissionEvent'
import { useUpdateMissionStatus } from '../../hooks/useUpdateMissionStatus'
import { MissionStatusBadge } from '../MissionStatusBadge'
import { MissionCloseGuardBanner } from './MissionCloseGuardBanner'
import type { MissionSummary } from '../../types/mission.types'

export function MissionDetailHeader({ mission }: { mission: MissionSummary }) {
  const [closeAttempted, setCloseAttempted] = useState(false)
  const updateStatus = useUpdateMissionStatus(mission.id)
  const logEvent = useLogMissionEvent(mission.id)

  const remaining = mission.itemCount - mission.itemsTerminee - mission.itemsImpossible

  function handleClose() {
    if (remaining === 0) {
      updateStatus.mutate({ statut: 'terminee' })
      return
    }
    setCloseAttempted(true)
  }

  function handleForceClose() {
    updateStatus.mutate(
      { statut: 'terminee_avec_anomalies', force: true },
      { onSuccess: () => setCloseAttempted(false) },
    )
  }

  function handleCancel() {
    if (!window.confirm('Annuler cette mission ?')) return
    updateStatus.mutate({ statut: 'annulee' })
  }

  return (
    <div className="flex flex-col gap-3 rounded-card bg-reca-white p-6 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-subtitle font-semibold text-reca-black">Mission #{mission.numero}</h1>
        <span className="text-body text-reca-gray-medium">{mission.routeName}</span>
        <MissionStatusBadge status={mission.statut} />
      </div>

      {mission.statut === 'planifiee' && (
        <div className="flex flex-wrap gap-2">
          <Button isLoading={updateStatus.isPending} onClick={() => updateStatus.mutate({ statut: 'en_cours' })}>
            Débuter
          </Button>
          <Button variant="secondary" onClick={handleCancel} className="border-red-300 text-red-600 hover:bg-red-50">
            Annuler
          </Button>
        </div>
      )}

      {mission.statut === 'en_cours' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              isLoading={logEvent.isPending}
              onClick={() => logEvent.mutate({ type: 'mission_pausee' })}
            >
              Pause
            </Button>
            <Button
              variant="secondary"
              isLoading={logEvent.isPending}
              onClick={() => logEvent.mutate({ type: 'mission_reprise' })}
            >
              Reprendre
            </Button>
            <Button isLoading={updateStatus.isPending} onClick={handleClose}>
              Fermer
            </Button>
            <Button variant="secondary" onClick={handleCancel} className="border-red-300 text-red-600 hover:bg-red-50">
              Annuler
            </Button>
          </div>
          {closeAttempted && (
            <MissionCloseGuardBanner
              remaining={remaining}
              onForceClose={handleForceClose}
              isSubmitting={updateStatus.isPending}
            />
          )}
        </div>
      )}
    </div>
  )
}
