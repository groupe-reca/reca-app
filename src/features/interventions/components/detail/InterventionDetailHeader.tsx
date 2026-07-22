import { Check, MoreVertical, Pencil, Play, ShieldAlert, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { useSession } from '@/features/auth/hooks/useSession'
import { InterventionStatusBadge } from '../InterventionStatusBadge'
import type { Intervention } from '../../types/intervention.types'

type InterventionDetailHeaderProps = {
  intervention: Intervention
  onEdit: () => void
  onStart: () => void
  onCloseIntervention: () => void
  onForceClose: () => void
  onCancel: () => void
  isStarting?: boolean
  isClosing?: boolean
  isForceClosing?: boolean
}

/**
 * Machine à états : Planifiée →[Démarrer]→ En cours →[Fermer, verrouillé côté hook tant que
 * des résidences restent incomplètes]→ Terminée. "Forcer la fermeture" (admin uniquement,
 * contourne le verrou) → Terminée avec anomalies. Mirrors `RouteDetailHeader.tsx`
 * (contextuel par statut) + `ContractDetailHeader.tsx` (menu "…" pour les actions secondaires).
 */
export function InterventionDetailHeader({
  intervention,
  onEdit,
  onStart,
  onCloseIntervention,
  onForceClose,
  onCancel,
  isStarting = false,
  isClosing = false,
  isForceClosing = false,
}: InterventionDetailHeaderProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user.role === 'administrateur'
  const canCancel = intervention.statut === 'planifiee' || intervention.statut === 'en_cours'

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-label text-reca-gray-medium">{intervention.numero}</p>
        <h1 className="text-section font-semibold text-reca-black">{intervention.route?.nom ?? 'Intervention'}</h1>
        <div className="mt-2">
          <InterventionStatusBadge status={intervention.statut} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {intervention.statut === 'planifiee' && (
          <Button onClick={onStart} isLoading={isStarting}>
            <Play className="size-4" aria-hidden="true" />
            Démarrer
          </Button>
        )}
        {intervention.statut === 'en_cours' && (
          <Button onClick={onCloseIntervention} isLoading={isClosing}>
            <Check className="size-4" aria-hidden="true" />
            Fermer
          </Button>
        )}
        {intervention.statut === 'en_cours' && isAdmin && (
          <Button
            variant="secondary"
            onClick={onForceClose}
            isLoading={isForceClosing}
            className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-500/30 dark:text-orange-400 dark:hover:bg-orange-500/10"
          >
            <ShieldAlert className="size-4" aria-hidden="true" />
            Forcer la fermeture
          </Button>
        )}
        <Button variant="secondary" onClick={onEdit}>
          <Pencil className="size-4" aria-hidden="true" />
          Modifier
        </Button>
        {canCancel && (
          <Dropdown
            trigger={
              <Button variant="ghost" aria-label="Plus d'actions">
                <MoreVertical className="size-4" aria-hidden="true" />
              </Button>
            }
          >
            <DropdownItem onClick={onCancel}>
              <XCircle className="size-4" aria-hidden="true" />
              Annuler l'intervention
            </DropdownItem>
          </Dropdown>
        )}
      </div>
    </div>
  )
}
