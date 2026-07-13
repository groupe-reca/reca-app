import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/format'
import type { Client } from '@/features/clients/types/client.types'
import { SurfaceSummary } from './SurfaceSummary'
import { MODE_PAIEMENT_OPTIONS, SERVICE_OPTIONS } from '../../constants/wizardOptions'
import { generateClauses } from '../../utils/generateClauses'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'

type WizardStepValidationProps = {
  client: Client
  control: Control<ContractCreationFormValues>
}

/** Étape 6 — résumé complet en lecture seule. Créer/Brouillon sont dans le footer du wizard. */
export function WizardStepValidation({ client, control }: WizardStepValidationProps) {
  const zones = useWatch({ control, name: 'zones' }) ?? []
  const services = useWatch({ control, name: 'services' }) ?? []
  const obligations = useWatch({ control, name: 'obligations' })
  const modalitesPaiement = useWatch({ control, name: 'modalitesPaiement' }) ?? []
  const modePaiement = useWatch({ control, name: 'modePaiement' })
  const prix = useWatch({ control, name: 'prix' })

  const clauses = useMemo(() => (obligations ? generateClauses(obligations) : null), [obligations])
  const activeServices = services.filter((service) => service.active)
  const modeLabel = MODE_PAIEMENT_OPTIONS.find((mode) => mode.value === modePaiement)?.label ?? '—'

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h2 className="mb-2 text-subtitle font-semibold text-reca-black">Client</h2>
        <p className="text-body text-reca-black">
          {client.prenom} {client.nom}
        </p>
        <p className="text-body text-reca-gray-medium">{client.adresse ?? 'Adresse non renseignée'}</p>
      </Card>

      <SurfaceSummary zones={zones} />

      <Card>
        <h2 className="mb-2 text-subtitle font-semibold text-reca-black">Services</h2>
        {activeServices.length === 0 && <p className="text-body text-reca-gray-medium">Aucun service sélectionné.</p>}
        <ul className="flex flex-col gap-1">
          {activeServices.map((service) => (
            <li key={service.code} className="text-body text-reca-black">
              {SERVICE_OPTIONS.find((option) => option.code === service.code)?.label ?? service.label}
              {service.precisions && <span className="text-reca-gray-medium"> — {service.precisions}</span>}
            </li>
          ))}
        </ul>
      </Card>

      {clauses && (
        <Card>
          <h2 className="mb-2 text-subtitle font-semibold text-reca-black">Clauses générées</h2>
          <div className="flex flex-col gap-2 text-body text-reca-gray-medium">
            <p>
              <strong className="text-reca-black">Obligations du client :</strong> {clauses.obligationsClient}
            </p>
            <p>
              <strong className="text-reca-black">Exclusions :</strong> {clauses.exclusions}
            </p>
            <p>
              <strong className="text-reca-black">Nettoyage final :</strong> {clauses.nettoyageFinal}
            </p>
            <p>
              <strong className="text-reca-black">Responsabilités :</strong> {clauses.responsabilites}
            </p>
          </div>
        </Card>
      )}

      <Card>
        <h2 className="mb-2 text-subtitle font-semibold text-reca-black">Paiement</h2>
        <p className="mb-2 text-body text-reca-gray-medium">
          Mode de paiement : {modeLabel}
          {prix && ` · Prix : ${formatCurrency(Number(prix))}`}
        </p>
        <ul className="flex flex-col gap-1">
          {modalitesPaiement.map((entry, index) => (
            <li key={index} className="text-body text-reca-black">
              {entry.description} — {entry.type === 'pourcentage' ? `${entry.valeur}%` : formatCurrency(Number(entry.valeur))} (
              {entry.dateEcheance || 'date à définir'})
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
