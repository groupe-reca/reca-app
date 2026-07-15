import { useWatch } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/format'
import type { Client } from '@/features/clients/types/client.types'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'

const CLIENT_TYPE_LABELS: Record<string, string> = {
  residentiel: 'Résidentiel',
  commercial: 'Commercial',
}

type ContractSummaryPanelProps = {
  client: Client | null
  control: Control<ContractCreationFormValues>
}

/**
 * Panneau "Récapitulatif du contrat" permanent (desktop, maquette Wizard v2) — lecture
 * seule, visible sur les 5 étapes. `useWatch` est explicitement scopé aux champs réellement
 * affichés (pas un `useWatch({ control })` global) pour éviter un re-render de ce panneau
 * — monté pendant toute la durée du Wizard — à chaque frappe sur n'importe quelle étape.
 */
export function ContractSummaryPanel({ client, control }: ContractSummaryPanelProps) {
  const typeLabel = client?.typeClient ? (CLIENT_TYPE_LABELS[client.typeClient] ?? null) : null
  const zones = useWatch({ control, name: 'zones' }) ?? []
  const prix = useWatch({ control, name: 'prix' })
  const modalitesPaiement = useWatch({ control, name: 'modalitesPaiement' }) ?? []

  const totalSurface = zones.reduce((sum, zone) => sum + zone.surfaceM2, 0)
  const nextPayment = [...modalitesPaiement].sort((a, b) => a.dateEcheance.localeCompare(b.dateEcheance))[0]

  return (
    <Card className="flex h-fit flex-col gap-4">
      <h2 className="text-subtitle font-semibold text-reca-black">Récapitulatif du contrat</h2>

      {client ? (
        <div>
          <p className="text-body font-medium text-reca-black">
            {client.prenom} {client.nom}
          </p>
          <p className="text-label text-reca-gray-medium">{client.adresse ?? 'Adresse non renseignée'}</p>
        </div>
      ) : (
        <p className="text-body text-reca-gray-medium">Sélectionnez un client pour commencer.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-label text-reca-gray-medium">Type</p>
          <p className="text-body text-reca-black">{typeLabel || '—'}</p>
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">Surface totale</p>
          <p className="text-body text-reca-black">{totalSurface > 0 ? `${totalSurface.toFixed(2)} m²` : '—'}</p>
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">Prix</p>
          <p className="text-body text-reca-black">{prix ? formatCurrency(Number(prix)) : '—'}</p>
        </div>
        <div>
          <p className="text-label text-reca-gray-medium">Prochain paiement</p>
          <p className="text-body text-reca-black">{nextPayment?.dateEcheance || '—'}</p>
        </div>
      </div>

      {zones.length > 0 && (
        <div>
          <p className="mb-1 text-label text-reca-gray-medium">Zones sélectionnées ({zones.length})</p>
          <ul className="flex flex-col gap-1">
            {zones.map((zone) => (
              <li key={zone.id} className="flex items-center justify-between text-label text-reca-black">
                <span>{zone.label}</span>
                <span className="text-reca-gray-medium">{zone.surfaceM2.toFixed(2)} m²</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
