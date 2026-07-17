import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/format'
import type { Client } from '@/features/clients/types/client.types'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { SurfaceSummary } from './SurfaceSummary'
import { useContractWizardDefaults } from '../../hooks/useContractWizardDefaults'
import { DEPOT_NEIGE_OPTIONS, MODE_PAIEMENT_OPTIONS, SERVICE_OPTIONS } from '../../constants/wizardOptions'
import { generateClauses } from '../../utils/generateClauses'
import { computeInstallmentAmount } from '../../utils/paymentPresets'
import type { ContractCreationFormValues } from '../../schemas/contractCreation.schema'
import type { ObligationsAnswers } from '../../types/contract.types'

const CLIENT_TYPE_LABELS: Record<string, string> = {
  residentiel: 'Résidentiel',
  commercial: 'Commercial',
}

type WizardStepValidationProps = {
  client: Client
  control: Control<ContractCreationFormValues>
}

/**
 * Étape "Révision" — résumé complet en lecture seule. Créer/Brouillon sont dans
 * le footer/header du wizard. Tâche 5 : type de client, saison/dates, services,
 * seuil/heure/dépôt de neige et mode de conclusion ne sont plus des champs du
 * formulaire — affichés ici depuis le client sélectionné et les paramètres par
 * défaut du Wizard (`useContractWizardDefaults`).
 */
export function WizardStepValidation({ client, control }: WizardStepValidationProps) {
  const zones = useWatch({ control, name: 'zones' }) ?? []
  const modalitesPaiement = useWatch({ control, name: 'modalitesPaiement' }) ?? []
  const modePaiement = useWatch({ control, name: 'modePaiement' })
  const prix = useWatch({ control, name: 'prix' })

  const { data: settings } = useSettings()
  const { data: defaults } = useContractWizardDefaults()

  const clientTypeLabel = client.typeClient ? (CLIENT_TYPE_LABELS[client.typeClient] ?? null) : null

  const clauses = useMemo(() => {
    if (!defaults) return null
    const obligations: ObligationsAnswers = {
      seuilDeclenchementCm: defaults.seuilDeclenchementCm,
      heurePremierPassage: defaults.heurePremierPassage,
      depotNeige: defaults.depotNeige,
      permisMunicipalObtenu: false,
    }
    return generateClauses(obligations, {
      type: clientTypeLabel,
      modeConclusion: defaults.modeConclusion,
      assurancePoliceNo: settings?.assurancePoliceNo ?? null,
    })
  }, [defaults, clientTypeLabel, settings])

  const activeServices = defaults
    ? SERVICE_OPTIONS.filter((option) => defaults.serviceCodes.includes(option.code))
    : []
  const modeLabel = MODE_PAIEMENT_OPTIONS.find((mode) => mode.value === modePaiement)?.label ?? '—'
  const depotLabel = defaults
    ? (DEPOT_NEIGE_OPTIONS.find((option) => option.value === defaults.depotNeige)?.label ?? '—')
    : '—'

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h2 className="mb-2 text-subtitle font-semibold text-reca-black">Client</h2>
        <p className="text-body text-reca-black">
          {client.prenom} {client.nom}
          {clientTypeLabel && <span className="text-reca-gray-medium"> — {clientTypeLabel}</span>}
        </p>
        <p className="text-body text-reca-gray-medium">{client.adresse ?? 'Adresse non renseignée'}</p>
      </Card>

      <SurfaceSummary zones={zones} />

      <Card>
        <h2 className="mb-2 text-subtitle font-semibold text-reca-black">Services</h2>
        {activeServices.length === 0 && (
          <p className="text-body text-reca-gray-medium">Aucun service actif par défaut.</p>
        )}
        <ul className="flex flex-col gap-1">
          {activeServices.map((service) => (
            <li key={service.code} className="text-body text-reca-black">
              {service.label}
            </li>
          ))}
        </ul>
      </Card>

      {defaults && (
        <Card>
          <h2 className="mb-2 text-subtitle font-semibold text-reca-black">Modalités d'exécution</h2>
          <div className="flex flex-col gap-1 text-body text-reca-gray-medium">
            <p>Seuil d'intervention : {defaults.seuilDeclenchementCm} cm</p>
            <p>Heure limite de dégagement : {defaults.heurePremierPassage}</p>
            <p>Dépôt de la neige : {depotLabel}</p>
          </div>
        </Card>
      )}

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
            <p>
              <strong className="text-reca-black">Annulation / résolution :</strong> {clauses.clauseAnnulation}
            </p>
            <p>
              <strong className="text-reca-black">Prix :</strong> {clauses.clausePrix}
            </p>
            <p>
              <strong className="text-reca-black">Exécution :</strong> {clauses.clauseExecution}
            </p>
            <p>
              <strong className="text-reca-black">Assurance et responsabilité :</strong> {clauses.clauseAssurance}
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
              {entry.description} —{' '}
              {formatCurrency(
                computeInstallmentAmount({ type: entry.type, valeur: Number(entry.valeur) }, prix ? Number(prix) : null),
              )}{' '}
              ({entry.dateEcheance || 'date à définir'})
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
