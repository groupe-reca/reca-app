import { ClientSearchPicker } from '@/features/clients/components/ClientSearchPicker'
import type { Client } from '@/features/clients/types/client.types'
import { AddressPreviewCard } from './AddressPreviewCard'

type WizardStepClientProps = {
  client: Client | null
  onClientChange: (client: Client) => void
  onOpenMeasurementTool: () => void
}

/**
 * Étape 1 "Client & Propriété" — sélection/création du client + validation de
 * l'adresse. L'analyse complète de la propriété (tracé de zones) est désormais
 * optionnelle (tâche 5) : elle ne s'ouvre que si l'utilisateur appuie sur
 * "Outil de mesure" dans `AddressPreviewCard`. Tous les autres champs qui
 * vivaient ici auparavant (type, saison, dates, mode de conclusion,
 * renouvellement) sont retirés ou proviennent désormais des paramètres par
 * défaut du Wizard (voir `contracts.service.ts`).
 */
export function WizardStepClient({ client, onClientChange, onOpenMeasurementTool }: WizardStepClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <ClientSearchPicker value={client} onChange={onClientChange} />
      {client && <AddressPreviewCard client={client} onOpenMeasurementTool={onOpenMeasurementTool} />}
    </div>
  )
}
