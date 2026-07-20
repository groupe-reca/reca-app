import { Clock, MapPinned, Ruler, Truck } from 'lucide-react'
import { DEPOT_NEIGE_OPTIONS, SERVICE_OPTIONS } from '../../constants/wizardOptions'
import { DocumentSectionHeader } from './DocumentSectionHeader'
import type { ContractDocumentData } from './types'

type DocumentServicesModalitesProps = Pick<ContractDocumentData, 'contract'>

/** Carte Services (tuiles actives) + carte Modalités d'exécution — colonne gauche du document. */
export function DocumentServicesModalites({ contract }: DocumentServicesModalitesProps) {
  const activeServices = contract.services.filter((service) => service.active)

  const modalites = [
    { icon: Ruler, label: "Seuil d'intervention", value: `${contract.seuilDeclenchementCm} cm` },
    { icon: Clock, label: 'Heure limite de dégagement', value: contract.heurePremierPassage },
    {
      icon: MapPinned,
      label: 'Dépôt de la neige',
      value: DEPOT_NEIGE_OPTIONS.find((option) => option.value === contract.depotNeige)?.label ?? '—',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-card bg-white p-5 shadow-card">
        <DocumentSectionHeader title="Services" />
        <div className="flex flex-col gap-2">
          {activeServices.length === 0 && (
            <p className="text-body text-reca-gray-medium">Aucun service actif.</p>
          )}
          {activeServices.map((service) => (
            <div key={service.code} className="flex items-center gap-3 rounded-control bg-reca-snow p-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-reca-red/10 text-reca-red">
                <Truck className="size-5" aria-hidden="true" />
              </span>
              <span className="text-body font-semibold uppercase text-reca-black">
                {SERVICE_OPTIONS.find((option) => option.code === service.code)?.label ?? service.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card bg-white p-5 shadow-card">
        <DocumentSectionHeader title="Modalités d'exécution" />
        <div className="flex flex-col gap-3">
          {modalites.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between gap-3 border-b border-reca-gray-light pb-2 last:border-0">
              <span className="flex items-center gap-2 text-label text-reca-gray-medium">
                <Icon className="size-4 text-reca-red" aria-hidden="true" />
                {label.toUpperCase()}
              </span>
              <span className="text-body font-semibold text-reca-warning">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
