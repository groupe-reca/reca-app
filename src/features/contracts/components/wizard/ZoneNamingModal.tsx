import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ZoneTypeSelector } from './ZoneTypeSelector'
import { useZoneTypeSelection } from '../../hooks/useZoneTypeSelection'
import type { ZoneType } from '../../types/contract.types'

type ZoneNamingModalProps = {
  pendingZone: { surfaceM2: number } | null
  onConfirm: (type: ZoneType, label: string) => void
  onCancel: () => void
}

/**
 * Fenêtre qui s'ouvre automatiquement après le tracé d'une zone (sprint009) : affiche
 * la surface calculée par Turf.js et fait choisir un type (couleur associée). Toute
 * fermeture (Annuler, Échap, clic hors modale) passe par `onCancel`, qui doit retirer
 * la géométrie tout juste tracée côté carte (`PolygonEditor.discardPending`) — sans
 * quoi un polygone resterait affiché sans jamais apparaître dans la liste des zones.
 */
export function ZoneNamingModal({ pendingZone, onConfirm, onCancel }: ZoneNamingModalProps) {
  const selection = useZoneTypeSelection()

  function handleConfirm() {
    if (!selection.resolvedLabel) return
    onConfirm(selection.type, selection.resolvedLabel)
    selection.reset()
  }

  function handleCancel() {
    selection.reset()
    onCancel()
  }

  return (
    <Modal open={pendingZone !== null} onClose={handleCancel} title="Nouvelle zone">
      {pendingZone && (
        <div className="flex flex-col gap-4">
          <p className="text-body text-reca-black">
            Surface calculée : <span className="font-medium">{pendingZone.surfaceM2.toFixed(2)} m²</span>
          </p>
          <ZoneTypeSelector selection={selection} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="button" disabled={!selection.resolvedLabel} onClick={handleConfirm}>
              Ajouter la zone
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
