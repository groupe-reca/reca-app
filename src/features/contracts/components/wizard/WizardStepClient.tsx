import { ClientSearchPicker } from '@/features/clients/components/ClientSearchPicker'
import type { Client } from '@/features/clients/types/client.types'
import { AddressPreviewCard } from './AddressPreviewCard'

type WizardStepClientProps = {
  client: Client | null
  onClientChange: (client: Client) => void
  onOpenMeasurementTool: () => void
}

/**
 * Étape 1 "Client & Propriété" — sélection/création du client, validation de
 * l'adresse. L'analyse complète de la propriété (tracé de zones) est optionnelle
 * (tâche 5 du 2026-07-15) : elle ne s'ouvre que si l'utilisateur appuie sur "Outil
 * de mesure" dans `AddressPreviewCard`. Prix/échéancier, déplacés ici
 * temporairement par la tâche 11 (2026-07-16), sont repartis vers l'étape
 * "Paiement" (`WizardStepTerms.tsx`) par la tâche 5 du 2026-07-17 (nom de fichier
 * réutilisé, `.input/tache5.md`).
 */
export function WizardStepClient({ client, onClientChange, onOpenMeasurementTool }: WizardStepClientProps) {
  return (
    <div className="flex flex-col gap-6">
      <ClientSearchPicker value={client} onChange={onClientChange} />
      {client && <AddressPreviewCard client={client} onOpenMeasurementTool={onOpenMeasurementTool} />}
    </div>
  )
}
