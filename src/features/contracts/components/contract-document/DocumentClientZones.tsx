import { MapPin, User } from 'lucide-react'
import { DocumentSectionHeader } from './DocumentSectionHeader'
import type { ContractDocumentData } from './types'

type DocumentClientZonesProps = Pick<ContractDocumentData, 'contract' | 'client' | 'zones'>

/**
 * Carte Client + sous-section "Zones tracées" — colonne droite du document.
 * `zones` peut être vide sur le chemin de secours (rafraîchissement de page sans
 * `location.state`, voir `ContractCreatedPage.tsx`) même si des zones existent
 * réellement : `Contract` ne stocke que le total (`superficie`), pas le détail
 * par zone — dégradation connue et acceptée pour ce sprint.
 */
export function DocumentClientZones({ contract, client, zones }: DocumentClientZonesProps) {
  return (
    <div className="rounded-card bg-white p-5 shadow-card">
      <DocumentSectionHeader title="Client" variant="navy" />

      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-reca-red/10 text-reca-red">
          <User className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-body font-semibold text-reca-black">
            {client.prenom} {client.nom}
          </p>
          {contract.type && <p className="text-label font-medium text-reca-warning">{contract.type}</p>}
        </div>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <MapPin className="mt-0.5 size-4 shrink-0 text-reca-gray-medium" aria-hidden="true" />
        <div className="text-body text-reca-gray-medium">
          <p>{client.adresse ?? 'Adresse non renseignée'}</p>
          {(client.ville || client.codePostal) && (
            <p>
              {client.ville} (QC) {client.codePostal}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-reca-gray-light pt-4">
        <p className="mb-2 text-label font-semibold uppercase tracking-wide text-reca-black">Zones tracées</p>
        {zones.length === 0 ? (
          <div className="flex flex-col items-center gap-1 rounded-control border border-dashed border-reca-gray-light px-4 py-5 text-center">
            <MapPin className="size-4 text-reca-gray-medium" aria-hidden="true" />
            <p className="text-label text-reca-gray-medium">Aucune zone tracée pour l'instant.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {zones.map((zone) => (
              <li key={zone.id} className="flex items-center justify-between text-label text-reca-black">
                <span>{zone.label}</span>
                <span className="text-reca-gray-medium">{zone.surfaceM2.toFixed(2)} m²</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
