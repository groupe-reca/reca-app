import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSession } from '@/features/auth/hooks/useSession'

type MissionCloseGuardBannerProps = {
  remaining: number
  onForceClose: () => void
  isSubmitting: boolean
}

/** Bannière affichée quand "Fermer" est refusé (tous les MissionItems ne sont pas Terminé/Impossible). */
export function MissionCloseGuardBanner({ remaining, onForceClose, isSubmitting }: MissionCloseGuardBannerProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user.role === 'administrateur'

  return (
    <div className="flex flex-col gap-3 rounded-control border border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-500/30 dark:bg-orange-500/15">
      <div className="flex items-start gap-2 text-body text-reca-warning dark:text-orange-400">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          Impossible. Il reste {remaining} contrat{remaining > 1 ? 's' : ''} à compléter.
        </span>
      </div>
      {isAdmin && (
        <Button variant="secondary" isLoading={isSubmitting} onClick={onForceClose} className="self-start">
          Fermer quand même (Terminée avec anomalies)
        </Button>
      )}
    </div>
  )
}
