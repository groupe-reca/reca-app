import { Check, MoreVertical, Pencil, Play, Printer, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { RouteStatusBadge } from '../RouteStatusBadge'
import type { Route } from '../../types/route.types'

type RouteDetailHeaderProps = {
  route: Route
  onEdit: () => void
  onDownloadPdf: () => void
  onChangeStatus: (status: Route['statut']) => void
  onDelete: () => void
  isChangingStatus?: boolean
  isDownloadingPdf?: boolean
}

/**
 * Même gabarit que `InvoiceDetailHeader.tsx`/`ContractDetailHeader.tsx` : bloc d'actions
 * groupé. Démarrer/Terminer sont les 2 boutons contextuels du doc06 (MODULE G) ; le menu
 * "…" est un ajout au-delà du spec littéral — "Suspendue" est un statut réel de
 * l'énumération mais n'a pas d'action dédiée dans le doc, il reste accessible ici.
 */
export function RouteDetailHeader({
  route,
  onEdit,
  onDownloadPdf,
  onChangeStatus,
  onDelete,
  isChangingStatus = false,
  isDownloadingPdf = false,
}: RouteDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-3">
        {route.couleur && (
          <span
            className="mt-1 size-4 shrink-0 rounded-full border border-reca-gray-light"
            style={{ backgroundColor: route.couleur }}
            aria-hidden="true"
          />
        )}
        <div>
          <p className="text-label text-reca-gray-medium">{route.numero}</p>
          <h1 className="text-section font-semibold text-reca-black">{route.nom}</h1>
          <div className="mt-2">
            <RouteStatusBadge status={route.statut} />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {route.statut === 'planifiee' && (
          <Button onClick={() => onChangeStatus('en_cours')} isLoading={isChangingStatus}>
            <Play className="size-4" aria-hidden="true" />
            Démarrer
          </Button>
        )}
        {route.statut === 'en_cours' && (
          <Button onClick={() => onChangeStatus('terminee')} isLoading={isChangingStatus}>
            <Check className="size-4" aria-hidden="true" />
            Terminer
          </Button>
        )}
        <Button variant="secondary" onClick={onEdit}>
          <Pencil className="size-4" aria-hidden="true" />
          Modifier
        </Button>
        <Button variant="secondary" onClick={onDownloadPdf} isLoading={isDownloadingPdf}>
          <Printer className="size-4" aria-hidden="true" />
          Imprimer
        </Button>
        <Dropdown
          trigger={
            <Button variant="ghost" aria-label="Plus d'actions">
              <MoreVertical className="size-4" aria-hidden="true" />
            </Button>
          }
        >
          {route.statut !== 'suspendue' && (
            <DropdownItem onClick={() => onChangeStatus('suspendue')}>Suspendre</DropdownItem>
          )}
          {route.statut === 'suspendue' && (
            <DropdownItem onClick={() => onChangeStatus('planifiee')}>Reprendre</DropdownItem>
          )}
        </Dropdown>
        <Button variant="ghost" onClick={onDelete} aria-label="Supprimer la route">
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
