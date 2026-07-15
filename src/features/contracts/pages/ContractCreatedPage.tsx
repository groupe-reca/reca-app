import { CheckCircle2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/Button'
import { QueryState } from '@/components/ui/QueryState'
import type { Client } from '@/features/clients/types/client.types'
import { useClient } from '@/features/clients/hooks/useClient'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { toast } from '@/stores/toastStore'
import { ContractDocumentPreview } from '../components/contract-document/ContractDocumentPreview'
import type { ContractDocumentData } from '../components/contract-document/types'
import { ContractSummaryStats } from '../components/ContractSummaryStats'
import { useContract } from '../hooks/useContract'
import type { ContractZoneFormValues } from '../schemas/contractCreation.schema'
import type { Contract } from '../types/contract.types'

type ContractCreatedLocationState = {
  contract: Contract
  client: Client
  zones: ContractZoneFormValues[]
}

function isContractCreatedState(state: unknown): state is ContractCreatedLocationState {
  return Boolean(state && typeof state === 'object' && 'contract' in state && 'client' in state)
}

/**
 * Page de confirmation affichée après "Créer" (dernière étape du Wizard) — remplace
 * l'ancien comportement (toast + retour sur `/contracts/:id`). Les données arrivent
 * normalement via `location.state` (poussées par `useContractWizardState.handleCreate`,
 * zéro fetch réseau supplémentaire). Filet de sécurité si cet état est absent
 * (rafraîchissement de page, navigation directe sur l'URL) : refetch contrat+client
 * via les hooks existants — `zones` reste vide dans ce cas (`Contract` ne stocke que
 * le total `superficie`, pas le détail par zone), dégradation acceptée pour ce sprint.
 */
export function ContractCreatedPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const locationState = isContractCreatedState(location.state) ? location.state : null
  const shouldRefetch = !locationState

  const { data: settings, isLoading: isSettingsLoading, isError: isSettingsError } = useSettings()
  const {
    data: fetchedContract,
    isLoading: isContractLoading,
    isError: isContractError,
  } = useContract(shouldRefetch ? id : '')
  const {
    data: fetchedClient,
    isLoading: isClientLoading,
    isError: isClientError,
  } = useClient(shouldRefetch ? (fetchedContract?.clientId ?? '') : '')

  const contract = locationState?.contract ?? fetchedContract
  const client = locationState?.client ?? fetchedClient
  const zones = locationState?.zones ?? []

  const isLoading = isSettingsLoading || (shouldRefetch && (isContractLoading || isClientLoading))
  const isError = isSettingsError || (shouldRefetch && (isContractError || isClientError))
  const readyData: ContractDocumentData | undefined =
    settings && contract && client ? { settings, contract, client, zones } : undefined

  function handlePlaceholder() {
    toast.success('Cette fonctionnalité arrive au prochain sprint.')
  }

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-8 px-4 py-8">
      <QueryState
        isLoading={isLoading}
        isError={isError}
        data={readyData}
        errorLabel="Impossible de charger ce contrat."
      >
        {(data) => (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center text-center"
            >
              <span className="mb-4 flex size-16 items-center justify-center rounded-full bg-reca-success text-white">
                <CheckCircle2 className="size-9" aria-hidden="true" />
              </span>
              <h1 className="text-section font-semibold text-reca-black">Contrat enregistré !</h1>
              <p className="mt-1 text-body text-reca-gray-medium">
                Votre contrat a été créé avec succès. Vous pouvez maintenant le consulter ou l'envoyer à votre
                client.
              </p>
            </motion.div>

            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_380px]">
              <ContractDocumentPreview {...data} />
              <ContractSummaryStats contract={data.contract} client={data.client} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Button variant="secondary" onClick={() => navigate('/contracts')}>
                Fermer
              </Button>
              <Button variant="secondary" onClick={handlePlaceholder}>
                Voir le contrat (PDF)
              </Button>
              <Button onClick={handlePlaceholder}>Envoyer le contrat</Button>
            </div>
          </>
        )}
      </QueryState>
    </div>
  )
}
